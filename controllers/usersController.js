"use strict";

const { User } = require('../models/user');
// const { StoreDetail } = require('../models/storeDetail');

// route for user signup
let getSignup = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        res.render('signup.hbs', {title: "Awesome App", csrfToken: req.csrfToken()});
    }
}

/**
 * Admin signup route
 */ 

let postSignup = (req, res) => {
    let user_type = 'admin';

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        user_type: user_type,
        store_url: req.body.store_url
    })
    .then(user => {
        req.session.user = req.body.email;
        req.session.user_type = user_type;
        req.session.store_url = user.store_url;
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/user/signup');
    });
};


// route for user Login

let getLogin = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        res.render('login.hbs', {title: "Login", csrfToken: req.csrfToken()});
    }
}


let postLogin = (req, res) => {
    // console.log('post login');
    var email = req.body.email,
    password = req.body.password;

    User.findOne({ email: email }).then(function (user) {
        if (!user) {
            console.log('user not found');
            res.redirect('/user/login');
        } else if (!user.validPassword(password)) {
            console.log('not valid password');
            res.redirect('/user/login');
        } else {
            req.session.user = user.email;
            req.session.user_type = user.user_type;
            req.session.store_url = user.store_url;
            res.redirect('/');
        }
    });
}



// route for user's dashboard
let home = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('base.hbs');
    } else {
        res.redirect('/user/login');
    }
}


// route for user logout
let logout = (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}


module.exports = {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    home,
    logout
}