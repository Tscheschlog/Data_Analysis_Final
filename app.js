const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/api/enum',  (req, res) => {
  const filePath = path.join(__dirname, '/backend/data/florida_counties.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.header('Content-Type', 'text/csv');
      res.send(data);
    }
  });
});

app.get('/api/stats/:county', (req, res) => {
  const county = req.params.county;
  const filePath = path.join(__dirname, '/backend/data/median_sales_price_2020.csv');
  const rows = [];

  let data = {
    mean: 0,
    one_year: 0,
    three_year: 0,
    five_year: 0
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {  
        console.log(row);
        if(row['place'] == county)    
          rows.push(row);
    })
    .on('end', () => {
      // Send the filtered rows as JSON
      res.json(rows);
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).send('Internal Server Error');
    });


});

app.get('/api/props/:county', (req, res) => {
  const county = req.params.county.toLowerCase(); // Assuming the county parameter is case-insensitive
  const rows = [];

  fs.createReadStream(path.join(__dirname, '/backend/data/'+ county +'.csv'))
    .pipe(csv())
    .on('data', (row) => {      
        rows.push(row);
    })
    .on('end', () => {
      // Send the filtered rows as JSON
      res.json(rows);
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/api/counties_json', (req, res) => {
  const filePath = path.join(__dirname, '/backend/data/florida_counties.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    }
  });
});

app.get('/api/map_pins/:county', (req, res) => {
  const countyParam = req.params.county;

  const filePath = path.join(__dirname, '/backend/data/' + countyParam + '.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.header('Content-Type', 'text/csv');
      res.send(data);
    }
  });
});

app.get('/api/line_graph/:county', (req, res) => {
  const county = req.params.county;
  
  // // Run the Python script with the county parameter
  const spawn = require('child_process').spawn;
  const process = spawn('python', [path.join(__dirname, '/backend/scripts/getLineGraph.py'), county]);

  process.stdout.on('data', (data) => {
    res.sendFile(data);
   });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    res.status(500).send('Internal Server Error');
  });
});

app.get('/api/bar_graph/:county', (req, res) => {
  const county = req.params.county;
  
  // // Run the Python script with the county parameter
  const spawn = require('child_process').spawn;
  const process = spawn('python', [path.join(__dirname, '/backend/scripts/getBarGraph.py'), county]);

  process.stdout.on('data', (data) => {
    res.sendFile(data);
   });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    res.status(500).send('Internal Server Error');
  });
});

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
