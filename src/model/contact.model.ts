import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

export interface contactAttributes {
    id: number,
    phonenumber?: String,
    email?: String,
    linkedid?: number | null,
    linkprecedence: "primary" | "secondary",
    createdat: Date,
    updatedat: Date,
    deletedat?: Date | null,
}

class Contact extends Model<contactAttributes> implements contactAttributes {
    public id!: number;
    public phonenumber?: String;
    public email?: String;
    public linkedid?: number;
    public linkprecedence!: "primary" | "secondary";
    public createdat!: Date;
    public updatedat!: Date;
    public deletedat?: Date;
}

Contact.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        linkedid: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkprecedence: {
            type: DataTypes.ENUM("primary", "secondary"),
            allowNull: false,
        },
        createdat: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "createdat",
        },
        updatedat: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "updatedat",
        },
        deletedat: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "deletedat",
        },
    },
    {
        sequelize,
        modelName: 'Contact',
        tableName: 'contacts',
        timestamps: true,
        paranoid: true,
        createdAt: "createdat",
        updatedAt: "updatedat",
        deletedAt: "deletedat"
    }
);

export default Contact;