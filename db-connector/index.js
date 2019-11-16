const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise');
const request = require('request-promise');
const sanitizeHtml = require('sanitize-html');

const MAX_IMAGEGROUP_NAME_LENGTH = 256;

// ignore self signed certs.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = express();
app.use(cookieParser());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: '1gb', extended: false }));
app.use(bodyParser.raw({ limit: '1gb', type: 'application/pdf' }));

// TODO(): Put the proper credentials here (based off env. vars)
let con = null;

/**
 *
 * @param {*} headers
 * @param {*} callback
 * @param {*} errCallback
 */
async function auth(headers) {
  const options = {
    url: '',
    json: true,
    headers: {
      cookie: headers.cookie,
      referer: headers.referer,
    },
  };
  try {
    const response = await request(options);
    if (response && response.user && response.user.hpidId) {
      return {
        result: response,
        error: null,
      };
    }
    return {
      result: response,
      error: 'Not authenticated',
    };
  } catch (error) {
    return {
      result: null,
      error,
    };
  }
}

app.get('/status', async (req, res) => {
  const response = await auth(req.headers);
  if (response.error !== null) {
    res.send(JSON.stringify({ status: 'error', error: response.error }));
    return;
  }
  res.send(JSON.stringify({ status: 'ok', results: response }));
});

app.post('/upload', async (req, res) => {
  const authResponse = await auth(req.headers);
  if (authResponse.error !== null) {
    res.send(JSON.stringify({ status: 'error', error: 'Not authenticated' }));
    return;
  }
  const hpid = authResponse.result.user.hpidId;
  const pdfName = sanitizeHtml(req.get('PDF-Name'));
  if (!req.body) {
    res.send(JSON.stringify({ status: 'error', error: 'No file uploaded' }));
    return;
  }
  if (!pdfName || pdfName > MAX_IMAGEGROUP_NAME_LENGTH) {
    res.send(JSON.stringify({ status: 'error', error: 'No PDF file name' }));
    return;
  }
  let queryResults;
  try {
    queryResults = await con.execute('INSERT INTO groups (owner_hpid) values (?)', [hpid]);
  } catch (error) {
    res.send(JSON.stringify({ status: 'error', error, authResponse }));
    return;
  }
  const imageGroupId = queryResults[0].insertId;
  // Dave Help dont know what to do about this in order to make sure it is safe.
  const pdfBuffer = req.body;
  const options = {
    url: 'http://pdf-render/',
    formData: {
      pdfBuffer,
      pdfName,
      hpid,
    },
  };
  let reqResponse;
  try {
    console.log('sending request to pdf renderer...');
    reqResponse = await request.post(options);
  } catch (error) {
    res.send(JSON.stringify({ status: 'error', error }));
    return;
  }
  let body;
  try {
    body = JSON.parse(reqResponse);
  } catch (error) {
    res.send(JSON.stringify({ status: 'error', error: 'Unable to parse metadata' }));
    return;
  }
  if (body.status !== 'ok') {
    res.send(JSON.stringify({ status: 'error', error: body.error }));
    return;
  }
  console.log(body.metaData);
  const nPages = +body.metaData.Pages;
  if (!nPages) {
    res.send(JSON.stringify({ status: 'error', error: 'Failure to parse metadata' }));
    return;
  }
  let insertImages = 'INSERT into images (uri, imageIndex, groupID, metadata) values ';
  const uriPrefix = `https://localhost/images/${hpid}/${pdfName}`;
  const insertImagesParams = [];
  for (let i = 1; i <= nPages; i += 1) {
    const uri = `${uriPrefix}${i}.png`;
    insertImagesParams.push(uri);
    insertImagesParams.push(i);
    insertImagesParams.push(imageGroupId);
    insertImagesParams.push(JSON.stringify(body.metaData));
    // insertImagesParams.push(body.metaData[i]);
    insertImages += '(?, ?, ?, ?)';
    if (i !== nPages) {
      insertImages += ', ';
    }
  }
  insertImages = mysql.format(insertImages, insertImagesParams);
  try {
    await con.execute(insertImages);
  } catch (error) {
    res.send(JSON.stringify({ status: 'error', error }));
    return;
  }
  let updateMetaData = 'UPDATE groups SET metadata = ?, name = ? where id = ?';
  console.log(body);
  updateMetaData = mysql.format(updateMetaData, [
    JSON.stringify(body.metaData),
    pdfName,
    imageGroupId,
  ]);
  console.log(updateMetaData);
  try {
    await con.execute(updateMetaData);
    res.send(JSON.stringify({ status: 'ok', insertId: imageGroupId }));
  } catch (error) {
    res.send(JSON.stringify({ status: 'error', error }));
  }
});

app.get('/getImageGroups', async (req, res) => {
  const response = await auth(req.headers);
  if (response.error === null) {
    const hpid = response.result.user.hpidId;
    try {
      const queryResults = await con.execute('SELECT id, created, name, metadata from groups where owner_hpid = ?', [hpid]);
      // Very strange that the first element is all of the image groups and the rest of the array
      // are buffers.
      res.send(JSON.stringify({ status: 'ok', results: queryResults[0] }));
    } catch (error) {
      res.send(JSON.stringify({ status: 'error', error, response }));
    }
  }
});

app.get('/getImageGroup/:groupID', async (req, res) => {
  const { groupID } = req.params;
  if (!groupID || Number.isNaN(+groupID)) {
    res.send(JSON.stringify({ status: 'error', error: 'groupID not properly specified' }));
    return;
  }
  const response = await auth(req.headers);
  if (response.error === null) {
    try {
      const queryResults = await con.execute('SELECT uri, imageIndex from images where groupID=?', [groupID]);
      res.send(JSON.stringify({ status: 'ok', results: queryResults[0] }));
    } catch (error) {
      res.send(JSON.stringify({ status: 'error', error }));
    }
  }
});

app.post('/deleteImageGroup/:groupID', async (req, res) => {
  const { groupID } = req.params;
  if (!groupID || Number.isNaN(+groupID)) {
    res.send(JSON.stringify({ status: 'error', error: 'groupID not properly specified' }));
    return;
  }
  const response = await auth(req.headers);
  if (response.error === null) {
    const hpid = response.result.user.hpidId;
    let authUserImageGroup = 'SELECT COUNT (*) AS total FROM groups WHERE id=? AND owner_hpid=?';
    let authUserImageGroupResponse;
    authUserImageGroup = mysql.format(authUserImageGroup, [
      groupID,
      hpid,
    ]);
    try {
      authUserImageGroupResponse = await con.execute(authUserImageGroup);
    } catch (error) {
      res.send(JSON.stringify({ status: 'error', error }));
      return;
    }
    if (authUserImageGroupResponse[0][0].total !== 1) {
      res.send(JSON.stringify({ status: 'error', error: 'Not authenticated', authUserImageGroupResponse }));
      return;
    }
    let deleteImageGroup = 'DELETE FROM `groups` WHERE id=? AND owner_hpid=?';
    deleteImageGroup = mysql.format(deleteImageGroup, [
      groupID,
      hpid,
    ]);
    let deleteImages = 'DELETE FROM images WHERE groupID=?';
    deleteImages = mysql.format(deleteImages, [
      groupID,
    ]);
    try {
      await con.execute(deleteImageGroup);
      await con.execute(deleteImages);
      res.send(JSON.stringify({ status: 'ok', deleteID: groupID }));
    } catch (error) {
      res.send(JSON.stringify({ status: 'error', error }));
    }
  }
});

app.post('/changeImageGroupName/:groupID', async (req, res) => {
  const { groupID } = req.params;
  if (!groupID || Number.isNaN(+groupID)) {
    res.send(JSON.stringify({ status: 'error', error: 'groupID not properly specified' }));
    return;
  }
  const newName = req.body.name;
  if (!newName || newName.length > MAX_IMAGEGROUP_NAME_LENGTH) {
    res.send(JSON.stringify({ status: 'error', error: 'Name not properly specified' }));
    return;
  }
  const response = await auth(req.headers);
  if (response.error === null) {
    const hpid = response.result.user.hpidId;
    let changeImageGroupName = 'UPDATE groups SET name=? WHERE id=? AND owner_hpid=?';
    changeImageGroupName = mysql.format(changeImageGroupName, [
      sanitizeHtml(newName),
      groupID,
      hpid,
    ]);
    try {
      await con.execute(changeImageGroupName);
      res.send(JSON.stringify({ status: 'ok', changeID: groupID }));
    } catch (error) {
      res.send(JSON.stringify({ status: 'error', error }));
    }
  }
});
// Add more CRUD operations as they come up.

// Thanks, stackoverflow
function sleep(ms) {
  const start = new Date().getTime();
  const expire = start + ms;
  while (new Date().getTime() < expire);
}

async function main() {
  console.log('Trying to listen again...');
  try {
    con = await mysql.createPool({
      host: '138.197.197.188',
      port: '3306',
      user: 'monte',
      password: 'secure_Corndogs?9',
      database: 'company',
    });
  } catch (error) {
    console.log(error);
  }
  let server = null;
  try {
    server = await app.listen(8080, () => {
      console.log('DB-Connector listening on port 8080!');
    });
  } catch (e) {
    server.close(() => {});
    console.error(e);
    sleep(1000);
    main();
  }
}

(async () => main())();
