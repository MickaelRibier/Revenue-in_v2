import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../data/sequelize.js';

class User extends Model { }

User.init(
    {
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user', // 'admin' for Laetitia
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export { User };
