const pemesananModel = require(`../models/index`).pemesanan;
const detail_pemesananModel = require(`../models/index`).detail_pemesanan;
const kamarModel = require('../models/index').kamar;
const kamar = require(`../models/index`).kamar;
const tipeModel = require(`../models/index`).tipe_kamar;
const userModel = require('../models/index').user;
// const pemesananModel = require(`../models/index`).pemesanan;
// const customerModel = require(`../models/index`).customer
const pemesanans = require(`../models/index`).pemesanan;
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan;
// const userModel = require(`../models/index`).user;
const roomModel = require(`../models/index`).kamar;
// const tipeModel = require(`../models/index`).tipe_kamar;
// const tipe_kamars = require(`../models/index`);
// const kamar = require('../models/index').kamar;
// const detail_pemesananModel = require(`../models/index`).detail_pemesanan;
const moment = require("moment");
const Op = require(`sequelize`).Op
const crypto = require('crypto');

const Sequelize = require("sequelize");
const sequelize = new Sequelize("ukk_hotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
})

exports.getAllPemesanan = async (request, response) => {
    const result = await sequelize.query(
      "SELECT pemesanans.id,pemesanans.nomor_pemesanan, pemesanans.nama_pemesanan,pemesanans.email_pemesanan,pemesanans.tgl_pemesanan,pemesanans.tgl_check_in,pemesanans.tgl_check_out,pemesanans.nama_tamu,pemesanans.jumlah_kamar,pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM pemesanans JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar JOIN users ON users.id=pemesanans.id_user JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan=pemesanans.id JOIN kamars ON kamars.id=detail_pemesanans.id_kamar GROUP BY pemesanans.id ORDER BY nomor_pemesanan"
    );
  
    response.json({
      success: true,
      data: result[0],
      message: `All Transaction have been loaded`,
    });
  };
  
  
  /** create function for filter */
exports.find = async (request, response) => {
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
  //mendapatkan salah satu data
 
  
  exports.findPemesanan = async (request, response) => {
    let keyword = request.body.keyword;
  
    const result = await sequelize.query(
      `SELECT DISTINCT pemesanans.id, pemesanans.nomor_pemesanan, pemesanans.nama_pemesanan, pemesanans.email_pemesanan, pemesanans.tgl_pemesanan, pemesanans.tgl_check_in, pemesanans.tgl_check_out, pemesanans.nama_tamu, pemesanans.jumlah_kamar, pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar 
    FROM pemesanans 
    JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar 
    JOIN users ON users.id = pemesanans.id_user 
    JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan = pemesanans.id 
    JOIN kamars ON kamars.id = detail_pemesanans.id_kamar 
    WHERE pemesanans.nama_tamu LIKE '%${keyword}%' 
    ORDER BY nomor_pemesanan ASC`
    );
  
    return response.json({
      success: true,
      data: result[0],
      message: `Transaction has been loaded`,
    });
  };

  exports.findPemesananById = async (request, response) => {
    let id = request.params.id; // Mengambil nilai 'keyword' dari query string URL
  
    const result = await sequelize.query(
      `SELECT 
          pemesanans.id, 
          pemesanans.nomor_pemesanan, 
          pemesanans.nama_pemesanan, 
          pemesanans.email_pemesanan, 
          pemesanans.tgl_pemesanan, 
          pemesanans.tgl_check_in, 
          pemesanans.tgl_check_out, 
          pemesanans.nama_tamu, 
          pemesanans.jumlah_kamar, 
          pemesanans.status_pemesanan, 
          users.nama_user, 
          tipe_kamars.nama_tipe_kamar, 
          kamars.nomor_kamar, 
          (
            SELECT harga 
            FROM detail_pemesanans 
            WHERE detail_pemesanans.id_pemesanan = pemesanans.id 
            ORDER BY harga ASC 
            LIMIT 1
          ) AS harga
       FROM pemesanans 
       JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar 
       JOIN users ON users.id = pemesanans.id_user 
       JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan = pemesanans.id 
       JOIN kamars ON kamars.id = detail_pemesanans.id_kamar
       WHERE pemesanans.id LIKE '%${id}'`
    );
  
    return response.json({
      success: true,
      data: result[0],
      message: `Transaction details have been loaded`,
    });
  };
  


  exports.getPemesananById = async (request, response) => {
    let id = request.params.id; // Mengambil nilai 'keyword' dari query string URL
    
    const result = await sequelize.query(
      `SELECT DISTINCT pemesanans.id,detail_pemesanans.harga, pemesanans.nomor_pemesanan, pemesanans.nama_pemesanan, pemesanans.email_pemesanan, pemesanans.tgl_pemesanan, pemesanans.tgl_check_in, pemesanans.tgl_check_out, pemesanans.nama_tamu, pemesanans.jumlah_kamar, pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar 
      FROM pemesanans 
      JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar 
      JOIN users ON users.id = pemesanans.id_user 
      JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan = pemesanans.id 
      JOIN kamars ON kamars.id = detail_pemesanans.id_kamar 
      WHERE users.id LIKE '%${id}%'
      GROUP BY pemesanans.nomor_pemesanan
      ORDER BY nomor_pemesanan ASC;
      `
    );
   
    return response.json({
      success: true,
      data: result[0],
      message: `Transaction Sampun Terload ALL`,
    });
};


  exports.getAvailableRooms = async (request, response) => {
    try {
      const { tgl_check_in, tgl_check_out } = request.body; // Assuming tgl_check_in and tgl_check_out are sent in the request body

      const bookedRooms = await detail_pemesananModel.findAll({
        where: {
          tgl_akses: {
            [Op.between]: [tgl_check_in, tgl_check_out],
          },
        },
        attributes: ['id_kamar'],
      });

      const bookedRoomIds = bookedRooms.map((row) => row.id_kamar);

      const availableKamars = await kamarModel.findAll({
        where: {
          id: {
            [Op.notIn]: bookedRoomIds,
          },
        },
        attributes: ['id_tipe_kamar'],
      });

      const availableTipeKamarIds = availableKamars.map((row) => row.id_tipe_kamar);

      const availableTipeKamar = await tipeModel.findAll({
        where: {
          id: {
            [Op.in]: availableTipeKamarIds,
          },
        },
      });

      return response.status(200).json({
        success: true,
        data: availableTipeKamar,
        message: 'ALL tipe kamr njenenengan sampun fetched successfully',
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: error.message,
      });
    }
};


  
  
  
  
exports.addPemesanan = async (request, response) => {
    let nomor_kamar = request.body.nomor_kamar;
    let room = await roomModel.findOne({
      where: {
        [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
      },
      attributes: [
        "id",
        "nomor_kamar",
        "id_tipe_kamar",
        "createdAt",
        "updatedAt",
      ],
    });
  
    let nama_user = request.body.nama_user;
    let userId = await userModel.findOne({
      where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });
  
    if (room === null) {
      return response.json({
        success: false,
        message: `Kamar yang anda inputkan tidak ada`,
      });
    } else if (userId === null) {
      return response.json({
        success: false,
        message: `User yang anda inputkan tidak ada`,
      });
    } else {
      let numberRandom = Math.floor(Math.random() * (10000000 - 99999999) + 99999999); 

      let newData = {
        nomor_pemesanan: numberRandom,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: request.body.tgl_pemesanan,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: room.id_tipe_kamar,
        status_pemesanan: request.body.status_pemesanan,
        id_user: userId.id,
      };
  
      let roomCheck = await sequelize.query(
        `SELECT * FROM detail_pemesanans WHERE id_kamar = "${room.id}" AND tgl_akses= "${request.body.tgl_check_in}" ;`
    );
    
  
      if (roomCheck[0].length === 0) {
        pemesananModel
          .create(newData)
          .then((result) => {
            let pemesananID = result.id;
            let detailsOfPemesanan = request.body.details_of_pemesanan;
  
            for (let i = 0; i < detailsOfPemesanan.length; i++) {
              detailsOfPemesanan[i].id_pemesanan = pemesananID;
            }
  
            let tgl1 = new Date(request.body.tgl_check_in);
            let tgl2 = new Date(request.body.tgl_check_out);
            let checkIn = moment(tgl1).format("YYYY-MM-DD");
            let checkOut = moment(tgl2).format("YYYY-MM-DD");
  
            // check if the dates are valid
            if (
              !moment(checkIn, "YYYY-MM-DD").isValid() ||
              !moment(checkOut, "YYYY-MM-DD").isValid()
            ) {
              return response
                .status(400)
                .send({ message: "Invalid date format" });
            }
  
            let success = true;
            let message = '';
            
            for (
              let m = moment(checkIn, "YYYY-MM-DD");
              m.isBefore(checkOut);
              m.add(1, "days")
            ) {
              let date = m.format("YYYY-MM-DD");
              let newDetail = {
                id_pemesanan: pemesananID,
                id_kamar: room.id,
                tgl_akses: date,
                harga: detailsOfPemesanan[0].harga,
              };
              detailsOfPemesananModel
                .create(newDetail)
                .catch((error) => {
                  success = false;
                  message = error.message;
                });
            }
            
            if (success) {
              return response.json({
                success: true,
                message: `New transactions have been inserted`,
              });
            } else {
              return response.json({
                success: false,
                message: message,
              });
            }
      })          
          .catch((error) => {
            return response.json({
              success: false,
              message: error.message,
            });
          });
      } else {
        return response.json({
          success: false,
          message: `Kamar yang anda pesan sudah di booking`,
        });
      }
    }
  };
  
  //update data
  exports.updatePemesanan = async (request, response) => {
    let nomor_kamar = request.body.nomor_kamar;
    let room = await roomModel.findOne({
      where: {
        [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
      },
      attributes: [
        "id",
        "nomor_kamar",
        "id_tipe_kamar",
        "createdAt",
        "updatedAt",
      ],
    });
  
    let nama_user = request.body.nama_user;
    let userId = await userModel.findOne({
      where: {
        [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });
  
    let newData = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesanan: request.body.nama_pemesanan,
      email_pemesanan: request.body.email_pemesanan,
      tgl_pemesanan: request.body.tgl_pemesanan,
      tgl_check_in: request.body.tgl_check_in,
      tgl_check_out: request.body.tgl_check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      id_tipe_kamar: room.id_tipe_kamar,
      status_pemesanan: request.body.status_pemesanan,
      id_user: userId.id,
    };
  
    let pemesananID = request.params.id;
  
    pemesananModel
      .update(newData, { where: { id: pemesananID } })
      .then(async (result) => {
        await detailsOfPemesananModel.destroy({
          where: { id_pemesanan: pemesananID },
        });
  
        let detailsOfPemesanan = request.body.details_of_pemesanan;
  
        for (let i = 0; i < detailsOfPemesanan.length; i++) {
          detailsOfPemesanan[i].id_pemesanan = pemesananID;
        }
  
        let tgl1 = new Date(request.body.tgl_check_in);
        let tgl2 = new Date(request.body.tgl_check_out);
        let checkIn = moment(tgl1).format("YYYY-MM-DD");
        let checkOut = moment(tgl2).format("YYYY-MM-DD");
  
        // check if the dates are valid
        if (
          !moment(checkIn, "YYYY-MM-DD").isValid() ||
          !moment(checkOut, "YYYY-MM-DD").isValid()
        ) {
          return response
            .status(400)
            .send({ message: "Invalid date format" });
        }
  
        let success = true;
        let message = '';
        
        for (
          let m = moment(checkIn, "YYYY-MM-DD");
          m.isBefore(checkOut);
          m.add(1, "days")
        ) {
          let date = m.format("YYYY-MM-DD");
          let newDetail = {
            id_pemesanan: pemesananID,
            id_kamar: room.id,
            tgl_akses: date,
            harga: detailsOfPemesanan[0].harga,
          };
          detailsOfPemesananModel
            .create(newDetail)
            .catch((error) => {
              success = false;
              message = error.message;
            });
        }
        
        if (success) {
          return response.json({
            success: true,
            message: `New transactions have been inserted`,
          });
        } else {
          return response.json({
            success: false,
            message: message,
          });
        }
  })          
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  };
 // update data
exports.updateStatusPemesanan = async (request, response) => {
  try {
    const { id } = request.params;
    const { status_pemesanan } = request.body;

    const newData = {
      status_pemesanan: status_pemesanan, // Update status pemesanan
    };

    await pemesananModel.update(newData, { where: { id } });

    return response.json({
      success: true,
      message: "Status pemesanan berhasil diperbarui",
    });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

  
  
  //delete data
  exports.deletePemesanan = async (request, response) => {
    let pemesananID = request.params.id;
  
    detailsOfPemesananModel
      .destroy({
        where: { id_pemesanan: pemesananID },
      })
      .then((result) => {
        pemesananModel
          .destroy({ where: { id: pemesananID } })
          .then((result) => {
            return response.json({
              success: true,
              message: `Transaction has been deleted`,
            });
          })
          .catch((error) => {
            return response.json({
              success: false,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  };

  
  exports.addPemesananCust = async (request, response) => {
    const tipe_kamar = request.body.tipe_kamar;
    const nama_user = request.body.nama_user;
  
    try {
      // Find the 'tipe' based on 'tipe_kamar'
      const tipe = await tipeModel.findOne({
        where: {
          nama_tipe_kamar: {
            [Op.substring]: tipe_kamar,
          },
        },
      });
  
      if (tipe === null) {
        return response.status(404).json({
          success: false,
          message: `Tipe Kamar ${tipe_kamar} tidak ditemukan`,
        });
      }
      // console.log("tipe object:", tipe);
      console.log("tipe.id:", tipe.id);


      // Check for booked rooms within the specified date range
      const bookedRooms = await sequelize.query(
        `SELECT id_kamar FROM detail_pemesanans WHERE tgl_akses BETWEEN "${request.body.tgl_check_in}" AND "${request.body.tgl_check_out}"`
      );
      const bookedRoomIds = bookedRooms[0].map((row) => row.id_kamar);
  
      // Find available rooms for the specified 'tipe_kamar'
      const rooms = await kamar.findAll({
        where: {
          id_tipe_kamar: tipe.id,
          id: {
            [Op.notIn]: bookedRoomIds,
          },
        },
        attributes: ['id', 'nomor_kamar', 'id_tipe_kamar', 'createdAt', 'updatedAt'],
      });
      
      
  
      // Find the user based on 'nama_user'
      const user = await userModel.findOne({
        where: {
          nama_user: {
            [Op.substring]: nama_user,
          },
        },
      });
  
      if (rooms.length === 0) {
        return response.json({
          success: false,
          message: `Waduh Habis Sam Kamarnya`,
        });
      } else if (user === null) {
        return response.json({
          success: false,
          message: `User yang anda inputkan tidak ditemukan`,
        });
      } else {
        const date = moment();
        const tgl = date.format('YYYY-MM-DD');
        // const randomString = crypto.randomBytes(10).toString('hex');
        let tw = Date.now();
        let numberRandom = Math.floor(
          Math.random() * (10000000 - 99999999) + 99999999
        );
        // const tgl_pesan = `${tgl}-${randomString}`;
        const newData = {
          nomor_pemesanan: numberRandom,
          nama_pemesanan: request.body.nama_pemesanan,
          email_pemesanan: request.body.email_pemesanan,
          tgl_pemesanan: tw,
          tgl_check_in: request.body.tgl_check_in,
          tgl_check_out: request.body.tgl_check_out,
          nama_tamu: request.body.nama_tamu,
          jumlah_kamar: request.body.jumlah_kamar,
          id_tipe_kamar: tipe.id, // Updated to 'id_tipe_kamar'
          status_pemesanan: 'baru',
          id_user: user.id,
        };
  
        // Check if the room is already booked on 'tgl_check_in'
        const roomCheck = await sequelize.query(
          `SELECT * FROM detail_pemesanans WHERE id_kamar = '${newData.id_tipe_kamar}' AND tgl_akses= "${request.body.tgl_check_in}"`
        );

        if (roomCheck[0].length === 0) {
          let success = true;
          let message = '';
  
          const availableRooms = rooms.slice(0, newData.jumlah_kamar);
  
          if (availableRooms.length < newData.jumlah_kamar) {
            return response.json({
              success: false,
              message: `Hanya Wonten ${availableRooms.length} kamar for tipe kamar ${tipe_kamar}`,
            });
          }
  
          // Create a new pemesanan
          const result = await pemesananModel.create(newData);
  
          const pemesananID = result.id;
          const detail_pemesanan = tipe.harga;
  
          const tgl_check_in = moment(request.body.tgl_check_in, 'YYYY-MM-DD');
          const tgl_check_out = moment(request.body.tgl_check_out, 'YYYY-MM-DD');
          const totalDays = tgl_check_out.diff(tgl_check_in, 'days');
  
          const totalHarga = tipe.harga ;
  
          // Create detail_pemesanan entries for each day and room
          for (
            let m = moment(newData.tgl_check_in, 'YYYY-MM-DD');
            m.isBefore(newData.tgl_check_out);
            m.add(1, 'days')
          ) {
            const date = m.format('YYYY-MM-DD');
  
            for (let i = 0; i < availableRooms.length; i++) {
              const roomNumber =
                availableRooms.length > 1
                  ? `${availableRooms[i].nomor_kamar}-${m.diff(
                      moment(request.body.tgl_check_in, 'YYYY-MM-DD'),
                      'days'
                    ) + 1}`
                  : availableRooms[i].nomor_kamar;
  
              const newDetail = {
                id_pemesanan: pemesananID,
                id_kamar: availableRooms[i].id,
                tgl_akses: date,
                harga: totalHarga,
                nomor_kamar: roomNumber,
              };
  
              await detail_pemesananModel
                .create(newDetail)
                .catch((error) => {
                  success = false;
                  message = error.message;
                });
            }
          }
  
          if (success) {
            return response.json({
              success: true,
              message: `New transactions have been inserted`,
            });
          } else {
            return response.json({
              success: false,
              message: message,
            });
          }
        } else {
          return response.json({
            success: false,
            message: `Kamar yang akan dipesan sudah di booking`,
          });
        }
      }
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  // exports.addPemesananCust = async (request, response) => {
  //   let nomor_kamar = request.body.nomor_kamar;
  //   let room = await roomModel.findOne({
  //     where: {
  //       [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
  //     },
  //     attributes: [
  //       "id",
  //       "nomor_kamar",
  //       "id_tipe_kamar",
  //       "createdAt",
  //       "updatedAt",
  //     ],
  //   });
  
  //   let nama_user = request.body.nama_user;
  //   let userId = await userModel.findOne({
  //     where: {
  //       [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
  //     },
  //   });
  
  //   if (room === null) {
  //     return response.json({
  //       success: false,
  //       message: `Kamar yang anda inputkan tidak ada`,
  //     });
  //   } else if (userId === null) {
  //     return response.json({
  //       success: false,
  //       message: `User yang anda inputkan tidak ada`,
  //     });
  //   } else {
  //     let numberRandom = Math.floor(Math.random() * (10000000 - 99999999) + 99999999);
  
  //     let newData = {
  //       nomor_pemesanan: numberRandom,
  //       nama_pemesanan: request.body.nama_pemesanan,
  //       email_pemesanan: request.body.email_pemesanan,
  //       tgl_pemesanan: request.body.tgl_pemesanan,
  //       tgl_check_in: request.body.tgl_check_in,
  //       tgl_check_out: request.body.tgl_check_out,
  //       nama_tamu: request.body.nama_tamu,
  //       jumlah_kamar: request.body.jumlah_kamar,
  //       id_tipe_kamar: room.id_tipe_kamar,
  //       status_pemesanan: 'baru',
  //       id_user: userId.id,
  //     };
  
  //     let roomCheck = await sequelize.query(
  //       `SELECT * FROM detail_pemesanans WHERE id_kamar = "${room.id}" AND tgl_akses= "${request.body.tgl_check_in}" ;`
  //     );
  
  //     if (roomCheck[0].length === 0) {
  //       // Check if the room is available on the specified date
  //       const isRoomAvailable = await isRoomAvailableOnDate(room.id, request.body.tgl_check_in);
  
  //       if (!isRoomAvailable) {
  //         return response.json({
  //           success: false,
  //           message: `Kamar yang anda pesan sudah di booking`,
  //         });
  //       }
  
  //       // Create the pemesanan only if the room is available
  //       const result = await pemesananModel.create(newData);
  
  //       if (result) {
  //         let pemesananID = result.id;
  //         let detailsOfPemesanan = request.body.details_of_pemesanan;
  
  //         for (let i = 0; i < detailsOfPemesanan.length; i++) {
  //           detailsOfPemesanan[i].id_pemesanan = pemesananID;
  //         }
  
  //         let tgl1 = new Date(request.body.tgl_check_in);
  //         let tgl2 = new Date(request.body.tgl_check_out);
  //         let checkIn = moment(tgl1).format("YYYY-MM-DD");
  //         let checkOut = moment(tgl2).format("YYYY-MM-DD");
  
  //         // check if the dates are valid
  //         if (
  //           !moment(checkIn, "YYYY-MM-DD").isValid() ||
  //           !moment(checkOut, "YYYY-MM-DD").isValid()
  //         ) {
  //           return response
  //             .status(400)
  //             .send({ message: "Invalid date format" });
  //         }
  
  //         let success = true;
  //         let message = '';
  
  //         for (
  //           let m = moment(checkIn, "YYYY-MM-DD");
  //           m.isBefore(checkOut);
  //           m.add(1, "days")
  //         ) {
  //           let date = m.format("YYYY-MM-DD");
  //           // Hitung harga total berdasarkan harga kamar dan jumlah kamar yang dipesan
  //           let hargaTotal = detailsOfPemesanan[0].harga * request.body.jumlah_kamar;
  //           let newDetail = {
  //             id_pemesanan: pemesananID,
  //             id_kamar: room.id,
  //             tgl_akses: date,
  //             harga: hargaTotal,
  //           };
  //           const detailResult = await detailsOfPemesananModel.create(newDetail);
  
  //           if (detailResult === null) {
  //             success = false;
  //             message = 'Error creating detail pemesanan';
  //             break;
  //           }
  //         }
  
  //         if (success) {
  //           return response.json({
  //             success: true,
  //             message: `New transactions have been inserted`,
  //           });
  //         } else {
  //           return response.json({
  //             success: false,
  //             message: message,
  //           });
  //         }
  //       } else {
  //         return response.json({
  //           success: false,
  //           message: `Failed to create pemesanan`,
  //         });
  //       }
  //     } else {
  //       return response.json({
  //         success: false,
  //         message: `Kamar yang anda pesan sudah di booking`,
  //       });
  //     }
  //   }
  // };
  
  // // Function to check if a room is available on a specific date
  // async function isRoomAvailableOnDate(roomId, date) {
  //   const roomBookings = await sequelize.query(
  //     `SELECT * FROM detail_pemesanans WHERE id_kamar = "${roomId}" AND tgl_akses = "${date}";`
  //   );
  //   return roomBookings[0].length === 0;
  // }
  

  