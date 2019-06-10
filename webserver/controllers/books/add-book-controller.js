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
        author_name: Joi
        .string()
        .max(100)
        .required(),
        author_surname: Joi
        .string()
        .max(100)
        .required(),
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

    try {
        const result = await connection.query(sqlQuery, {
            title: bookData.title,
            owner_uuid: uuid,
            author_name: author_name,
            author_surname: author_surname,
            available
        });
        connection.release();
        return res.status(201).send(result[0]);
    }catch (e) {
        return res.status(500).send(e.message);
    }
}
module.exports = addBook;