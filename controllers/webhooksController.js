"use strict";

const verifyShopifyWebhook = require('../utils/verifyWebhooks');


/**
 * Product webhook listener
 * @param {Request} req 
 * @param {Response} res 
 */
let productUpdate = async (req, res) => {
  let store_url = req.headers['x-shopify-shop-domain'];
  let status;

  try {
    status = await verifyShopifyWebhook({req, res, store_url}); // immediately sends 200 or 401 status, so don't send response again
  } catch (error) {
    console.log(error);
  }
  if(!status){
    console.log('cannot verify request');
    return;
  }
  // do your stuffs here
}


module.exports = {
  productUpdate
}