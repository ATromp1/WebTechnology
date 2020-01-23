// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas. 
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.


// ###############################################################################
//
// Database setup:
// First: Open sqlite database file, create if not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// ###############################################################################
// Routes
// 
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
// ###############################################################################



app.all("*", function(req, res, next) {
	// Add Access-Control-Allow-Origin * to each header to allow cross domain requests
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,    Content-Type, Accept");
	next();
});

app.get('/products', function(req, res) {
	// Example SQL statement to select the name of all products from a specific brand
	db.all("SELECT id, brand, model, os, image, screensize FROM phones", function(err, rows) {
	
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.

		// # Return db response as JSON	
    	return res.json(rows)
    });
});

app.delete('/products', function(req, res) {
	// console.log(req.query.id);
	db.run("DELETE FROM phones WHERE id=?" + req.query.id, function(err) {
		if(err) {
			return res.send(err.message).sendStatus(418);
		}
		return res.sendStatus(200);
	});
});


var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post('/products', function(req, res) {
	console.log(req.body);
	const item = req.body;
	db.run(`INSERT INTO phones (brand, model, os, image, screensize)
	VALUES (?, ?, ?, ?, ?)`,
	[item['brand'], item['model'], item['os'], item['image'],  item['screensize']], function(err) {
		if(err) {
			return res.send(err.message).sendStatus(400);
		}
		return res.sendStatus(201);
	});
});

app.put('/products/:id', function(req, res) {
	// console.log(req.param.id);
	const id = req.param.id;
	const item = req.body;
	db.run(`UPDATE phones
                    SET brand=?, model=?, os=?, image=?,
                    screensize=? WHERE id=?`,
                    [item['brand'], item['model'], item['os'], item['image'], item['screensize'], item['id']], function(err) {
						if(err) {
							return res.send(err.message).sendStatus(500);
						}
						return res.sendStatus(200);
					}
	);
});


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
