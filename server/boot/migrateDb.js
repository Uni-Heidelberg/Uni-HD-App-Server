var app = require('../server.js');

var db = app.datasources.appserver;

db.isActual(
  function (err, actual) {
    if (!actual) {
      console.log('Database needs update, automigrating table structure from model...');
      db.automigrate(function () {
      });
    }
  }
);
