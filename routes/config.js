/**
 * @namespace config
 */
const express = require("express");
var router = express.Router();

const {
    setStoreConfig,
    getSettingPage,
    getWebhooksPage,
    deleteWebhook,
    createWebhook
} = require('../controllers/configsController');


const {isAdmin, isVendor, isBasic } = require('../middlewares/sessionChecker');

const {csrfProtection} = require('../middlewares/csrfProtection');


router.post('/config', setStoreConfig);

router.get('/store-settings', isVendor, getSettingPage);

router.get('/webhook-settings', csrfProtection, isVendor, getWebhooksPage);

router.post('/webhook-settings/delete/:webhook_id', csrfProtection, isVendor, deleteWebhook);

router.post('/webhook-settings/create', csrfProtection, isVendor, createWebhook);

module.exports = router;
