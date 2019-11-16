const express = require('express');
const request = require('request-promise');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = express();

/**
 * NOTE: Copied from db-connector.
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

/**
 * NOTE: copied from db-connector
 */
app.get('/status', async (req, res) => {
  const response = await auth(req.headers);
  if (response.error !== null) {
    res.send(JSON.stringify({ status: 'error', error: response.error }));
    return;
  }
  res.send(JSON.stringify({ status: 'ok', results: response }));
});

app.get('/:hpid/:filename', async (req, res) => {
  const { hpid, filename } = req.params;
  if (!hpid || !filename) {
    res.status(400);
    res.set('Connection', 'close');
    return;
  }
  const response = await auth(req.headers);
  if (response.error === null) {
    const userHpid = response.result.user.hpidId;
    if (hpid === userHpid) {
      res.sendFile(`/images/${hpid}/${filename}`);
      return;
    }
  }
  res.set('Connection', 'close');
  res.status(401);
});

async function main() {
  app.listen(8080, () => {
    console.log('ImageGate listening on port 8080!');
  });
}

(async () => main())();
