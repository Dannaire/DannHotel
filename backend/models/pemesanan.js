'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail_pemesanan, {
        foreignKey: `id_pemesanan`, as: `detail_pemesanan`
      })
      this.belongsTo(models.user)
      this.belongsTo(models.tipe_kamar)
    }
  }
  pemesanan.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nomor_pemesanan: DataTypes.INTEGER,
    nama_pemesanan: DataTypes.STRING,
    email_pemesanan: DataTypes.STRING,
    tgl_pemesanan: DataTypes.DATE,
    tgl_check_in: DataTypes.DATE,
    tgl_check_out: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.STRING,
    status_pemesanan: DataTypes.ENUM('baru', 'check_in', 'check_out'),
    id_user: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pemesanan',
  });
  return pemesanan;
};