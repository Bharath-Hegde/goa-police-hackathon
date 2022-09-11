const express = require('express')
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
var item=[];
var cors = require('cors');
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/report', (req, res) => {
    console.log(req.body);
    item.push(req.body['coord']);
    res.sendStatus(200);
});
app.get('/map', (req, res) => {
    res.send(JSON.stringify(item));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));