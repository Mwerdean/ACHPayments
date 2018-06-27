require('dotenv').config()
const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const app = express()
const crypto = require('crypto')
const cookie = require('cookie')
const nonce = require('nonce')()
const querystring = require('querystring')
const request = require('request-promise')

app.use(bodyParser.json())
app.use(cors())

const apiKey = process.env.SHOPIFY_API_KEY
const apiSecret = process.env.SHOPIFY_API_SECRET
const scopes = 'read_products'
const forwardingAddress= "https://806f14e0.ngrok.io"

//----------------------------------This is to connect to shopify and download the app------------------------------------------------------------------------------------------------------------------------------------------

app.get('/shopify', (req, res) => {
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
  });

  app.get('/shopify/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
  
    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  
    if (shop && hmac && code) {
      // DONE: Validate request is from Shopify
      const map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      const message = querystring.stringify(map);
      const providedHmac = Buffer.from(hmac, 'utf-8');
      const generatedHash = Buffer.from(
        crypto
          .createHmac('sha256', apiSecret)
          .update(message)
          .digest('hex'),
          'utf-8'
        );
      let hashEquals = false;
  
      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
      } catch (e) {
        hashEquals = false;
      };
  
      if (!hashEquals) {
        return res.status(400).send('HMAC validation failed');
      }
  
      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
  
      request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
  
        const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
        const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken,
        };

        request.get(shopRequestUrl, { headers: shopRequestHeaders })
        .then((shopResponse) => {
        res.end(shopResponse);
        })
        .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
        });
        // TODO
        // Use access token to make API call to 'shop' endpoint
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
  
    } else {
      res.status(400).send('Required parameters missing');
    }
  });
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let customerInfo = [];
let customerID = ""
let customer = {}
let defaultSource = ""

//Create a Stripe customer if one does not already exist
app.post("/createCustomer", (req, res) => {
    console.log("email", req.body[1].email)
    console.log(req.body)
    let tokenID = req.body[0].token.id
    console.log(tokenID)
    stripe.customers.create({
        email: "mwerdean@yahoo.com",
        source: tokenID,
        description: "Example customer"
    }, function(err, customer) {
        if(customer) {
            console.log(customer)
            customer = customer
            customerID = customer.id
            defaultSource = customer.default_source
            res.status(200).send("Customer Created!")
        }
        else {
            console.log(err)
            res.status(400).send("Bad Request")
        }
    })
})

//Loads index.html and grabs email from URL parameter.
app.get("/", function(req, res) {
	customerInfo["email"] = req.query.customer;
	customerInfo["chargeAmount"] = '500';
	stripe.customers.list(
	{ limit: 3, email: customerInfo.email },
	  function(err, customers) {
	   customerInfo["default_source"] = customers.data[0].default_source;
	   customerInfo["id"] = customers.data[0].id;
    });
    console.log("customer Info", customerInfo)
});


//Takes values from index.html and checks them to verify accuracy
app.post("/verifyBank", (req, res) => {
    let values = [parseInt(req.body.value1), parseInt(req.body.value2)];
    console.log(values)
	stripe.customers.verifySource(
	  customerID,
	  defaultSource,
	  {
	    amounts: values
	  },
	  function(err, bankAccount) {
	  	if(bankAccount)
              console.log("bank account", bankAccount);
              res.status(200).send("Bank Verified!")
	});
});

//Makes a charge to ACH account
app.post("/charge", (req, res) => {
	stripe.charges.create({
	  amount: 500,
	  currency: "usd",
	  customer: customerID
	});
	res.status(200).send("Charge Complete!")
});







//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------




app.get('/customer', (req,res) => {
    res.status(200).send({ customer: customers })
})

// app.get('/cart', (req,res) => {
// 	res.status(200).send({ cart: cart })
// })




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const port = process.env.SERVER_PORT
app.listen(port, function() {
	console.log("listening on port " + port);
})