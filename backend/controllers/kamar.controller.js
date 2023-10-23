const { request, response } = require("express");
const express = require("express");
const app = express();
// const sequelize = require("sequelize")

const roomModel = require(`../models/index`).kamar;
const model = require("../models/index");
const kamar= model.kamar;
const tipe_kamar = model.tipe_kamar
const detail_pemesanan = model.detail_pemesanan

const roomTypeModel = require(`../models/index`).kamar;
const tipeModel = require(`../models/index`).tipe_kamar;
const Op = require(`sequelize`).Op;
const moment = require("moment");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("ukk_hotel", "root", "", {
  host: "localhost",
  dialect: "mysql",
});



const bodyParser = require("body-parser");
// const upload2 = require("./upload-data-member");
// const uploada = require("./upload-data-member");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllRoom = async (request, response) => {
  const result = await sequelize.query(
    "SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar ORDER BY kamars.id ASC"
  );

  response.json(result[0]);
};
exports.findAvailableRooms = async (request, response) => {
  // Ambil parameter cek-in dan cek-out dari request body
  let checkin = request.body.checkin;
  let checkout = request.body.checkout;

  // Lakukan query untuk mendapatkan daftar kamar yang tersedia berdasarkan tanggal cek-in dan cek-out
  const result = await sequelize.query(
    `SELECT kamars.id, kamars.nomor_kamar, tipe_kamars.nama_tipe_kamar
    FROM kamars
    JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar
    WHERE kamars.id NOT IN (
      SELECT kamars.id
      FROM pemesanans
      WHERE tgl_check_in <= '${checkout}'
      AND tgl_check_out >= '${checkin}'
    )
    ORDER BY kamars.id ASC`
  );

  return response.json({
    success: true,
    data: result[0],
    message: `Available rooms have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findRoom = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar

  const result = await sequelize.query(
    `SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar where kamars.nomor_kamar LIKE '%${nomor_kamar}%' ORDER BY kamars.id ASC `
  );
  return response.json({
    success: true,
    data: result[0],
    message: `Room have been loaded`,
  });
};

//menambah data
exports.addRoom = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let tipeId = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
  });
  console.log(nama_tipe_kamar);
  
  const existingNomor = await roomModel.findOne({
    where: { nomor_kamar: request.body.nomor_kamar },
    attributes: { exclude: ['tipeKamarId'] }, // Specify the condition here
});

if (existingNomor) {
    return response.json({ 
        success: false,
        message: `Nomor kamar already exists`
    });
}
  let newRoom = {
    nomor_kamar: request.body.nomor_kamar,
    id_tipe_kamar: tipeId.id,
  };
  console.log(newRoom);

  roomModel
    .create(newRoom)
    .then((result) => {
      return response.json({
        success: true,
        data: result,
        message: `New Member has been inserted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//mengupdate salah satu data
exports.updateRoom = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar;
    let tipeId = await tipeModel.findOne({
      where: {
        [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
      },
    });
    console.log(nama_tipe_kamar);
  
    let newRoom = {
      nomor_kamar: request.body.nomor_kamar,
      id_tipe_kamar: tipeId.id,
    };

    let idRoom=request.params.id
  roomModel
    .update(newRoom, { where: { id: idRoom } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data room has been update`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//mengahapus salah satu data
exports.deleteRoom = (request, response) => {
  let idRoom = request.params.id;

  roomModel
    .destroy({ where: { id: idRoom } })
    .then((result) => {
      return response.json({
        success: true,
        message: `room data has ben deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};


  
exports.findRoomByFilterDate = async (req, res) => {
  const checkInDate = req.body.tgl_check_in;
  const checkOutDate = req.body.tgl_check_out;

  if (!checkInDate || !checkOutDate) {
    return res.status(200).json({
      success: false,
      message: 'Invalid input',
      data: [],
    });
  }

  try {
    // Define your raw SQL query
    const query = `
      SELECT kamar.id, kamar.nomor_kamar, tipe_kamar.foto, tipe_kamar.harga, tipe_kamar.deskripsi
      FROM kamars kamar
      LEFT JOIN detail_pemesanans dp ON kamar.id = dp.id_kamar
      LEFT JOIN tipe_kamars tipe_kamar ON kamar.id_tipe_kamar = tipe_kamar.id
      AND kamar.id NOT IN (
        SELECT DISTINCT kamar.id
        FROM pemesanans
        LEFT JOIN detail_pemesanans dp ON kamar.id = dp.id_kamar
        WHERE dp.tgl_akses BETWEEN :checkInDate AND :checkOutDate
      )
    `;

    // Execute the raw SQL query
    const [results] = await sequelize.query(query, {
      replacements: {
        checkInDate,
        checkOutDate,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      data: results,
      message: 'Available rooms have been loaded',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: [],
    });
  }
};
