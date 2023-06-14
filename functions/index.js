'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const runtimeOpts = {
    timeoutSeconds: 540,
    memory: '4GB'
}

exports.mock = functions.runWith(runtimeOpts).https.onRequest(async (request, response) => {
    const bodyText = request.body
    // console.log(JSON.stringify(handList, null, 2))
    let snapshot = await admin.database().ref('/mock-api').push(bodyText);

    response.send(snapshot)
})

exports.mock = functions.runWith(runtimeOpts).https.onCall(async (request, response) => {
    const bodyText = request.body
    let snapshot = await admin.database().ref('/mock-api').on(bodyText);

    response.send(snapshot)
})
