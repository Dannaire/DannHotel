/** load model for `members` table */
const customerModel = require(`../models/index`).customer
const upload = require(`./upload`).single(`foto`)
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"
exports.login = async (request, response) => {
    try {
        const params = {
            email: request.body.email,
            password: request.body.password,
        }

        const findCustomer = await customerModel.findOne({ where: params })
        if (findCustomer == null) {
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            })
        }
        console.log(findCustomer)
        let tokenPayload = {
            id_customer: findCustomer.id_customer,
            email: findCustomer.email,
            role: findCustomer.role,
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        return response.status(200).json({
            message: "Succes Login",
            data: {
                token: token,
                id_customer: findCustomer.id_customer,
                email: findCustomer.email,
                role: findCustomer.role,
            }
        })
    } catch (error) {
        console.log(error)
        return response.status(500).json({
            message: "Internal error",
            err: error,
        })
    }
}
       
/** create function for read all data */
exports.getAllCustomer = async (request, response) => {
    /** call findAll() to get all data */
    let customers = await customerModel.findAll()
    return response.json({
    success: true,
    data: customers,
    message: `All Users have been loaded`
    })
    }
/** create function for filter */
exports.findCustomer = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.body.keyword
    /** call findAll() within where clause and operation
    * to find data based on keyword */
    let users = await userModel.findAll({
    where: {
    [Op.or]: [
    { nama_user: { [Op.substring]: keyword } }
    // { gender: { [Op.substring]: keyword } },
    // { address: { [Op.substring]: keyword } }
    ]
    }
    })
    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
        })
        }
/** create function for add new member */
/** create function for add new member */
exports.addCustomer = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ 
                message: error 
            })
        }
        if (!request.file) {
            return response.json({ 
                message: `Nothing to Upload`
            })
        }

        let newCustomer = {
            nama: request.body.nama,
            email: request.body.email,
            password: request.body.password,
            role: 'tamu',
            foto: request.file.filename
        }

        
        customerModel.create(newCustomer)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New User has been inserted`
                })
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })        
}
exports.updateCustomer = (request, response) => {
    upload(request, response, async error => {
    if (error) {
    return response.json({ message: error })
    }
    let id = request.params.id
    let customer = {
        nama: request.body.nama,
        email: request.body.email,
        password: request.body.password,
        // role: request.body.role
    }

    if (request.file) {
   
    const selectedFoto = await userModel.findOne({
    where: { id: id }
    })
    const oldFoto = selectedFoto.foto
    const pathFoto = path.join(__dirname, `../gambar`,oldFoto)
    if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, error =>
    console.log(error))
    }
user.foto = request.file.filename
}

userModel.update(user, { where: { id: id } })
.then(result => {

return response.json({
success: true,
message: `Data book has been updated`
})
})
.catch(error => {
/** if update's process fail */
return response.json({
})
})
})
}

exports.deleteCustomer = async (req, res) => {
    try {
      const id_customer = req.params.id;
      const customer = await customerModel.findOne({ where: { id_customer: id_customer } });
      
      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
  
      const oldFoto = customer.foto;
      const pathFoto = path.join(__dirname, `../cover`, oldFoto);
  
      if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }
  
      await customerModel.destroy({ where: { id_customer: id_customer } });
  
      return res.json({
        success: true,
        message: "Data customer has been deleted",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  