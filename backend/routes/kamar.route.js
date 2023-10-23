/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */

app.use(express.json())
/** load member's controller */
const kamarController =
require(`../controllers/kamar.controller`)
const auth = require(`../auth/auth`)
/** create route to get data with method "GET" */
app.get("/get",auth.authVerify, kamarController.getAllRoom)
/** create route to add new member using method "POST" */
app.post("/add",auth.authVerify, kamarController.addRoom)
/** create route to find member
* using method "POST" and path "find" */
app.post("/find",auth.authVerify, kamarController.findRoom)
app.post("/findavail", auth.authVerify,kamarController.findRoomByFilterDate)
/** create route to update member
* using method "PUT" and define parameter for "id" */
app.put("/update/:id",auth.authVerify, kamarController.updateRoom)

app.delete("/delete/:id",auth.authVerify, kamarController.deleteRoom)

module.exports = app