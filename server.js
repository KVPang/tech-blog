const express = require("express");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");

const session = require("express-session");
const sequelize = require("./config/connection");

// connect session data to sequelize/saving express sequelize data 
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Set up Express App
const app = express();
const PORT = process.env.PORT || 3001;

// importing models
const { User, Comment, Post } = require("./models");

// data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sess = {
  secret: process.env.SECRET,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// static directory
app.use(session(sess));
app.use(express.static('public'));

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/", allRoutes);

// connect to db - listening to requests 
sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });