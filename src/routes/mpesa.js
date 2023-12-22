const express = require('express'),
    router = express.Router(),
    prettyjson = require('prettyjson'),
    config = require('../config'),
    request = require('request'),
    consumer_key = config.consumerKey,
    consumer_secret = config.secret,
    passkey = config.passkey,
    shortcode = config.shortcode,
    confirmation_url = config.confirmation_url,
    validation_url = config.validation_url,
    auth = "Basic " + Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64");

const getConnection = require('../database.js')

const prettyJsonOptions = {
    noColor: true
};

function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    //let auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64");

    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                // let resp = 
                //console.log(response)
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    )
}

function startInterval(seconds) {
    setInterval(function () { getOauthToken() }, seconds * 1000);
}

function pad2(n) { return n < 10 ? '0' + n : n }

function formatDate() {
    let date = new Date();
    let correctDate =
        date.getFullYear().toString() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
    return correctDate;
}

/**
 * @swagger
 * /access_token:
 *   get:
 *     tags:
 *     - MPESA
 *     summary: Get access token
 *     description: Get access token
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/access_token', access, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
})

/**
 * @swagger
 * /register:
 *   get:
 *     tags:
 *     - MPESA
 *     summary: Register MPESA URLS
 *     description: Register MPESA URLS
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/register', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": shortcode,
                "ResponseType": "Complete",
                "ConfirmationURL": confirmation_url,
                "ValidationURL": validation_url
            }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
})

/**
 * @swagger
 * /simulate:
 *   get:
 *     tags:
 *     - MPESA
 *     summary: Simulate an MPESA transaction
 *     description: Simulate an MPESA transaction
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/simulate', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": shortcode,
                "CommandID": "CustomerPayBillOnline",
                "Amount": "100",
                "Msisdn": "254708374149",
                "BillRefNumber": "TestAPI"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

/**
 * @swagger
 * /stkpush:
 *   get:
 *     tags:
 *     - MPESA
 *     summary: Send stk push
 *     description: Send stk push
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/stkpush', access, (req, res) => {
    if (req.body.phoneNumber && req.body.amount) {
        let timestamp = formatDate();
        let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            password = Buffer.from(shortcode + passkey + timestamp).toString("base64"),
            auth = "Bearer " + req.access_token;
        axios({
            method: 'POST',
            url: url,
            headers: {
                "Authorization": auth
            },
            data: {
                "BusinessShortCode": shortcode,                     //Your Business ShortCode
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": req.body.amount,                          //Amount to be paid
                "PartyA": req.body.phoneNumber,                     //Number sending funds
                "PartyB": shortcode,                                //Business ShortCode receiving funds   
                "PhoneNumber": req.body.phoneNumber,                //Number sending funds
                "CallBackURL": "http://example.com/api/v1/c2bconfirmation", //Your confirmation Url
                "AccountReference": "Example",                      //Name to display to receiver of STK Push
                "TransactionDesc": "Testing mpesa"                  //Description of Transaction
            }
        }).then(response => {
            res.status(200).send('Stk push sent to phone');
            let responseBody = response.data;
            //Using the above responseBody handle the data.
        }).catch(error => {
            res.status(500).send('There was an error');
            console.error(`LNMO error is: ${error}`);
        });
    } else {
        res.status(400).send('Bad request');
    }
})

/**
 * @swagger
 * /validation:
 *   post:
 *     tags:
 *     - MPESA
 *     summary: Validate mpesa transaction
 *     description: Validate mpesa transaction
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

router.post('/validation', function (req, res) {
    console.log('-----------C2B VALIDATION REQUEST------------');
    console.log(prettyjson.render(req.body, prettyJsonOptions));
    console.log('-----------------------');

    let message = {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    };
    res.json(message);
});


/**
 * @swagger
 * /confirmation:
 *   post:
 *     tags:
 *     - MPESA
 *     summary: Confirm mpesa transaction
 *     description: Confirm mpesa transaction
 *     parameters:
 *     - name: body
 *       in: body
 *       description: Enter parameters to send disconnect request
 *       required: true
 *       schema:
 *          type: object
 *          $ref: '#/definitions/Mpesa'
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

router.post('/confirmation', function (req, res) {
    const { TransactionType, TransID, TransTime, TransAmount, BusinessShortCode, BillRefNumber, InvoiceNumber, OrgAccountBalance, ThirdPartyTransID, MSISDN, FirstName, MiddleName, LastName } = req.body
    console.log('-----------C2B CONFIRMATION REQUEST------------');
    console.log(prettyjson.render(req.body, prettyJsonOptions));
    console.log('-----------------------');

    const query = `
    SET @transactionType = ?;
    SET @transID = ?;
    SET @TransTime = ?;
    SET @transAmount = ?;
    SET @businessShortCode = ?;
    SET @billRefNumber = ?;
    SET @invoiceNumber = ?;
    SET @orgAccountBalance = ?;
    SET @thirdPartyTransID = ?;
    SET @MSISDN = ?;
    SET @firstName = ?;
    SET @middleName = ?;
    SET @lastName = ?;
    SET @paymentStatus = ?;
    CALL mpesaAdd(@transactionType, @transID, @TransTime, @transAmount, @businessShortCode, @billRefNumber, @invoiceNumber, @orgAccountBalance, @thirdPartyTransID, @MSISDN, @firstName, @middleName, @lastName, @paymentStatus);
    `

    getConnection.query(query, [TransactionType, TransID, TransTime, TransAmount, BusinessShortCode, BillRefNumber, InvoiceNumber, OrgAccountBalance, ThirdPartyTransID, MSISDN, FirstName, MiddleName, LastName, 'Completed'], (err, rows, fields) => {
        if (!err) {
            let message = {
                "ResultCode": 0,
                "ResultDesc": "Accepted"
            };
            res.json(message);
        } else {
            console.log(err);
        }
    })

    /*req.body.TransactionType
    req.body.TransID
    req.body.TransTime
    req.body.TransAmount
    req.body.BusinessShortCode
    req.body.BillRefNumber
    req.body.InvoiceNumber
    req.body.OrgAccountBalance
    req.body.ThirdPartyTransID
    req.body.MSISDN
    req.body.FirstName
    req.body.MiddleName
    req.body.LastName */   

});

module.exports = router