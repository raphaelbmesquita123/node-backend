require('dotenv').config({path:__dirname+'/../.env'})
const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(process.env.NODE_STRIPE_SECRET);

app.use(express.static("."));
app.use(express.json());
app.use(cors('*'))

const calculateOrderAmount = items => {
    if(items.length === 1){
        return items[0].price * 100
    } else {
        const fullPrice = items.reduce((acc, item) => acc.price + item.price)
        return fullPrice * 100;
    }
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "eur"
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
        
    } catch(err){
        console.log(err)
    }
});

app.listen(process.env.PORT || 4242, () => console.log('Port 4242!'));
