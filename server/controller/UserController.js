// UserController.js
var express = require('express');
var router = express.Router();
const passport = require('passport')
var User = require('../model/User');
var mongoose = require('mongoose')
var flash = require('express-flash');



const dotenv = require('dotenv');
dotenv.config();

var nodemailer = require('nodemailer');
passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


router.use(flash());
// RSA




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
            user.orders.push({ order: req.body.order, total: req.body.total , date : req.body.date })
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



router.post('/orders/update', function (req, res) {
    try {
        let id = new mongoose.mongo.ObjectID(req.body.id)
        if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
            let body = {
                orders: req.body.orders
            }
            User.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                res.status(200).send(user);
            });
        } else {
            res.send('notAuthorized')
        }
    }
    catch (err) {
        console.log(err)
    }
});


//////////////////////////////////////////////////////////////////// User managment ///////////////////////////////////////////////////////////


// GET ALL USERS
router.get('/', function (req, res) {
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
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
    if (req.isAuthenticated() && req.user.level === 'creator') {
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
    if (req.isAuthenticated() && ( req.user.level === 'manager' || req.user.level === 'creator' )) {
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
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'client' || req.user.level === 'creator')) {
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
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'client' || req.user.level === 'creator')) {
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
    } else {
        res.send('notAuthorized')
    }
});

router.post('/forgot', function(req, res, next) {
        try{
        User.findOne({ email : req.body.email , username: req.body.username }, function(err, user) {
                if (!user) {
                  console.log('error', 'Password reset token is invalid or has expired.')
                }

                user.resetPasswordToken = req.body.code
        
                user.save(function(err) {
                    if (err) res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                    else res.json({ success: true, message: 'User has been changed successfully' });
                });
        });
        var transporter  = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'nmsika@g.jct.ac.il',
              pass:  process.env.KEY_GMAIL 
            }
        });
          
        var mailOptions = {
          to: req.body.email ,
          from: 'nmsika@g.jct.ac.il',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            ' the code :    '  + req.body.code + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 
        }catch(err){
            console.log(err)
        }
});

router.post('/newPassword', function(req, res) {
    try{
        
            User.findOne({ email : req.body.email , username: req.body.username , resetPasswordToken : req.body.code }, (err, user) => {
                // Check if error connecting
                if (err) {
                    res.json({ success: false, message: err }); // Return error
                } else {
                    // Check if user was found in database
                    if (!user) {
                        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
                    } else { 
                        user.resetPasswordToken = ''
                        user.setPassword(req.body.password , (err) => {
                            if (err) {
                                res.json({ success: false, message: err }); // Return error
                            } else {

                        var transporter  = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: 'nmsika@g.jct.ac.il',
                              pass: process.env.KEY_GMAIL
                            }
                        });
                          
                        var mailOptions = {
                          to: req.body.email ,
                          from: 'nmsika@g.jct.ac.il',
                          subject: 'Your password has been changed',
                          text: 'Hello,\n\n' +
                            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'+
                            'link to login ' + 'http://localhost:3000/Login'
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          }); 
        
                        user.save(function(err) {
                            if (err) res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
                            else res.json({ success: true, message: 'User has been changed successfully' });
                        });

                    }}) 
                    }
                }
            });
        }catch(err){
            console.log(err)
        }
  });    

module.exports = router;