import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../data/sequelize.js';

class Testimonial extends Model { }

Testimonial.init(
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authorTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'testimonials',
        timestamps: false,
    }
);

export { Testimonial };
