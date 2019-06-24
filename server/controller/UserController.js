// UserController.js

var express = require('express');
var router = express.Router();
const passport = require('passport')
var User = require('../model/User');


passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// RSA
var CryptoJS = require("crypto-js");




///////////////////////////////////////////////     REGISTARATION   ////////////////////////////////////////////////////

// CREATES A NEW USER REGISTER
router.post('/register', function (req, res) {


    User.register({ username: req.body.username, level: req.body.level, email: req.body.email }, req.body.password, function (err, user) {
        if (err) {
            console.log('error register ' + err)
            res.send("denied")
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log('register user : ' + req.user.username)
                res.status(200).send(req.user.level);
            })
        }
    })

});


// LOGIN USER
router.post("/login", function (req, res) {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        req.login(user, function (err) {
            if (err) {
                console.log('error login ' + err)
                res.send("denied")
            } else {
                passport.authenticate("local")(req, res, function (err) {
                    if (err) console.log(err)
                    res.status(200).send(req.user.level);
                })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

//LOGOUT USER
router.get("/logout", function (req, res) {
    console.log('logout user : ' + req.user.username)
    req.logout()
    res.redirect("/")
})


///////////////////////////////////////////////     USER  CATEGORY  ////////////////////////////////////////////////////

// GET LEVEL USER
router.get("/level", function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.level)
    } else {
        res.send('basic')
    }
})

// GET USERNAME USER
router.get("/username", function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.username)
    } else {
        res.send('Visitor')
    }
})

// GET USERNAME USER
router.get("/account", function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user)
    } else {
        res.send([])
    }
})

///////////////////////////////////////////////////////////////  Panier User   /////////////////////////////////////////////////


// GET LIST PANIER USER
router.get("/panier", function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.panier)
    } else {
        res.send("notAuthorized")
    }
})

// ADD TO PANIER USER
router.post('/panier/add', function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.user.id, function (err, user) {
            user.panier.push(req.body.id)
            user.save(function (err) {
                if (err) console.log(err)
                else
                    res.status(200).send(user);
            });
        });
    } else {
        res.send('notAuthorized')
    }
});

// DELETE ELEMENT PANIER USER
router.post('/panier/delete', function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.user.id, function (err, user) {

            var index = user.panier.indexOf(req.body.id);
            while (index !== -1) {
                user.panier.splice(index, 1);
                index = user.panier.indexOf(req.body.id);
            }

            user.save(function (err) {
                if (err) console.log(err)
                else res.status(200).send(user);
            });
        });
    } else {
        res.send('notAuthorized')
    }
})

// DELETE ELEMENT PANIER USER
router.post('/panier/deleteOne', function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.user.id, function (err, user) {

            var index = user.panier.indexOf(req.body.id);
            user.panier.splice(index, 1);

            user.save(function (err) {
                if (err) console.log(err)
                else res.status(200).send(user);
            });
        });
    } else {
        res.send('notAuthorized')
    }
})

// GET PANIER USER
router.get('/panier', function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.panier)
    } else {
        res.send([])
    }
});

//////////////////////////////////////////////////////////////////// Order User //////////////////////////////////////////////////////////////

// GET ORDER USER
router.get('/orders', function (req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user.orders)
    } else {
        res.send([])
    }
});

// ADD TO PANIER USER
router.post('/orders/add', function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.user.id, function (err, user) {
            user.orders.push({ order: req.body.order, total: req.body.total })
            user.panier = []
            user.save(function (err) {
                if (err) console.log(err)
                else
                    res.status(200).send(user);
            });
        });
    } else {
        res.send('notAuthorized')
    }
});

//////////////////////////////////////////////////////////////////// User managment ///////////////////////////////////////////////////////////


// GET ALL USERS
router.get('/', function (req, res) {
    if (req.isAuthenticated() && req.user.level === 'manager') {
        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(users);
        });
    } else {
        res.send([])
    }
})


// DELETE USERS BY ID
router.post('/delete', function (req, res) {
    if (req.isAuthenticated() && req.user.level === 'manager') {
        User.findByIdAndRemove(req.body.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("User " + req.body.id + " was deleted.");
        });
    } else {
        res.send([])
    }
})

// SET LEVEL TO USER BY ID
router.post('/level', function (req, res) {
    if (req.isAuthenticated() && req.user.level === 'manager') {
        User.findById(req.body.id, function (err, user) {
            user.level = req.body.level
            user.save(function (err) {
                if (err) console.log(err)
                else res.send('ok');
            });
        });
    } else {
        res.send('notAuthorized')
    }
})

// UPDATE USER 
router.post('/update', function (req, res) {
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'client')) {
        User.findById(req.body.id, function (err, user) {
            if (err) res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
            user.username = req.body.username
            user.level = req.body.level
            user.orders = req.body.orders
            user.panier = req.body.panier
            user.phone = req.body.phone
            user.address = req.body.address
            user.email = req.body.email
            user.save(function (err) {
                if (err) res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                else res.json({ success: true, message: 'User has been changed successfully' });
            });
        });
    } else {
        res.send('notAuthorized')
    }
})


// change PASSWORD
router.post('/changepassword', function (req, res) {

    User.findOne({ _id: req.body.id }, (err, user) => {
        // Check if error connecting
        if (err) {
            res.json({ success: false, message: err }); // Return error
        } else {
            // Check if user was found in database
            if (!user) {
                res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
            } else {
                user.changePassword(req.body.oldpassword, req.body.newpassword, function (err) {
                    if (err) {
                        if (err.name === 'IncorrectPasswordError') {
                            res.json({ success: false, message: 'Incorrect password' }); // Return error
                        } else {
                            res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                        }
                    } else {
                        res.json({ success: true, message: 'Your password has been changed successfully' });
                    }
                })
            }
        }
    });
});

module.exports = router;