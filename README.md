# verifying webhooks

```
const verifyShopifyWebhook = require('../middlewares/verifyWebhooks');
let status = verifyShopifyWebhook(req, res); // immediately sends 200 or 401 status, so don't send response again
if(!status){
  console.log('cannot verify request');
  return;
}

```

# Get shopify object

```
const { getShopifyObject } = require('../utils/shopifyObject');

...

getShopifyObject(store_url)
.then(shopify => {
  shopify.order.list()
  .then( orders => console.log(orders));
})


```

> Note: copy .env.example to .env and update values

# Registering webhooks
```
node shopify/registerWeboks.js products/update
```

# Checking user session

```
var sessionChecker = require('./middlewares/sessionChecker');
```
then in a route

```
app.get('/profile',sessionChecker, (req, res) => {
  res.redirect('/user/login');
}); 
```
