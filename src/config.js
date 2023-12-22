const dotenv = require('dotenv');

//Set up your environment variables from the .env file
dotenv.config();
module.exports = {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    secret: process.env.MPESA_CONSUMER_SECRET,
    passkey: process.env.MPESA_PASSKEY,
    shortcode: process.env.MPESA_SHORTCODE,
    port: process.env.PORT,
    confirmation_url: process.env.MPESA_CONFIRMATION_URL,
    validation_url: process.env.MPESA_VALIDATION_URL
};