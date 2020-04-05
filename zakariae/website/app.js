const express = require('express');
const fs = require("fs");
const path = require('path');

const app = express();
const router = express.Router();

app.use(express.static(__dirname + '\\public'));
app.use('/', router);
app.use(express.json());
let currentDepatment = {};
let searchResult = [];

app.get('/', (req, res) => {
    currentDepatment = {};
    searchResult = {};
    res.redirect("/search.html");
});


//search on salary by his name
app.get('/search', (req, res) => {
    let salaries = [];
    fs.readFile("entreprises.json", (err, data) => {
        if (err) {
            return console.error(err);
        } else {
            const entreprices = JSON.parse(data);
            for (let e = 0; e < entreprices.length; e++) {
                for (let d = 0; d < entreprices[e].deprartments.length; d++) {
                    for (let s = 0; s < entreprices[e].deprartments[d].salaries.length; s++) {
                        if (entreprices[e].deprartments[d].salaries[s].name.toLowerCase() === req.query.name.toLowerCase()) {
                            let salary = entreprices[e].deprartments[d].salaries[s];
                            salary.entrepriceName = entreprices[e].name;
                            salary.departementName = entreprices[e].deprartments[d].name;
                            salaries.push(salary);
                        }
                    }
                }
            }
            searchResult = salaries;
            res.redirect('/search.html');

        }
    });
});

app.get('/api/search', (req, res) => {
    res.send(searchResult);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));