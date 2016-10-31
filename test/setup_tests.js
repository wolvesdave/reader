TU_EMAIL_REGEX = new RegExp('^testuser*');
SP_APP_NAME = 'Reader Test';
TEST_CREDS_TMP_FILE = './tmp/readerTestCreds.js';

var async = require('async');
var dbConfig = require('../config/db.js');
var mongodb = require('mongodb');
assert = require('assert');

var stormpath = require('stormpath');
/* var stormpathConfig = require('../config/stormpath_apikey.properties') */

var client = new stormpath.Client({
  apiKey: {
    id: '1GTP266RYID4QBWVN9HL07VD6',
    secret: 'sNzyD5+GmyWkH4UMJSyzASYVZ7QLqoOLb3Vmj1W5YdE'
  }
});

var mongoClient = mongodb.MongoClient
var reader_test_db = null;
var users_array = null;


function connectDB(callback) {
    mongoClient.connect(dbConfig.url, function(err, db) {
        assert.equal(null, err);
        reader_test_db = db;
        console.log("Connected correctly to server");
        callback(0);
    });
}

function dropUserCollection(callback) {
        console.log("dropUserCollection");
        user = reader_test_db.collection('user');
        if (undefined != user) {
            user.drop(function(err, reply) {
                console.log('user collection dropped');
                callback(0);
            });
        } else {
            callback(0);
        }
    }

function dropUserFeedEntryCollection(callback) {
        console.log("dropUserFeedEntryCollection");
        user_feed_entry = reader_test_db.collection('user_feed_entry');
        if (undefined != user_feed_entry) {
            user_feed_entry.drop(function(err, reply) {
                console.log('user_feed_entry collection dropped');
                callback(0);
            });
        } else {
            callback(0);
        }
    }

function getApplication(callback) {
        console.log("getApplication");
        client.getApplications({
            name: SP_APP_NAME
        }, function(err, applications) {
            console.log(applications);
            if (err) {
                log("Error in getApplications");
                throw err;
            }
            app = applications.items[0];
            callback(0);
        });
    }

    function deleteTestAccounts(callback) {
        app.getAccounts({
            email: TU_EMAIL_REGEX
        }, function(err, accounts) {
            if (err) throw err;
            accounts.items.forEach(function deleteAccount(account) {
                account.delete(function deleteError(err) {
                    if (err) throw err;
                });
            });
            callback(0);
        });
    }

function closeDB(callback) {
    reader_test_db.close();
}

async.series([connectDB, dropUserCollection, dropUserFeedEntryCollection, dropUserFeedEntryCollection, getApplication, deleteTestAccounts, closeDB]);
