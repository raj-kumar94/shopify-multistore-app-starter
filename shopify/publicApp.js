const querystring = require('querystring');
const cookie = require('cookie');
const nonce = require('nonce')();
var crypto = require('crypto');
var request = require('request-promise');

const scopes = 'read_product_listings,write_checkouts,read_products,read_checkouts,read_orders,read_draft_orders';
const forwardingAddress = process.env.DEPOLOYMENT === "test" ? process.env.TEST_BASE_URL : process.env.PRODUCTION_BASE_URL;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

let shopifyInit = (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const state = nonce();
    const redirectUri = forwardingAddress + '/shopify/callback';
    const installUrl = 'https://' + shop +
      '/admin/oauth/authorize?client_id=' + apiKey +
      '&scope=' + scopes +
      '&state=' + state +
      '&redirect_uri=' + redirectUri;

    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
  }
};

let ShopifyCallback = async (req, res) => {
  console.log('Second');
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    console.log('state didnt match');
    return res.status(403).send('Request origin cannot be verified');
  }
  console.log('state matched');
  if (shop && hmac && code) {
    // console.log(code);
      const map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      const message = querystring.stringify(map);
      const generatedHash = crypto
        .createHmac('sha256', apiSecret)
        .update(message)
        .digest('hex');
      
      if (generatedHash !== hmac) {
        return res.status(400).send('HMAC validation failed');
      }
      // console.log('shop hmac and code matched');
      
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
      
      try {
        let accessTokenResponse = await request.post(accessTokenRequestUrl, { json: accessTokenPayload });
        const accessToken = accessTokenResponse.access_token;
        console.log("accessToken: "+ accessToken);

        // now make an request with accessToken
        const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };

        let shopResponse = await request.get(shopRequestUrl, { headers: shopRequestHeaders });
        res.send(shopResponse);
      } catch (error) {
        res.status(500).send(error);
      }
  } else {
    res.status(400).send('Required parameters missing');
  }

}


module.exports = {
  shopifyInit,
  ShopifyCallback
}