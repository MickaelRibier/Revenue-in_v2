// const { DataTypes, Model } = require('sequelize');
import { DataTypes, Model } from 'sequelize';
// const sequelize = require('../data/sequelize');
import { sequelize } from '../data/sequelize.js';

class Contact extends Model { }
Contact.init(
  {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'contact',
    timestamps: false,
  }
);

export { Contact };
// module.exports = Contact;
