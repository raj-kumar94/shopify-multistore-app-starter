const Shopify = require('shopify-api-node');
const {StoreDetail} = require('../models/storeDetail');


/**
 * Gets Singleton shopify object
 * @param {String} store_url - eg: shop.myshopify.com 
 */
let getShopifyObject = (store_url) => {

    return new Promise( async (resolve, reject) => {
        if(!store_url) {
            return {"msg": "store name is required"};
        }

        // console.log("asdf "+store_url);
        
        let shopName = "";
        try {
            shopName = store_url.split('.')[0];
        } catch (error) {
            console.log(error);
            if(!shopName.length) {
                return reject({"msg": "shopName not available"});
            }
        }
        
        // console.log(store_url)
        if(global.shopify && global.shopify[shopName]) {
            console.log('found in global');
            // console.log(global.shopify[shopName])
            return resolve(global.shopify[shopName]);
        } 
        else {
            console.log('creating a new one');
            let storeDetail = undefined;
            try {
                storeDetail = await StoreDetail.findOne({store_url: store_url});
                if(!storeDetail) {
                    return reject({"msg": "store details not found"});
                }
            } catch (error) {
                return reject({msg:error});
            }
    
            let shopify;
            if(storeDetail.app_type === 'private') {
                shopify = new Shopify({
                    shopName: shopName,
                    apiKey: storeDetail.api_key,
                    password: storeDetail.password,
                    shared:storeDetail.shared_secret,
                    autoLimit : { calls: 2, interval: 1000, bucketSize: 70 }
                });
                shopify.shared_secret = storeDetail.shared_secret;
                
            } else if(storeDetail.app_type === 'public') {
                shopify = new Shopify({
                    shopName: shopName,
                    accessToken: storeDetail.access_token,
                    autoLimit : { calls: 2, interval: 1000, bucketSize: 70 }
                  });
                shopify.shared_secret = storeDetail.shared_secret;
            }

            let shopifyObj = {
                ...global.shopify,
                [shopName]: shopify
            }
            global.shopify = shopifyObj;
            return resolve(shopify);
        }
    });
}


/**
 * 
 * Testing with Apache benchmark: 100 requests, 10 concurrency
 * ab -c 10 -n 100 http://localhost:8000/settings/shopify/store-data/test/
 * It creating an shopify object if no object found in global
 * otherwise retrieving it from global
 */
let testShopifyObject = (req, res) => {
    let data = getShopifyObject(`${process.env.SHOPIFY_STORE}.myshopify.com`);
    data.then((s) => {
        s.product.count()
        .then((c) => {
            console.log(c);
            console.log(s.callLimits);
            return res.send(s);
        })
        .catch((err) => {
            console.log(err);
            return res.send(err);
        });
    })
    .catch((err) => {
        console.log(err)
        res.send(err);
    });
}


module.exports = {
    getShopifyObject,
    testShopifyObject
}