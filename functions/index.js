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

    response.send(snapshot.id)
});

app.get('/', async (request, response) => {
    const bodyText = request.query.toString()
    console.log(bodyText)
    let snapshot = await admin.database().ref('/mock-api/'+bodyText).get();
    let jsonResponse = JSON.parse(snapshot.data)
    response.send(jsonResponse)
});

exports.mock = functions.https.onRequest(app)
