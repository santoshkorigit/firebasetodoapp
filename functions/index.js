const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
var fs = require('fs');
var bodyParser = require('body-parser');
var routes = require('./router');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var urlEncodedParser = bodyParser.urlencoded({ extended : true});
var jsonParser = bodyParser.json();

var serviceAccount = require("./../serviceAccountKey.json");
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smartytaskapp-5763b.firebaseio.com"
});

const db = admin.firestore();
const firestoreSettings = {timestampsInSnapshots: true};
db.settings(firestoreSettings);

app.get('/', (request, response) => {
    // response.set('Cache-Control','public, max-age=300, s-maxage=600');
    var userRef = db.collection('task');
    var userDoc = userRef.get()
        .then( doc => {
            let tasks = mergeSubCollectionFields(doc);
            console.log(JSON.stringify(tasks));
            response.render('index',{ tasks });
            return true;
        })
        .catch(err => {
            //response.send("500");
            console.log("There is an error while fetching system user for "+err);
            next(err);
        });
});

const mergeSubCollectionFields = (subCollection) => {
	const json = {};

	subCollection.forEach((field) => {
		json[`${field.id}`] = field.data();
	});

	return json;
};

app.get('/task', jsonParser, (request, response, next) => {
    var userRef = db.collection('task');
    var userDoc = userRef.get()
        .then( doc => {
            response.json(mergeSubCollectionFields(doc));
            //response.send(doc.data());
            return true;
        })
        .catch(err => {
            //response.send("500");
            console.log("There is an error while fetching system user for "+err);
            next(err);
        });
    return false;
});
app.get('/task/:id', jsonParser, (request, response, next) => {
    var taskDetailRef = db.collection('task').doc(request.params.id);
    var taskDetail = taskDetailRef.get()
        .then( doc => {
            response.json(doc.data());
            //response.send(doc.data());
            return true;
        })
        .catch(err => {
            //response.send("500");
            console.log("There is an error while fetching system user for "+err);
            next(err);
        });
    return false;
});

exports.app = functions.https.onRequest(app);
