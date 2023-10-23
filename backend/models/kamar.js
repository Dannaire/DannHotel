'use strict';
const { v4: uuidv4 } = require('uuid');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.detail_pemesanan, {
        foreignKey: `id_kamar`, as: `detail_pemesanans`
      })
      this.belongsTo(models.tipe_kamar)
    }
  }
  kamar.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nomor_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kamar',
  });
  return kamar;
};