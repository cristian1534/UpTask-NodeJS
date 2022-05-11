const express = require("express");
const routes = require("./routes/index");
const path = require("path");
const bodyParser = require("body-parser");
const helpers = require("./helpers");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
require("dotenv").config({
  path: "variables.env",
});

//connction to db
const db = require("./config/db");

//import Model
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("CONECTADO AL SERVIDOR"))
  .catch((error) => console.log(error));

const app = express();

//static files
app.use(express.static("public"));

// enable Pug for HTML
app.set("view engine", "pug");

//path for view templates
app.set("views", path.join(__dirname, "./views"));

//flash messages
app.use(flash());

app.use(cookieParser());

//sessions to go through pages without auth
app.use(
  session({
    secret: "supersecreto",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//helper
app.use((req, res, next) => {
  res.locals.year = 2022;
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes());

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log("Servidor corriendo...");
})


