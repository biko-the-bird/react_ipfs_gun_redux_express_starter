const express = require('express');

const app = express();

const bodyParser = require('body-parser')

var fs = require('fs');
var path = require('path');


app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

function recursiveRoutes(folderName) {
  fs.readdirSync(folderName).forEach(function(file) {

      var fullName = path.join(folderName, file);
      var stat = fs.lstatSync(fullName);

      if (stat.isDirectory()) {
          recursiveRoutes(fullName);
      } else if (file.toLowerCase().indexOf('.js')) {
          require('./' + fullName)(app);
          console.log("require('" + fullName + "')");
      }
  });
}
recursiveRoutes('routes'); // Initialize it


app.get('/health-check', (req, res) => res.sendStatus(200));



const port = 5000;

app.listen(port, () => `Server running on port ${port}`);