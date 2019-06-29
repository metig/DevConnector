const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-Parser');
const passport = require('passport');




const app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
//Db config
const db = require('./config/keys').mongoURI;
mongoose.connect(db)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

//Passport config
require ('./config/passport')(passport);



app.get('/', (req, res) => res.send('Hello world'));
const port = 5004;


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`Server is running on port ${port}`));


