require('dotenv').config()
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const firebase      = require('firebase');
const apiRouter     = require('./routes/api');

// Firebase Setup
var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOM,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BCKT,
    messagingSenderId: process.env.MSG_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    next();
});
// Routes
app.use('/api',apiRouter);

// Init App
const port = process.env.PORT || 3001;
app.listen(port,() => {
    console.log(`Listening to port ${port}`);
});