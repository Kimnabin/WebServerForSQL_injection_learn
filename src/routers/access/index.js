'use strict';

const express = require('express');
const router = express.Router();
const db = require('../../dbs/init.mysql');



router.get('/login', (req, res) => {
    res.render('login.ejs')
});

router.post('/login', (req, res) => {
    const data = req.body;
    console.log("Data: ", data);
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log(`Executed query: ${query}`);
    const query2 = `SELECT * FROM personal_info WHERE username = '${username}'`;

    db.query(query, (err, results) => {
        if (err) throw err;
        console.log("Results: ", results);

        if (results.length > 0) {
            db.query(query2, (err, results) => {
                if (err) throw err;
                console.log("Results: ", results);
                res.render('personal_info.ejs', { user: results[0] });
            });
        } else {
            res.send('Invalid credentials');
        }
    });
});

router.get('/personal-info/:username', (req, res) => {
    const username = req.params.username;
    
    const query = `SELECT * FROM personal_info WHERE username = ?`;
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.render('personal_info', { user: results[0] });
        } else {
            res.send('No personal information found for this user.');
        }
    });
});

router.get('/userSuccess', (req, res) => {
    res.render("userSuccess.ejs");
})

// Route để kiểm tra ID người dùng
router.post('/userSuccess', (req, res) => {
    const id = req.body.id;
    let exists = false;

    if (id) {
        const sanitizedId = db.escape(id); // chống SQL Injection

        const query = `SELECT username FROM users WHERE id = ${sanitizedId}`;
        console.log(`Executed query: ${query}`);

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.send('<pre>There was an error.</pre>');
            }

            exists = results.length > 0;
            if (exists) {
                res.send('<pre>User ID exists in the database.</pre>');
            } else {
                res.send('<pre>User ID is MISSING from the database.</pre>');
            }
        });
    } else {
        res.send('<pre>Invalid ID</pre>');
    }
});


module.exports = router;