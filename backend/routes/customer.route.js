
const express = require(`express`)
const app = express()
app.use(express.json())
// const pemesananController = require(`../controllers/pemesanan.controller`)
const auth = require(`../auth/auth`)
const customerController = require("../controllers/customer.controller");


// Create routes for customerController
app.post("/login", customerController.login);

app.get("/get", auth.authVerify, customerController.getAllCustomer);
app.post("/add",customerController.addCustomer);
app.put("/:id", auth.authVerify, customerController.updateCustomer);
app.delete("/delete/:id", auth.authVerify, customerController.deleteCustomer);

module.exports = app;
