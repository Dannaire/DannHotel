/** load model for `members` table */
const userModel = require(`../models/index`).user
const upload = require(`./upload`).single(`foto`)
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"
exports.login = async (request, response) => {
    try {
        // 1. Mengambil email dan password dari permintaan
        const params = {
            email: request.body.email,
            password: request.body.password,
        }

        // 2. Mencari pengguna dalam database berdasarkan email dan password
        const findUser = await userModel.findOne({ where: params })

        // 3. Jika pengguna tidak ditemukan
        if (findUser == null) {
            return response.status(404).json({
                message: "email or password doesn't match",
                err: error,
            })
        }

        // 4. Jika pengguna ditemukan, membuat payload token
        console.log(findUser)
        let tokenPayload = {
            id: findUser.id,
            email: findUser.email,
            role: findUser.role,
            nama_user: findUser.nama_user,
        }
        tokenPayload = JSON.stringify(tokenPayload)
        let token = await jsonwebtoken.sign(tokenPayload, SECRET_KEY)

        // 5. Mengembalikan respons berhasil dengan token dan informasi pengguna
        return response.status(200).json({
            message: "Success Login",
            data: {
                token: token,
                id: findUser.id,
                email: findUser.email,
                role: findUser.role,
                nama_user: findUser.nama_user,
            }
        })
    } catch (error) {
        // 6. Tangani kesalahan jika terjadi
        console.log(error)
        return response.status(500).json({
            message: "Internal error",
            err: error,
        })
    }
}

       
/** create function for read all data */
exports.getAllUser = async (request, response) => {
    /** call findAll() to get all data */
    let users = await userModel.findAll()
    return response.json({
    success: true,
    data: users,
    message: `All Users have been loaded`
    })
    }
/** create function for filter */
exports.findUser = async (request, response) => {
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
exports.addUser = (request, response) => {
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

        let newUser = {
            nama_user: request.body.nama_user,
            email: request.body.email,
            password: request.body.password,
            role: request.body.role,
            foto: request.file.filename
        }

        
        userModel.create(newUser)
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
exports.addTamu = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ 
                message: error 
            });
        }
        if (!request.file) {
            return response.json({ 
                message: `Nothing to Upload`
            });
        }

        try {
            // Check if the email already exists in the database
            const existingUser = await userModel.findOne({
                where: { email: request.body.email } // Specify the condition here
            });

            if (existingUser) {
                return response.json({ 
                    success: false,
                    message: `Email already exists`
                });
            }

            let newUser = {
                nama_user: request.body.nama_user,
                email: request.body.email,
                password: request.body.password,
                role: 'tamu',
                foto: request.file.filename
            }

            const result = await userModel.create(newUser);

            return response.json({
                success: true,
                data: result,
                message: `New User has been inserted`
            });
        } catch (error) {
            return response.json({
                success: false,
                message: error.message
            });
        }
    })        
}

exports.updateUser = (request, response) => {
    upload(request, response, async error => {
    if (error) {
    return response.json({ message: error })
    }
    let id = request.params.id
    let user = {
        nama_user: request.body.nama_user,
        email: request.body.email,
        password: request.body.password,
        role: request.body.role
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

exports.deleteUser = async (request, response) => {
    const id = request.params.id
    const user = await userModel.findOne({ where: { id: id } })
    const oldFoto = user.foto
    const pathFoto = path.join(__dirname, `../cover`,oldFoto)

    if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, error => console.log(error))
    }
    
userModel.destroy({ where: { id: id } })
.then(result => {
return response.json({
success: true,
message: `Data book has been deleted`
})
})
.catch(error => {

return response.json({
success: false,
message: error.message
})
})
}