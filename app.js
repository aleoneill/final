const express = require("express");
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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
    let password = req.body.password;
    req.body.password = bcrypt.hashSync(password, 10);

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
            if (!results.length) {
                connection.query(
                    `INSERT INTO users
                (username, email, password, name)
                VALUES ('${req.body.username}', '${req.body.email}', 
                '${req.body.password}', '${req.body.fullName}')`,
                    function (error, results, fields) {
                        if (error) {
                            throw error;
                        } else {
                            // USERNAME OR PASSWORD ALREADY EXISTS IN DATABASE
                            res.json({
                                successful: true,
                                message: ''
                            });
                        }
                        connection.end();
                    }
                );
            }
        }
    );
});

app.get('/rubric', function (req, res) {
    res.render("rubric.html");
});

app.post('/dashboard', function(req, res) {
    let loginPassword = req.body.password;
    req.body.password = bcrypt.hashSync(loginPassword, 10);
    const connection = mysql.createConnection({
        host: 'bfjrxdpxrza9qllq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'pxy1p3mocspvmfc3',
        password: 'zgoyplg5p995k07d',
        database: 'g2o4v189hkn1yegx'
    });

    connection.connect();

    // CHECKING IS USERNAME AND PASSWORD ARE CORRECT
    connection.query(
        `SELECT password FROM users
         WHERE username = '${req.body.username}'`,
        function(error, results, fields) {
            if (error) throw error;
            if (!results.length) {
                console.log("not a user");
                res.render("login.html");
            } else {
                console.log("is a user flow:");
                console.log("response: " + results[0].password);
                res.json({
                    successful: true,
                    message: ''
                });
                if (bcrypt.compareSync(loginPassword, results[0].password)) {
                } else {
                    console.log("not a match");
                }
            }
        }
    );

});

app.get('/dashboard', function(req, res) {
    const connection = mysql.createConnection({
        host: 'bfjrxdpxrza9qllq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'pxy1p3mocspvmfc3',
        password: 'zgoyplg5p995k07d',
        database: 'g2o4v189hkn1yegx'
    });

    connection.connect();
    connection.query(`SELECT * from schedule`, function(error, results) {
        if (error) throw error;
        connection.end();
        console.log(results);

        res.render('scheduler.hbs', {
            appointments: results,
        });
    });
});

// app.listen("5000", "0.0.0.0", function() {
//     console.log("Express Server is Running...");
// });

// server listener - heroku ready
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running Express Server...");
});