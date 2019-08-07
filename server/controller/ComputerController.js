// UserController.js

var express = require('express');
var router = express.Router();
var Computer = require('../model/Computer');
var mongoose = require('mongoose')




// get list computer
router.get("/", function (req, res) {
    Computer.find({}, function (err, Computers) {
        if (err) return res.status(500).send("There was a problem finding the Computers.");
        res.status(200).send(Computers);
    });
})

// add computer to list
router.post('/add', function (req, res) {
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
        Computer.create({
            brand: req.body.brand,
            name: req.body.name,
            image: req.body.image,
            cpu: req.body.cpu,
            sizeScreen: req.body.sizeScreen,
            OperatingSystem: req.body.OperatingSystem,
            capacity: req.body.capacity,
            MemorySize: req.body.MemorySize,
            price: req.body.price,
            count: req.body.count
        },
            function (err, computer) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. +  " + err);
                res.status(200).send(computer);
            });
    } else {
        res.send('notAuthorized')
    }
});


// delete computer by id
router.post('/delete', function (req, res) {
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {

        let id = new mongoose.mongo.ObjectID(req.body.id)
        Computer.findByIdAndRemove(id, function (err) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("User " + req.body.id + " was deleted.");
        });
    }
    else {
        res.send('notAuthorized')
    }
});

// update computer by id
router.post('/update', function (req, res) {
    let id = new mongoose.mongo.ObjectID(req.body.id)
    if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
        let body = {
            brand: req.body.brand,
            name: req.body.name,
            image: req.body.image,
            cpu: req.body.cpu,
            sizeScreen: req.body.sizeScreen,
            OperatingSystem: req.body.OperatingSystem,
            capacity: req.body.capacity,
            MemorySize: req.body.MemorySize,
            price: req.body.price
        }
        Computer.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
    } else {
        res.send('notAuthorized')
    }
});

// update computer by id
router.post('/stock/add',  async (req, res) =>{
    if (mongoose.Types.ObjectId.isValid(req.body.id)){         
        Computer.findById(req.body.id)
        .then((doc)=> { 
           if (doc) {
            let myCount = parseInt(doc.count) + 1
            body = {
                count :  myCount.toString()
            }
            Computer.findByIdAndUpdate(new mongoose.mongo.ObjectID(req.body.id), body, { new: true }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the computer.");
                res.status(200).send(user);
            });
           } else {
             console.log("No data exist for this id");
           }
       })
      .catch((err)=> {
          console.log(err);
       });
      } else {
        console.log("Please provide correct Id");
      }
});

// update computer by id
router.post('/stock/delete', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.id)){         
        Computer.findById(req.body.id)
        .then((doc)=> { 
           if (doc) {
            let myCount = parseInt(doc.count) - 1
            body = {
                count : myCount.toString()
            }
            Computer.findByIdAndUpdate(new mongoose.mongo.ObjectID(req.body.id), body, { new: true }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the computer.");
                res.status(200).send(user);
            });
           } else {
             console.log("No data exist for this id");
           }
       })
      .catch((err)=> {
          console.log(err);
       });
      } else {
        console.log("Please provide correct Id");
      }
});







module.exports = router;