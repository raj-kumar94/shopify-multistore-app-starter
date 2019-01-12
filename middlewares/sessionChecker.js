var cookieParser = require('cookie-parser');
var session = require('express-session');

let setupSession = (app) => {
    // initialize cookie-parser to allow us access the cookies stored in the browser. 
    app.use(cookieParser());
    
    let host = process.env.REDIS_HOST || '127.0.0.1';
    let port = process.env.REDIS_PORT || 6379;
    // initialize express-session to allow us track the logged-in user across sessions.
    if(process.env.SESSION_STORAGE == 'redis'){
        var RedisStore = require('connect-redis')(session);
        app.use(session({
            store: new RedisStore({host:host, port:port}),
            key: 'user_sid',
            secret: 'OneTwoKaFour?',
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: 600000*100
            }
        }));
    } else if(process.env.SESSION_STORAGE == 'mongo') {
        const MongoStore = require('connect-mongo')(session);
        app.use(session({
            key: 'user_sid',
            secret: 'OneTwoKaFour?',
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({
                host: '127.0.0.1',
                port: '27017',
                db: process.env.DB || 'test',
                url: 'mongodb://localhost:27017/'+process.env.DB 
            }),
            cookie: {
                expires: 600000*100
            }
        }));
    }else{
        app.use(session({
            key: 'user_sid',
            secret: 'OneTwoKaFour?',
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: 600000*100
            }
        }));
    }

    // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
    // This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
    app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
    });

    // adding property _isAdmin so that it can be used in hbs
    app.use((req, res, next) => {
        if (req.cookies.user_sid && req.session.user && req.session.user_type=='admin') {
            res.locals._isAdmin = true; 
            res.locals.currentUser = req.session.user;    
            next();
        }else{
            next();
        }
    });

}

function userType(res, user){
    // console.log(res+""+user);
    switch(user)
    {
        case 0:
        res.locals._userType="admin";
        break;
        case 1:
        res.locals._userType="vendor";
        break;
        case 2:
        res.locals._userType="basic";
        break;    
    }
}

let isBasic = (req, res, next) => {
    if (req.cookies.user_sid && req.session.user && (req.session.user_type === 'admin' || req.session.user_type === 'vendor' || req.session.user_type === 'basic')) {
        userType(res,2);
        next();
    } else {
        return res.redirect('/user/login'); 
    }
}

let isVendor = (req, res, next) => {
    if (req.cookies.user_sid && req.session.user && (req.session.user_type === 'admin' || req.session.user_type === 'vendor')) {
        userType(res,1);
        next();
    } else {
        return res.redirect('/user/login'); 
    }
}

let isAdmin = (req, res, next) => {
    if (req.cookies.user_sid && req.session.user && req.session.user_type === 'admin') {
        userType(res,0);
        next();
    } else {
        return res.redirect('/user/login'); 
    }
}

module.exports = {
    setupSession,
    isAdmin,
    isBasic,
    isVendor
};  