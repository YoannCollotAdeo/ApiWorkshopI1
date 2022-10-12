var express = require('express'),
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
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    //GET all missions
    .get(function (req, res, next) {
        //retrieve all missions from Monogo
        mongoose.model('Mission').find({}, function (err, missions) {
            if (err) {
                return console.error(err);
            } else {
                res.format({
                    //JSON response will show all missions in JSON format
                    json: function () {
                        res.json(missions);
                    }
                });
            }
        });
    })
    //POST a new mission
    .post(function (req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var company = req.body.company;
        var description = req.body.description;
        var image = req.body.image;
        //call the create function for our database
        mongoose.model('Mission').create({
            name: name,
            company: company,
            description : description,
            image: image
        }, function (err, mission) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Mission has been created
                console.log('POST creating new mission: ' + mission);
                res.format({
                    json: function () {
                        res.json(mission);
                    }
                });
            }
        })
    });

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Mission').findById(id, function (err, mission) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
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
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(mission);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Mission').findById(req.id, function (err, mission) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + mission._id);
                res.format({
                    json: function () {
                        res.json(mission);
                    }
                });
            }
        });
    });

router.route('/:id/edit')

    //PUT to update a mission by ID
    .put(function (req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var name = req.body.name;
        var company = req.body.company;
        var description = req.body.description;
        var image = req.body.image;

        //find the document by ID
        mongoose.model('Mission').findById(req.id, function (err, mission) {
            //update it
            mission.update({
                name: name,
                company: company,
                description: description,
                image: image
            }, function (err, missionID) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    res.format({
                        //JSON responds showing the updated values
                        json: function () {
                            res.json(mission);
                        }
                    });
                }
            })
        });
    })
    //DELETE a Mission by ID
    .delete(function (req, res) {
        //find mission by ID
        mongoose.model('Mission').findById(req.id, function (err, mission) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                mission.remove(function (err, mission) {
                    if (err) {
                        return console.error(err);
                    } else {
                        //Returning success messages saying it was deleted
                        console.log('DELETE removing ID: ' + mission._id);
                        res.format({
                            //JSON returns the item with the message that is has been deleted
                            json: function () {
                                res.json({
                                    message: 'deleted',
                                    item: mission
                                });
                            }
                        });
                    }
                });
            }
        });
    });

module.exports = router;
