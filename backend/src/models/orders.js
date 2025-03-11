const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Orders = sequelize.define(
    "Orders",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'order_id'
        },
        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'buyer_id'
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'total_amount'
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'order_date'
        }
    },
    {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        hooks: {
            beforeCreate(order) {
                order.orderDate = new Date();
            }
        }
    }
)

module.exports = Orders;