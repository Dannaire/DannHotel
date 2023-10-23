const express = require(`express`)
/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */

app.use(express.json())
/** load member's controller */
const tipe_kamarController =
require(`../controllers/tipe.kamar.controller`)
const auth = require(`../auth/auth`)

app.get("/get", auth.authVerify,tipe_kamarController.getAllTipekamar)
app.post("/add", auth.authVerify,tipe_kamarController.addTipekamar)
app.post("/find", auth.authVerify,tipe_kamarController.findTipekamar)   
app.get("/findavail", auth.authVerify,tipe_kamarController.findAvailableTipeKamar)   
app.put("/update/:id", auth.authVerify,tipe_kamarController.updateTipekamar)
app.delete("/delete/:id", auth.authVerify,tipe_kamarController.deleteTipekamar)
module.exports = app