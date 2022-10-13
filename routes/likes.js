const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    //GET all likes
    .get(function (req, res, next) {
        //retrieve all like from Monogo
        mongoose.model('Like').find({}, function (err, likes) {
            if (err) {
                return console.error(err);
            } else {
                res.format({
                    //JSON response will show all likes in JSON format
                    json: function () {
                        res.json(likes);
                    }
                });
            }
        });
    })
    //POST a new like
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        const employeeId = req.body.employeeId;
        const missionId = req.body.missionId;
        //call the create function for our database
        mongoose.model('Like').create({
            employeeId,
            missionId
        }, function (err, like) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //like has been created
                console.log('POST creating new like: ' + like);
                res.format({
                    json: function () {
                        res.json(like);
                    }
                });
            }
        })
    });

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Like').findById(id, function (err) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function () {
                    next(err);
                },
                json: function () {
                    res.json({message: err.status + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Like').findById(req.id, function (err, like) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + like._id);
                res.format({
                    json: function () {
                        res.json(like);
                    }
                });
            }
        });
    })
    //PUT to update a like by ID
    .put(function (req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        const employeeId = req.body.employeeId;
        const missionId = req.body.missionId;

        //find the document by ID
        mongoose.model('Like').findById(req.id, function (err, like) {
            //update it
            like.update({
                employeeId,
                missionId
            }, function (err) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    res.format({
                        //JSON responds showing the updated values
                        json: function () {
                            res.json(like);
                        }
                    });
                }
            })
        });
    })
    //DELETE a like by ID
    .delete(function (req, res) {
        //find like by ID
        mongoose.model('Like').findById(req.id, function (err, like) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                like.remove(function (err, like) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //Returning success messages saying it was deleted
                        console.log('DELETE removing ID: ' + like._id);
                        res.format({
                            //JSON returns the item with the message that is has been deleted
                            json: function () {
                                res.json({
                                    message: 'deleted',
                                    item: like
                                });
                            }
                        });
                    }
                });
            }
        });
    });

module.exports = router;
