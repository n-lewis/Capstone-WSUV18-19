module.exports = {
    getQueryParam(param) {
        // https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
        var result = null, tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === param) result = decodeURIComponent(tmp[1]);
        }
        return result;
    },
    postData(url = ``, data = {}) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => response.json()); // parses response to JSON
    },
    log (str) {
        // Logging for debugging only
        if (process.env.ENV === 'DEVELOP' || process.env.ENV === 'DEV') {
            console.log(str);
        }
    },
};