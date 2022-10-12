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
    //GET all users
    .get(function (req, res, next) {
      //retrieve all user from Monogo
      mongoose.model('User').find({}, function (err, users) {
        if (err) {
          return console.error(err);
        } else {
          res.format({
            //JSON response will show all users in JSON format
            json: function () {
              res.json(users);
            }
          });
        }
      });
    })
    //POST a new user
    .post(function (req, res) {
      // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const companyId = req.body.companyId;
      //call the create function for our database
      mongoose.model('User').create({
        firstName,
        lastName,
        email,
        password,
        companyId,
      }, function (err, user) {
        if (err) {
          res.send("There was a problem adding the information to the database.");
        } else {
          //User has been created
          console.log('POST creating new user: ' + user);
          res.format({
            json: function () {
              res.json(user);
            }
          });
        }
      })
    });

// route middleware to validate :id
router.param('id', function (req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  mongoose.model('User').findById(id, function (err) {
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
      mongoose.model('User').findById(req.id, function (err, user) {
        if (err) {
          console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
          console.log('GET Retrieving ID: ' + user._id);
          res.format({
            json: function () {
              res.json(user);
            }
          });
        }
      });
    })
    //PUT to update a user by ID
    .put(function (req, res) {
      // Get our REST or form values. These rely on the "name" attributes
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const companyId = req.body.companyId;

      //find the document by ID
      mongoose.model('User').findById(req.id, function (err, user) {
        //update it
        user.update({
          firstName,
          lastName,
          email,
          password,
          companyId,
        }, function (err) {
          if (err) {
            res.send("There was a problem updating the information to the database: " + err);
          } else {
            res.format({
              //JSON responds showing the updated values
              json: function () {
                res.json(user);
              }
            });
          }
        })
      });
    })
    //DELETE a User by ID
    .delete(function (req, res) {
      //find user by ID
      mongoose.model('User').findById(req.id, function (err, user) {
        if (err) {
          return console.error(err);
        } else {
          //remove it from Mongo
          user.remove(function (err, user) {
            if (err) {
              return console.error(err);
            } else {
              //Returning success messages saying it was deleted
              console.log('DELETE removing ID: ' + user._id);
              res.format({
                //JSON returns the item with the message that is has been deleted
                json: function () {
                  res.json({
                    message: 'deleted',
                    item: user
                  });
                }
              });
            }
          });
        }
      });
    });

module.exports = router;
