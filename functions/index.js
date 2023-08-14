'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
const QRCode = require('qrcode')
const fetch = require("node-fetch");

admin.initializeApp();
app.use(cors({ origin: true }));

app.post('/', async (request, response) => {
    const bodyText = request.body
    let snapshot = await admin.database().ref('/mock-api').push(bodyText);
    let key = await snapshot.key
    response.send(key)
});

app.post('/:tagId', async (request, response) => {
    const tagId = request.params.tagId
    if (tagId) {
        const bodyText = request.body
        let snapshot = await admin.database().ref('/mock-api/'+tagId).push(bodyText);
        let key = await snapshot.key
        response.send(key)
    } else {
        response.status(404)
        response.send()
    }
});

app.post('/set/:tagId', async (request, response) => {
    const tagId = request.params.tagId
    if (tagId) {
        const bodyText = request.body
        let snapshot = await admin.database().ref('/mock-api/'+tagId).set(bodyText);
        let key = await snapshot.key
        response.send(key)
    } else {
        response.status(404)
        response.send()
    }
});

app.get('/', async (request, response) => {
    const mockId = request.query.id

    if (mockId) {
        admin.database().ref('/mock-api/'+mockId).once('value', (data) => {
            response.send(data)
        }).catch(() => response.send({}))
    } else {
        response.send({})
    }
});

app.get('/qrcode-generator/', async (request, response) => {
    const textToGenerate = request.query.text

    if (textToGenerate) {
        QRCode.toDataURL(textToGenerate, {
            errorCorrectionLevel: 'H'
            // type: 'svg'
        }, function(err, data) {
            if (err) throw response.send(err)

            response.send(data);
        })
    } else {
        response.send()
    }
});

app.get('/get-json-extractor/', async (request, response) => {
    const urlToJSON = request.query.url
    const fieldToMap = request.query.field
    const fieldList = fieldToMap.split('.')

    if (urlToJSON) {
        fetch(urlToJSON, { headers: { 'accept': 'application/json; charset=utf8;' } })
            .then(async (responseFetch) => {
                let jsonArray = await responseFetch.json()
                fieldList.forEach(field => {
                    if (field !== fieldList[0]) {
                        let items = []
                        for (let i of jsonArray) {
                            items.push(i[0])
                        }
                        jsonArray = items
                    }
                    jsonArray = jsonArray.map(item => item[field])
                });
                // console.log(jsonArray.reduce((res, item) => [...res, ...item], []))
                // jsonArray = jsonArray.flat().map(item => item[fieldList]).join('')
                // jsonArray = jsonArray.map(item => item[fieldList[0]])

                response.send(jsonArray);
            })
            .catch((error) => response.send(error));
    } else {
        response.status(404)
        response.send()
    }
});

exports.mock = functions.runWith({enforceAppCheck: true}).https.onRequest(app)
