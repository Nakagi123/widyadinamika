const Xendit = require("xendit-node");

const xendit = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

const { Invoice } = xendit;
const invoice = new Invoice({});

module.exports = invoice;