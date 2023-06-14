'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

admin.initializeApp();
app.use(cors({ origin: true }));

app.post('/mock', async (request, response) => {
    const bodyText = request.body
    let snapshot = await admin.database().ref('/mock-api').push(bodyText);

    response.send(snapshot)
});

app.get('/mock', async (request, response) => {
    const bodyText = request.body
    let snapshot = await admin.database().ref('/mock-api').on(bodyText);

    response.send(snapshot)
});

exports.mock = functions.https.onRequest(app)
