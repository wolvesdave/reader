TU_EMAIL_REGEX = new RegExp('^testuser*');
SP_APP_NAME = 'Reader Test';
TEST_CREDS_TMP_FILE = './tmp/readerTestCreds.js';

var async = require('async');
var dbConfig = require('../config/db.js');
var mongodb = require('mongodb');
assert = require('assert');

var mongoClient = mongodb.MongoClient
var reader_test_db = null;
var users_array = null;

function connectDB(callback) {
 	mongoClient.connect('dbConfig.url', function(err, db) {
 		assert.equal(null, err);
 		reader_test_db = db;
 		callback(null);
 	});
 }

function lookupUserKeys(callback) {
 	console.log("lookupUserKeys");
 	user_coll = reader_test_db.collection('user');
 	user_coll.find({email : TU_EMAIL_REGEX}).toArray(function(err, users) {
 		users_array = users;
 		callback(null);
 	});
 }

function writeCreds(callback) {
 	var fs = require('fs');
 	fs.writeFileSync(TEST_CREDS_TMP_FILE, 'TEST_USERS = ');
 	fs.appendFileSync(TEST_CREDS_TMP_FILE, JSON.stringify(users_array));
 	fs.appendFileSync(TEST_CREDS_TMP_FILE, '; module.exports = TEST_USERS;');
 	callback(0);
 }

function closeDB(callback) {
 	reader_test_db.close();
 }

async.series([connectDB, lookupUserKeys, writeCreds, closeDB]);
