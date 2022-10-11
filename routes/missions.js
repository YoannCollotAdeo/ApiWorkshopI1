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
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    // HTML response will render the index.jade file in the views/missions folder. We are also setting "missions" to be an accessible variable in our jade view
                    html: function () {
                        res.render('missions/index', {
                            title: 'All my Missions',
                            "missions": missions
                        });
                    },
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
        //call the create function for our database
        mongoose.model('Mission').create({
            name: name,
            company: company
        }, function (err, mission) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Mission has been created
                console.log('POST creating new mission: ' + mission);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    // html: function () {
                    //     // If it worked, set the header so the address bar doesn't still say /adduser
                    //     res.location("missions");
                    //     // And forward to success page
                    //     res.redirect("/missions");
                    // },
                    //JSON response will show the newly created mission
                    json: function () {
                        res.json(mission);
                    }
                });
            }
        })
    });

/* GET New Mission page. */
router.get('/new', function (req, res) {
    res.render('missions/new', {title: 'Add New Mission'});
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
                    html: function () {
                        res.render('missions/show', {
                            "mission": mission
                        });
                    },
                    json: function () {
                        res.json(mission);
                    }
                });
            }
        });
    });

router.route('/:id/edit')
    //GET the individual mission by Mongo ID
    .get(function (req, res) {
        //search for the mission within Mongo
        mongoose.model('Mission').findById(req.id, function (err, mission) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                //Return the mission
                console.log('GET Retrieving ID: ' + mission._id);
                res.format({
                    //HTML response will render the 'edit.jade' template
                    html: function () {
                        res.render('missions/edit', {
                            title: 'Mission' + mission._id,
                            "mission": mission
                        });
                    },
                    //JSON response will return the JSON output
                    json: function () {
                        res.json(mission);
                    }
                });
            }
        });
    })
    //PUT to update a mission by ID
    .put(function (req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var name = req.body.name;
        var company = req.body.company;

        //find the document by ID
        mongoose.model('Mission').findById(req.id, function (err, mission) {
            //update it
            mission.update({
                name: name,
                company: company
            }, function (err, missionID) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.format({
                        html: function () {
                            res.redirect("/missions/" + mission._id);
                        },
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
                            //HTML returns us back to the main page, or you can create a success page
                            html: function () {
                                res.redirect("/missions");
                            },
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
