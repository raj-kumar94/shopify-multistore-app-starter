var crypto = require('crypto');
const { getShopifyObject } = require('./shopifyObject');


/**
 * check if webhook verfied or not
 * @param {Request} req 
 * @param {String} shopify_api_shared_secret 
 */
function verifyShopifyHook(req, shopify_api_shared_secret) {
    var message = req.rawBody;
    var digest = crypto.createHmac('SHA256', shopify_api_shared_secret)
            .update(message)
            .digest('base64');        
    return digest === req.headers['x-shopify-hmac-sha256'];
}


/**
 * 
 * verifies a webhook
 * @returns Boolean
 * sends response back to shopify 
 */
async function verifyShopifyWebhook({req, res, store_url}) {
    let shopify = await getShopifyObject(store_url);
    if (verifyShopifyHook(req, shopify.shared_secret)) {
        res.writeHead(200);
        console.log('verified');
        res.end('Verified webhook');
        return true;
    } else {
        res.writeHead(401);
        console.log('unverified');
        res.end('Unverified webhook');
        return false;
    }
}

module.exports = verifyShopifyWebhook;

