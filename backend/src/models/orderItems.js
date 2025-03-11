const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const OrderItems = sequelize.define(
    "OrderItems",
    {
        orderItemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'order_item_id'
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'order_id'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'item_id'
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'order_items'
    }

);

module.exports = OrderItems;