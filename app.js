require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const fileUpload = require('express-fileupload');
const cors = require('cors')

   

const homeRoutes = require('./routes/homeRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
// express app
const app = express();
app.use(express.json());

const socketio = require('socket.io');


// CONECT to mongodb
let io
const dbURI = 'mongodb+srv://3devWay:1qaz2wsx@cluster0.5orkagp.mongodb.net/mayada?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        let server = app.listen(8420);

        io = socketio(server)
        io.on('connection', (socket) => {
            console.log(`New connection: ${socket.id}`);
        })

        console.log("Local Host Running on port 8420")
    
    }).catch((err) => {
        console.log(err)
    })

// register view engine
app.set('view engine', 'ejs');
// listen for requests


app.use(cors())
app.use((req, res, next) => {
    req.io = io; // Attach io to the request object
    next(); // Move to the next middleware or route handler
});

app.use(morgan('dev'));
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload());
// let uri = ""; // Declare the 'uri' variable

app.use(session({
    secret: "Keybord",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbURI
    }),

}))


// Custom middlfsdfeware to make io accessible in all routes


app.use('/', homeRoutes)
app.use('/teacher', teacherRoutes)




app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
