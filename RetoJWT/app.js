var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var conmongo = require('./controllers/conmongo');
var md5 = require('md5');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var clientsRouter = require('./routes/clients');
var storesRouter = require('./routes/stores');
var cartRouter = require('./routes/cart');
var productsRouter = require('./routes/products');
var cors = require('cors');

var app = express();

// Check and create admin

const adminUser = "storesAdmin";
const passAdmin = "admin";

conmongo.getAdmin(adminUser, data => {
    let admin = data;
    if(!admin) {
        conmongo.createAdmin({
            adminname: adminUser,
            role: "admin",
            password: md5(md5(passAdmin))
        }, res => {
            console.log(res.adminname + " admin already created.");
        });
    } else {
        console.log("Admin already created.");
    }
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/clients', clientsRouter);
app.use('/api/stores', storesRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
