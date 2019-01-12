const mongoose = require('mongoose');


var StoreDetailSchema = mongoose.Schema(
    {
        store_type: {
            type: String, //shopify, magento etc
            required: true
        },
        app_type: {
            type: String,
            default: 'private' // public private
        },
        access_token: {
            type: String
        },
        store_url: {
            type: String,
            required: true
        },
        api_key: {
            type: String
        },
        password: {
            type: String
        },
        shared_secret: {
            type: String
        },
        active: {
            type: Boolean,
            default: true,
            required: true
        },
        created_at: Date,
        updated_at: Date
    }
);


var StoreDetail = mongoose.model('StoreDetail', StoreDetailSchema);

module.exports = {StoreDetail};