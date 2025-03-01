const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Items = sequelize.define(
    'Items',
    {
        itemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'item_id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title'
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'seller_id'
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        buyerId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'buyer_id'
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    },
    {
        tableName: 'items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
)

module.exports = Items;