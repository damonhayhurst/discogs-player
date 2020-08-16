let express = require('express');

var app = express();
let port = process.env.port || 5000

bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var cors = require('cors')
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:8080'
        ]
    }),
)
var routes = require('./routes')
routes(app)



app.listen(port)

console.log('API started on port: ' +  port)