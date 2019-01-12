"use strict";

const { StoreDetail } = require('../models/storeDetail');
const { User } = require('../models/user');
const { getShopifyObject } = require('../utils/shopifyObject');


/**
 * set store settings
 * @param {Request} req 
 * @param {Response} res 
 */
let setStoreConfig = (req, res) => {

    let store_type = req.body.store_type;
    let app_type=req.body.app_type;
    let access_token=req.body.access_token;
    let store_url = req.body.store_url;
    let api_key = req.body.api_key;
    let password = req.body.password;
    let shared_secret = req.body.shared_secret;
    let active = req.body.active;

    StoreDetail.update(
        {
		    store_url: req.body.store_url
        },
        {
		    app_type:app_type,
            store_type:store_type,
            access_token:access_token,
            store_url: store_url,
            api_key: api_key,
            password: password,
            shared_secret: shared_secret,
            active: active,
            updated_at: new Date(Date.now())
        },
        {
            upsert: true
        }
    )
    .then((updated) => {
        let shopName = store_url.split('.')[0];
        if(global.shopify) {
            global.shopify[shopName] = undefined;
        } else {
            global.shopify = {
                [shopName]: undefined
            }
        }
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
        res.send(err)
    });

}


/**
 * Get settings page
 * @param {Request} req 
 * @param {Response} res 
 */
let getSettingPage = async (req, res) => {
    let email = req.session.user;
    let user_type = req.session.user_type;
    if(user_type === "basic") {
        return res.send({msg: "you're not allowed to view this"});
    }
    try {
        let user = await User.findOne({email: email});
        if(!user) {
            return res.redirect('/user/login');
        }
        let storeDetail = await StoreDetail.findOne({store_url: user.store_url});
        res.render('settings/store.hbs', { store: storeDetail });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}



/**
 * Get webhooks page
 * @param {Request} req 
 * @param {Response} res 
 */
let getWebhooksPage = async (req, res) => {

    let user_type = req.session.user_type;
    if(user_type === "basic") {
        return res.send({msg: "you're not allowed to view this"});
    }

    let store_url = req.session.store_url;
    try {
        let shopify = await getShopifyObject(store_url);
        if(!shopify) {
        return res.status(500).send({msg: "shopify object not found"});
        }

        let webhooks = await shopify.webhook.list();
        res.render('settings/webhooks.hbs', { webhooks, csrfToken: req.csrfToken() });
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: "an error occured"});
    }
}


/**
 * Delete a webhook
 * @param {Request} req 
 * @param {Response} res 
 */
let deleteWebhook = async (req, res) => {
    let user_type = req.session.user_type;
    let webhook_id = req.params.webhook_id;

    if(user_type === "basic") {
        return res.send({msg: "you're not allowed to view this"});
    }

    let store_url = req.session.store_url;
    try {
        let shopify = await getShopifyObject(store_url);
        if(!shopify) {
        return res.status(500).send({msg: "shopify object not found"});
        }

        let webhooks = await shopify.webhook.delete(webhook_id);
        res.redirect('/store/webhook-settings');
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: "an error occured"});
    }
}



/**
 * Create a webhook
 * @param {Request} req 
 * @param {Response} res 
 */
let createWebhook = async (req, res) => {
    let user_type = req.session.user_type;
    let topic = req.body.topic;
    let baseUrl = process.env.DEPOLOYMENT === "test" ? process.env.TEST_BASE_URL : process.env.PRODUCTION_BASE_URL;
    
    if(user_type === "basic") {
        return res.send({msg: "you're not allowed to view this"});
    }

    let store_url = req.session.store_url;
    try {
        let shopify = await getShopifyObject(store_url);
        if(!shopify) {
        return res.status(500).send({msg: "shopify object not found"});
        }

        let webhook = await shopify.webhook.create({
            "topic": topic,
            "address": baseUrl+"/webhooks/product-update",
            "format": "json"
        })
        res.redirect('/store/webhook-settings');
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: "an error occured"});
    }
}


module.exports = {
    setStoreConfig,
    getSettingPage,
    getWebhooksPage,
    deleteWebhook,
    createWebhook
};
