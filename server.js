var http = require('http'),
    express = require('express'),
    port = process.env.PORT || 3000;


var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/send', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/brooklin', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/kafka', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/samza', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/ambry', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/espresso', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/venice', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/liquid', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/nuage', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})

app.post('/gobblin', function(req, res){
    res.status(200).send({
        message: 'correct'
    });
})



var server = http.createServer(app);

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');