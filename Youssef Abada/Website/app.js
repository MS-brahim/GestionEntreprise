const express = require('express');
const fs = require("fs");
const path = require('path');

const app = express();
const router = express.Router();

app.use(express.static(__dirname + '\\public'));
app.use('/', router);
app.use(express.json());


app.get('/api/entreprices', (req, res) => {
    res.sendFile(path.join(__dirname + '\\entreprises.json'));
});

app.post('/api/entreprices', (req, res) => {
    fs.readFile("entreprises.json", (err, data) => {
        if (err) {
            return console.error(err);
        } else {
            const entreprices = JSON.parse(data);
            entreprices.push({
                "id": entreprices.length + 1,
                "name": req.body.name,
                "discription": req.body.discription,
                "location": req.body.location,
                "deprartments": []
            });
            fs.writeFile("entreprises.json", JSON.stringify(entreprices , null, 2), (err, result) => {
                if (err) {
                    return console.error(err);
                } else {
                    res.send("the entreprise is added successfully")
                }
        
            });
        }
    });
});

app.get('/api/entreprices/:id', (req, res) => {
    fs.readFile("entreprises.json", (err, data) => {
        if (err) {
            return console.error(err);
        } else {
            const entreprices = JSON.parse(data);
            const entreprice = entreprices.find(e => e.id === +req.params.id);
            if(!entreprice) return res.status(404).send("there is no such entreprise");
            else{
                res.status(200).send(entreprice);
            } 
        }
    });
});

app.post('/api/entreprices/:id', (req, res) => {
    fs.readFile("entreprises.json", (err, data) => {
        if (err) {
            return console.error(err);
        } else {
            const entreprices = JSON.parse(data);
            const entreprice = entreprices.find(e => e.id === +req.params.id);
            if(!entreprice) return res.status(404).send("there is no such entreprise");
            else{
                entreprice.deprartments.push({
                    "id": entreprice.deprartments.length + 1,
                    "name": req.body.name,
                    "chef": req.body.chef,
                    "discription": req.body.discription,
                    "salaries": []
                });
                fs.writeFile("entreprises.json", JSON.stringify(entreprices , null, 2), (err, result) => {
                    if (err) {
                        return console.error(err);
                    } else {
                        res.send("the department is added successfully")
                    }
            
                });
            } 
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));