'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

admin.initializeApp();
app.use(cors({ origin: true }));

app.post('/', async (request, response) => {
    const bodyText = request.body
    let snapshot = await admin.database().ref('/mock-api').push(bodyText);
    let key = await snapshot.key
    response.send(key)
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

exports.mock = functions.https.onRequest(app)
