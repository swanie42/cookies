var express = require('express');
var cookieParser = require('cookie-parser'); // req.cookies
var bodyParser = require('body-parser'); // req.body

var app = express();

// using bodyParser gives us access to req.body
app.use(bodyParser.json(), bodyParser.urlencoded({extended:true}));

// using cookieParser gives us access to req.cookies
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("EAT COOKIES!!");
});

// Cookies
app.get('/cookie', (req, res) => {
    // {cookie-key: cookie-value}
    res.cookie('cookie-key', 'cookie-value');
    res.cookie('artist-formally-known-as', 'prince');
    res.cookie('your-mom', 'fat-too-many-cookies');
    res.cookie('login', Math.random(), {httpOnly: true}); // 3rd argument is a configuration object, in this case it says that the cookie cannot be accessed through JavaScript
    res.send("SET SOME COOKIES!!!");
});

app.get('/tempCookie', (req, res)=>{
    res.cookie('temp-cookie','temp-value',{maxAge: 5000}); //expires after 5 seconds
    res.send("Set temp cookie!");
});

// Sessions
var sessions = {}; // this will be our sessions object
// sessions are just arbitrary objects in server memory

app.get('/session', (req, res)=>{
    console.log("Cookies: ", req.cookies);

    // 1st scenario: we don't know them and need to make a session for them
    if(!req.cookies.login || !sessions[req.cookies.login]) {
        var login = Math.random(); // generate a new session id
        sessions[login] = { created: new Date() }; // store the created date on the user session object

        // tell the browser to store the login cookie
        res.cookie('login', login, {httpOnly: true});

        res.send(`<h1>Welcome to the site, your account was created at ${sessions[login].created}</h1>`) // backticks for template literals
    }
    // 2nd scenario: we do know them and we already have a session
    else {
        res.send(`<h1>You've been a member since ${sessions[req.cookies.login].created}</h1>`);
    }

    // Our sessions object looks like this:
    // {
    //      0.8748756857648743726: {},
    //      0.4647638476327463847: {}
    // }
});

app.listen(3030, (error) => {
    if(error){
        console.log("Error: ", error);
    } else {
        console.log("Server is up!");
    }
});
