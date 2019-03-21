var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.resolve(__dirname, "app")));

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, '/app', 'index.html'));
});

app.set('port', process.env.PORT || 1337);
app.listen(app.get('port'), function() {
    console.log("listening to Port", app.get("port"));
});