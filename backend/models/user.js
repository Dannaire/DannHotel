  'use strict';
  const { Model } = require('sequelize');
  const { v4: uuidv4 } = require('uuid');

  module.exports = (sequelize, DataTypes) => {
    class user extends Model {
      static associate(models) {
        this.hasMany(models.pemesanan, {
          foreignKey: `id_user`,
          as: `pemesanan`
        });
      }
    }
    user.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nama_user: DataTypes.STRING,
      foto: DataTypes.TEXT,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      role: DataTypes.ENUM('admin', 'resepsionis', 'tamu')
    }, {
      sequelize,
      modelName: 'user',
    });
    return user;
  };
