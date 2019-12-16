const express = require("express");
const path = require('path');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine', 'hbs');
app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.render("login.html");
});

app.post('/', function(req, res) {
    const connection = mysql.createConnection({
        host: 'bfjrxdpxrza9qllq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'pxy1p3mocspvmfc3',
        password: 'zgoyplg5p995k07d',
        database: 'g2o4v189hkn1yegx'
    });

    connection.connect();

    // CHECKING IS USERNAME AND PASSWORD ARE CORRECT
    connection.query(
        `SELECT username, password FROM users
         WHERE username = '${req.body.username}' and password = '${req.body.password}' `,
        function(error, results, fields) {
            if (error) throw error;

            // IF THERE ARE NO RESULTS, EITHER WRONG USERNAME/PASSWORD OR DOESNT EXIST
            if(!results.length) {
                connection.end();
                delete req.session.username;

                // RETURN BACK RESULTS - FALSE
                res.json({
                    successful: false,
                    message: 'Wrong username/password or account does not exist'
                });
            } else {
                connection.end();
                req.session.username = req.body.username;

                // RETURN BACK RESULTS - TRUE
                res.json({
                    successful: true,
                    message: ''
                });
            }
        }
    );
});

app.get('/rubric', function (req, res) {
    res.render("rubric.html");
});

app.listen("5000", "0.0.0.0", function() {
    console.log("Express Server is Running...");
});