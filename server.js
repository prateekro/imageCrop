var express = require('express');
var path = require('path');
var fs = require('fs')
//require("fs")
var app = express();

// Define the port to run on
app.set('port', 8000);

app.use(express.static(path.join(__dirname)));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});

var router = express.Router();			// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

//Route to upload files on server
router.post('/fileupload', function(req, res) {
	 var jsonString = '';
	 //Aggregate blob
	 req.on('data', function (data) {
            jsonString = jsonString += data;;
        });
	 //Post Aggregation
	 req.on('end', function () {
	 	var blobData = JSON.parse(jsonString).message;
	 	var base64Data = blobData.replace(/^data:image\/png;base64,/, "");
	 	//Nomenclature of Image to be saved
	 	var PhotoNametimeInMss = "IMG-"+Date.now()+".png";
	 	console.log("date: ",PhotoNametimeInMss);
	 	//Write the blob to a file
	 	if (!fs.existsSync(__dirname+"/uploads")){
		    fs.mkdirSync(__dirname+"/uploads");
		}
		fs.writeFile(__dirname +"/uploads/"+PhotoNametimeInMss, base64Data, 'base64', function(err) {
		  if(err) {console.log("ERROR: ",err);}
		});
		//close the file
		//fs.close();
     });

    res.json({ message: 'File Uploaded Successfully' });   
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);