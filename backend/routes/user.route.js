/** load library express */
const express = require(`express`)
/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */

app.use(express.json())
/** load member's controller */
const userController =
require(`../controllers/user.controller`)
const auth = require(`../auth/auth`)
app.post("/login", userController.login)
/** create route to get data with method "GET" */
app.get("/", auth.authVerify,userController.getAllUser)
/** create route to add new member using method "POST" */
app.post("/add", userController.addUser)
app.post("/addtamu", userController.addTamu)
/** create route to find member
* using method "POST" and path "find" */
app.post("/find",auth.authVerify, userController.findUser)
/** create route to update member
* using method "PUT" and define parameter for "id" */
app.put("/update/:id", auth.authVerify,userController.updateUser)

app.delete("/delete/:id", auth.authVerify,userController.deleteUser)

module.exports = app