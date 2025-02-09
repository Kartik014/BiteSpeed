import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface contactAttributes {
    id: number,
    phoneNumber?: String,
    email?: String,
    linkedId?: number,
    linkPrecedence: "primary" | "secondary",
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}

class Contact extends Model<contactAttributes> implements contactAttributes {
    public id!: number;
    public phoneNumber?: String;
    public email?: String;
    public linkedId?: number;
    public linkPrecedence!: "primary" | "secondary";
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt?: Date;
}

Contact.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkPrecedence: {
            type: DataTypes.ENUM("primary", "secondary"),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "contacts",
        timestamps: true,
        paranoid: true,
    }
);

export default Contact;