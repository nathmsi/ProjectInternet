var express = require('express');
var Image = require('../model/image');
var User = require('../model/User');
var Computer = require('../model/Computer');
var ImageRouter = express.Router();
const multer = require('multer');
var mongoose = require('mongoose')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/img/uploadsImage/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


/* 
    stores image in uploads folder
    using multer and creates a reference to the 
    file
*/
ImageRouter.route("/uploadmulter")
    .post(upload.single('imageData'), (req, res, next) => {
        if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
            const newImage = new Image({
                imageName: req.body.imageName,
                imageData: req.file.path,
                Iduser: req.body.id
            });

            newImage.save()
                .then((result) => {
                    res.status(200).json({
                        success: true,
                        document: result
                    });
                })
                .catch((err) => next(err));

            User.findById(req.user.id, function (err, user) {
                if (!err) {
                    user.imageUser = req.file.path
                    user.save(function (err_) {
                        if (err_) console.log(err_)
                    });
                } else {
                    if (err) console.log(err)
                }
            });

        } else {
            res.send('notAuthorized')
        }
    });

ImageRouter.route("/uploadmulter/computer")
    .post(upload.single('imageData'), (req, res, next) => {
        if (req.isAuthenticated() && (req.user.level === 'manager' || req.user.level === 'creator')) {
            const newImage = new Image({
                imageName: req.body.imageName,
                imageData: req.file.path,
                Iduser: req.body.id
            });

            newImage.save()
                .then((result) => {
                    res.status(200).json({
                        success: true,
                        document: result
                    });
                })
                .catch((err) => next(err));

            let id = new mongoose.mongo.ObjectID(req.body.id)

            let body = {
                image  : req.file.path
            }

            Computer.findByIdAndUpdate(id, body, {new: true}, function (err_) {
                if (err_) console.log(err_)
            })

        } else {
          
        }
    });



module.exports = ImageRouter;