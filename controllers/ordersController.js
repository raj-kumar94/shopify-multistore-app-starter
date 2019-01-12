const { getShopifyObject } = require('../utils/shopifyObject');


/** 
 * get orders from shopify
*/

let orders = async (req, res) => {
  try {

    // get the store_url
    let store_url = req.session.store_url;
    let {page, limit} = req.query;

    if(!page) page = 1;
    if(!limit) limit = 1;

    if(!store_url) {
      return res.status(400).send({msg: "store_url not found in query parameter"});
    }

    // get the shopify object from store_url
    let shopify = await getShopifyObject(store_url);
    if(!shopify) {
      return res.status(500).send({msg: "shopify object not found"});
    }

    // make a request to shopify order resource
    let orders = await shopify.order.list({limit, page});
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  orders
}