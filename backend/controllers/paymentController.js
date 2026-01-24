const handleAsyncOperation = require("../middleware/handleAsyncError");
// Payment Through Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.processPayment = handleAsyncOperation(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    description: req.body?.description,
    shipping: {
      name: req.body.address.name,
      address: {
        line1: req.body.address.line1,
        city: req.body.address.city,
        state: req.body.address.state,
        postal_code: req.body.address.postal_code,
        country: req.body.address.country,
      },
    },
    metadata: {
      company: "Cartico-EW",
      orderId: req.body.orderId,
    },
  });
  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});
exports.sendStripeKey = handleAsyncOperation(async (req, res, next) => {
  res.status(200).json({
    stripeKey: process.env.STRIPE_API_KEY,
  });
});
