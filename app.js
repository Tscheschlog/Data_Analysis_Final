const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

const saveSearhedCounties = (searchedCounty, searchedEntities) => {

  var countyEntries = {
    [searchedCounty]: searchedEntities
  };

  fs.writeFile ("file.json",  JSON.stringify(countyEntries), function(err) {
    if (err) throw err;
    console.log('complete');
    }
  );

}

app.get('api/:visual', (req, res) => {
  
  

});

// function convertCsvToJson(filePath, callback) {
//   const jsonData = {};

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       const countyName = row.CITY;

//       if (!jsonData[countyName]) {
//         jsonData[countyName] = [];
//       }

//       delete row.CITY; // Remove the CITY property from the row

//       jsonData[countyName].push(row);
//     })
//     .on('end', () => {
//       callback(null, jsonData);
//     })
//     .on('error', (error) => {
//       callback(error, null);
//     });
// }

// // Example usage:
// const csvFilePath = './public/data/fl.csv';

// convertCsvToJson(csvFilePath, (error, result) => {
//   if (error) {
//     console.error('Error:', error);
//   } else {
//     var currJSON = JSON.parse(fs.readFileSync(__dirname + "/file.json").toString())
//     console.log(Object.keys(result));
//   }
// });


// Serve index.html at the root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 404 page 
app.use((req, res) => { 
  res.status(404).send( 
      "<h1>Page not found on the server</h1>");
}) 

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
