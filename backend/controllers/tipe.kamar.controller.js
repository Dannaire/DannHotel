/** load model for `members` table */
const tipe_kamarModel = require(`../models/index`).tipe_kamar
const tipeModel = require('../models/index').tipe_kamar;
const kamarModel = require('../models/index').kamar;
const detail_pemesananModel = require('../models/index').detail_pemesanan;
const upload = require(`./upload`).single(`foto`)
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)


/** create function for read all data */
exports.getAllTipekamar = async (request, response) => {
    /** call findAll() to get all data */
    let tipe_kamars = await tipe_kamarModel.findAll()
    return response.json({
    success: true,
    data: tipe_kamars,
    message: `All Users have been loaded`
    })
    }
/** create function for filter */
exports.findTipekamar = async (request, response) => {
    /** define keyword to find data */
    let nama_tipe_kamar = request.body.nama_tipe_kamar
    /** call findAll() within where clause and operation
    * to find data based on keyword */
    let tipekamar = await tipe_kamarModel.findAll({
    where: {
    [Op.or]: [
    { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }
    // { gender: { [Op.substring]: keyword } },
    // { address: { [Op.substring]: keyword } }
    ]
    }
    })
    return response.json({
        success: true,
        data: tipekamar,
        message: `All users have been loaded`
        })
        }


exports.findAvailableTipeKamar = async (request, response) => {
  try {
    const { checkin, checkout } = request.body;

    const availableRooms = await sequelize.query(
      `
      SELECT kamars.id, tipe_kamars.foto, tipe_kamars.harga, tipe_kamars.deskripsi, kamars.nomor_kamar, tipe_kamars.nama_tipe_kamar
      FROM kamars
      JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar
      WHERE kamars.id NOT IN (
        SELECT kamars.id
        FROM pemesanans
        WHERE tgl_check_in <= :checkout
        AND tgl_check_out >= :checkin
      )
      ORDER BY kamars.id ASC;
      `,
      {
        replacements: {
          checkin,
          checkout,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return response.json({
      success: true,
      data: availableRooms,
      message: 'Available rooms have been loaded',
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** create function for add new member */
exports.addTipekamar = (request, response) => {
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
        const existingTipe = await tipeModel.findOne({
            where: { nama_tipe_kamar: request.body.nama_tipe_kamar },
            // attributes: { exclude: ['tipeKamarId'] }, // Specify the condition here
        });
        
        if (existingTipe) {
            return response.json({ 
                success: false,
                message: `Tipe kamar already exists`
            });
        }
        let newTipe_kamar = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            foto: request.file.filename
        }

        
    tipe_kamarModel.create(newTipe_kamar)
            .then(result => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New Tipe Kamar has been inserted`
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
exports.updateTipekamar = (request, response) => {
    upload(request, response, async error => {
    if (error) {
    return response.json({ message: error })
    }
    let id = request.params.id
    let tipe_kamar = {
        nama_tipe_kamar: request.body.nama_tipe_kamar,
        harga: request.body.harga,
        deskripsi: request.body.deskripsi
    }

    if (request.file) {
   
    const selectedFoto = await tipe_kamarModel.findOne({
    where: { id: id }
    })
    const oldFoto = selectedFoto.foto
    const pathFoto = path.join(__dirname, `../gambar`,oldFoto)
    if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, error =>
    console.log(error))
    }
tipe_kamar.foto = request.file.filename
}

tipe_kamarModel.update(tipe_kamar, { where: { id: id } })
.then(result => {

return response.json({
success: true,
message: `Data tipe kamar has been updated`
})
})
.catch(error => {
/** if update's process fail */
return response.json({
})
})
})
}

exports.deleteTipekamar = async (request, response) => {
    const id = request.params.id
    const tipe_kamar = await tipe_kamarModel.findOne({ where: { id: id } })
    const oldFoto = tipe_kamar.foto
    const pathFoto = path.join(__dirname, `../cover`,oldFoto)

    if (fs.existsSync(pathFoto)) {
    fs.unlink(pathFoto, error => console.log(error))
    }
    
tipe_kamarModel.destroy({ where: { id: id } })
.then(result => {
return response.json({
success: true,
message: `Data tipe_kamar has been deleted`
})
})
.catch(error => {

return response.json({
success: false,
message: error.message
})
})
}
const findRoomByFilterDate = async (req, res) => {
    const checkInDate = req.body.tgl_check_in
    const checkOutDate = req.body.tgl_check_out

    if (checkInDate === "" || checkOutDate === "") {
        return res.status(200).json({
            message: "null",
            code: 200,
            room: []
        });
    }

    const roomData = await roomType.findAll({
        attributes: ["id_tipe_kamar", "name_tipe_kamar", "harga", "foto", "deskripsi"],
        include: [
            {
                model: kamar,
                as: "kamar"

            }
        ]
    })

    const roomBookedData = await roomType.findAll({
        atrributes: ["id_tipe_kamar", "nama_tipe_kamar", "harga", "foto", "deskripsi"],
        include: [
            {
                model: kamar,
                as: "kamar",
                include: [
                    {
                        model: detailPemesanan,
                        as: "detail_booking",
                        attributes: ["access_date"],
                        where: {
                            access_date: {
                                [Op.between]: [checkInDate, checkOutDate]
                            }
                        }
                    }
                ]
            }
        ]
    })

    const available = []
    const availableByType = []

    for (let i = 0; i < roomData.length; i++) {
        roomData[i].room.forEach((room) => {
            let isBooked = false
            roomBookedData.forEach((booked) => {
                booked.room.forEach((bookedRoom) => {
                    if (room.id_room === bookedRoom.id_room) {
                        isBooked = true
                    }
                })
            })

            if (!isBooked) {
                available.push(room)
            }
        })
    }

    for (let i = 0; i < roomData.length; i++) {
        let roomType = {}
        roomType.id_room_type = roomData[i].id_room_type
        roomType.name_room_type = roomData[i].name_room_type
        roomType.price = roomData[i].price
        roomType.photo = roomData[i].photo
        roomType.description = roomData[i].description
        roomType.room = []
        available.forEach((room) => {
            if (room.id_room_type === roomData[i].id_room_type) {
                roomType.room.push(room)
            }
        })
        if (roomType.room.length > 0) {
            availableByType.push(roomType)
        }
    }

    return res.status(200).json({
        message: "Succes to get available room by type room",
        code: 200,
        roomAvailable: available,
        roomAvailableCount: available.length,
        room: availableByType,
        typeRoomCount: availableByType.length
    });
}