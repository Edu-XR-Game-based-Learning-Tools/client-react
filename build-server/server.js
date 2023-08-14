var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.use(express.static(__dirname + '/../build'));

app.listen(5005);
