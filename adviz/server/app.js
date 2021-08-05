const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// specify Promise-Library
mongoose.Promise = global.Promise;  

mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost/adviz");

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected successfully.");
});

const app = express();

app.use(express.static('public'));

// Routefiles
const users = require("./routes/users");
const contacts = require("./routes/contacts");

// Middleware

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json()); // let requests parse as json

// Routes

app.use("/adviz", users);
app.use("/adviz/contacts", contacts);

// Errors

app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

///////////////////////////

app.use(function (err, req, res, next) {
    const error = app.get("env") === "development" ? err : {};
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

// Start Server

const PORT = app.get("port") || 3000;
app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}.`);
});