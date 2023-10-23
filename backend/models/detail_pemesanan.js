'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.pemesanan)
      this.belongsTo(models.kamar)
      // define association here
    }
  }
  detail_pemesanan.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_pemesanan: DataTypes.STRING,
    id_kamar: DataTypes.STRING,
    tgl_akses: DataTypes.DATE,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_pemesanan',
  });
  return detail_pemesanan;
};