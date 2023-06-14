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

    response.send(snapshot.key)
});

app.get('/', async (request, response) => {
    const mockId = request.query.toString()
    console.log(mockId)
    if (mockId) {
        let snapshot = await admin.database().ref('/mock-api/'+mockId).get();
        response.send(snapshot.data)
    } else {
        response.send({})
    }
});

exports.mock = functions.https.onRequest(app)
