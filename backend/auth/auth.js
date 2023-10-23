const jsonwebtoken = require("jsonwebtoken")

// Middleware untuk memverifikasi token otentikasi
const authVerify = async (req, res, next) => {
    try {
        // 1. Mengambil token otentikasi dari header
        const header = req.headers.authorization
        if (header == null) {
            return res.status(402).json({
                message: "missing token",
                err: null,
            })
        }

        // 2. Membaca token dari header dan mendefinisikan (SECRET_KEY)
        let token = header.split(" ")[1]
        const SECRET_KEY = "secretcode"

        let decodedToken
        try {
            // 3. Memverifikasi token menggunakan jsonwebtoken
            decodedToken = await jsonwebtoken.verify(token, SECRET_KEY)
        } catch (error) {
            // 4. Tangani kesalahan yang mungkin terjadi saat memverifikasi token
            if (error instanceof jsonwebtoken.TokenExpiredError) {
                return res.status(401).json({
                    message: "token expired",
                    err: error,
                })
            }
            return res.status(401).json({
                message: "invalid token",
                err: error,
            })
        }

        // 5. Jika token valid, menyimpan informasi pengguna yang di-decode dalam req.userData
        req.userData = decodedToken

        // 6. Melanjutkan ke middleware atau route berikutnya
        next()
    } catch (error) {
        // 7. Tangani kesalahan jika terjadi
        console.log(error)
        return res.status(500).json({
            message: "internal error",
            err: error,
        })
    }
}

module.exports = { authVerify }
