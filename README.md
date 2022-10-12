API workshop I1 groupe 5
======================

## Installation
- Perform a clone of this repo. 
- Make sure MongoDB is installed (`brew install mongodb`)
- Create a MongoDB database named `enmskeleton` (`use enmskeleton`)
- Install packages and start the express.js web service (`npm install && npm start`)
- Navigate to `http://127.0.0.1:3001` to see the express.js welcome page

## Usage Instructions
All of the MVC pieces are built, but are also rudimentary and not flashy. The root of our webapp goes to the express.js landing page, but there is a schema created for a new object called 
`missions`. To access `missions`, follow the route that is already in place by going to `http://127.0.0.1:3001/missions`.

Add a new mission by going to `http://127.0.0.1:3001/missions` with post methode.

edit a mission by going to `http://127.0.0.1:3001/id/edit` with put methode.

delete a misssion by going to `http://127.0.0.1:3001/id/edit` with delete methode.

get a specific mission by going to `http://127.0.0.1:3001/id with get methode.
