const express = require('express');
const cors = require('cors');
const session = require('express-session');
const router = require('./routes');

const app = express();

app.use(express.json());

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

const sess = {
    secret: process.env.SESSION_PASSWORD,
    cookie: {},
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.use((request, response, next) => {
    response.locals.connectedUser = request.session.connectedUser;

    next();
});

app.use(router);

module.exports = app;
