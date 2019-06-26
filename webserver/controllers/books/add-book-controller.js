'use strict';

const mysqlPool = require('../../../ddbb/mysql-pool');
const Joi = require('joi');

async function validateData(payload) {
    const schema = {
        title: Joi
        .string()
        .min(2)
        .max(100)
        .required(),
        author: Joi
        .string()
        .max(100)
        .required(),
        description: Joi
        .string()
        .min(2)
        .max(300),
    };
    return Joi.validate(payload, schema);
}

async function addBook(req, res) {
    const bookData = req.body;
    try {
        await validateData(bookData);
    } catch (e) {
        return res.status(400).send(e);
    }
    const { uuid } = req.claims;
    const sqlQuery = `INSERT INTO books SET ?`;
    const connection = await mysqlPool.getConnection();
    try {
        const result = await connection.query(sqlQuery, {
            title: bookData.title,
            users_uuid: uuid,
            author: bookData.author,
            description: bookData.description,
        });
        connection.release();
        return res.status(201).send(result[0]);
    }catch (e) {
        return res.status(500).send(e.message);
    }
}
module.exports = addBook;