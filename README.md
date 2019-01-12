# installation and running the app

```
npm install

cp .env.example .env

node app.js

go hit browser with http://localhost:8000
```


# verifying webhooks

```
  let store_url = req.headers['x-shopify-shop-domain'];
  let status;

  try {
    status = await verifyShopifyWebhook({req, res, store_url}); // immediately sends 200 or 401 status, so don't send response again
  } catch (error) {
    console.log(error);
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

# webhooks

go to `http://localhost:8000/store/webhook-settings`

and check for your registered webhooks, register your own

## webhook registration url pattern

if you register a webhook with a topic, let's say, `customer/update`, it will register below url

```
https://livestore.com/webhooks/customer-update
```

where `https://livestore.com` is taken from .env

# store settings

go to `http://localhost:8000/store/store-settings`

and add store settings if you're a vendor

# User privilages & Checking user session

in your routes

```
const {isAdmin, isVendor, isBasic } = require('../middlewares/sessionChecker');

router.post('/logout', isBasic, usersController.logout);

```

- isBasic -> check if user is a basic user
- isVendor -> check if user is a vendor
- isAdmin -> check if user is an admin

- if isBasic is applied, all users can access that route
- if isVendor is applied, vendor and admin can access the route
- if isAdmin is applied, only admin can access the route