/** load library express */
const express = require(`express`)
/** create object that instances of express */
const app = express()
/** define port of server */
const PORT = 8080
/** load library cors */
const cors = require(`cors`)
/** open CORS policy */
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))   

app.use(cors())
/** define all routes */
const userRoute = require(`./routes/user.route`)
const tipe_kamarRoute = require(`./routes/tipe_kamar.route`)
const kamarRoute = require(`./routes/kamar.route`)
const pemesananRoute = require(`./routes/pemesanan.route`)
const customerRoute = require(`./routes/customer.route`)
// const bookRoute = require(`./routes/book.route`)
// const borrowRoute = require(`./routes/borrow.route`)

/** define prefix for each route */
app.use(`/user`, userRoute)
app.use(`/tipe_kamar`, tipe_kamarRoute)
app.use(`/kamar`, kamarRoute)
app.use(`/pemesanan`, pemesananRoute) 
app.use(`/customer`, customerRoute) 
// app.use(`/book`, bookRoute)
// app.use(`/borrow`, borrowRoute)
/** route to access uploaded file */
app.use(express.static(__dirname))

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of School's Library runs on port
    ${PORT}`)
    })
    