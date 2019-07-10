// UserController.js

var express = require('express');
var router = express.Router();
var Group = require('../model/Group');
var mongoose = require('mongoose')




// get list Group
router.get("/", function (req, res) {
    if (req.isAuthenticated() && (req.user.level === 'client' || req.user.level === 'manager')) {
        Group.find({}, function (err, Groups) {
            if (err) return res.status(500).send("There was a problem finding the Groups.");
            res.status(200).send(Groups);
        });
    } else {
        res.send('notAuthorized')
    }
})

// add Group to list
router.post('/add', function (req, res) {
    if (req.isAuthenticated() && req.user.level === 'manager') {
        Group.create({
            name: req.body.name,
            participants: [],
            messages: [],
            isAccept: false
        },
            function (err, Group) {
                if (err) return res.status(500).send("There was a problem adding the information to the database. +  " + err);
                res.status(200).send(Group);
            });
    } else {
        res.send('notAuthorized')
    }
});


// delete Group by id
router.post('/delete', function (req, res) {
    if (req.isAuthenticated() && req.user.level === 'manager') {
        let id = new mongoose.mongo.ObjectID(req.body.id)
        Group.findByIdAndRemove(id, function (err) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("Group " + req.body.id + " was deleted.");
        });
    }
    else {
        res.send('notAuthorized')
    }
});

// delete Group by id
router.post('/participant/delete', function (req, res) {
    let id = new mongoose.mongo.ObjectID(req.body.id)
    let participants = req.body.participants
    var index = participants.indexOf(req.body.name);
    if (index !== -1) participants.splice(index, 1);

    if (req.isAuthenticated() && req.user.level === 'manager') {

        let body = {
            participants: participants
        }

        Group.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });

    } else {
        res.send('notAuthorized')
    }
});

// delete Group by id
router.post('/participant/add', function (req, res) {
    let id = new mongoose.mongo.ObjectID(req.body.id)

    let participants = req.body.participants
    participants.push(req.body.name)

    let request = req.body.request
    var index = request.indexOf(req.body.name);
    if (index !== -1) request.splice(index, 1);

    if (req.isAuthenticated() && req.user.level === 'manager') {

        let body = {
            request ,
            participants
        }

        Group.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });

    } else {
        res.send('notAuthorized')
    }
});


// delete Group by id
router.post('/request/add', function (req, res) {
    let id = new mongoose.mongo.ObjectID(req.body.id)

    let request = req.body.request
    if (!request.includes(req.body.name)){
         request.push(req.body.name)
    }
   

    if (req.isAuthenticated() && ( req.user.level === 'client' ||  req.user.level === 'manager') ) {

        let body = {
            request 
        } 

        Group.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });

    } else {
        res.send('notAuthorized')
    }
});


// update Group by id
router.post('/update', function (req, res) {
    let id = new mongoose.mongo.ObjectID(req.body.id)
    if (req.isAuthenticated() && req.user.level === 'manager') {
        let body = {
            name: "",
            participants: [],
            messages: [],
            isAccept: ""
        }
        Group.findByIdAndUpdate(id, body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
    } else {
        res.send('notAuthorized')
    }
});







module.exports = router;