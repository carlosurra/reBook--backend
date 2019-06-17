'use strict';

const bcrypt = require('bcrypt');
const Joi = require('joi');
const uuidV4 = require('uuid/v4');
const sendgridMail = require('@sendgrid/mail');
const mysqlPool = require('../../../ddbb/mysql-pool');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

async function validateSchema(payload) {
  /**
   * rellenar campos obligatorios: nombre, email, contraseña
   * nombre String con 3 caracteres mínimos y un máximo de 50
   * correo electrónico válido
   * contraseña letras mayúsculas, minúscula y número. Mínimo 3 caracteres y máximo 30, usando regular expression
   */
  const schema = {
    name: Joi.string()
    .min(3)
    .max(50)
    .required(),
    email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
    password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  };
  return Joi.validate(payload, schema);
}

/**
 * creo perfil de usuario e inserto uuid y name en tabla users
 * @param {number} uuid 
 * @return {String} name 
 */
  async function createUserProfile(uuid, name) {
    const name = name;
    const verificationCode = uuid;
    const sqlQuery = `INSERT INTO users SET ?`;
    const connection = await mysqlPool.getConnection();
    await connection.query(sqlQuery,{
      uuid: verificationCode,
      name: name
    });
    connection.release();
    return name;
  }

/**
 * creo un codigo de verificacion de usuario e inserto
 * @param {String} uuid
 * @return {String} verificationCode
 */


async function addVerificationCode (uuid){
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now
  .toISOString()
  .substring(0, 19)
  .replace('T', ' ');
  const sqlQuery = 'INSERT INTO users_activation SET ?';
  const connection = await mysqlPool.getConnection();
  await connection.query(sqlQuery, {
    users_uuid:uuid,
    verification_code: verificationCode,
    created_at: createdAt,
  });
  connection.release();
  return verificationCode;
}

/**
 * utilizo sendgrid para verificacion del email
 * @param {String} userEmail 
 * @param {String} verificationCode 
 */

async function sendEmailRegistration(userEmail, verificationCode) {
  const linkActivacion = `${
    process.env.API_BASE_URL
  }/account/activate?verification_code=${verificationCode}`;
  const msg = {
    to: userEmail,
    from: {
      email: 'rebook@yopmail.com',
      name: 'reBook',
    },
    subject: 'Welcome to reBook',
    text: 'Where books take on a new life!',
    html: `To confirm the account <a href="${linkActivacion}">activate it here</a>`,
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function createAccount(req, res, next) {
  const accountData = req.body;
  try {
    await validateSchema(accountData);
  }catch (e) {
    return res.status(400).send(e);
  }

  /**
   * inserto usuario en ddbb:
   * 3.hash de la password para almacenamiento seguro 
   */

    const now = new Date();
    const securePassword = await bcrypt.hash(accountData.password, 10);
    const uuid = uuidV4();
    const connection = await mysqlPool.getConnection();
    const sqlInsercion = `INSERT INTO users SET ?`;
    try {
      const result = await connection.query(sqlInsercion, {
        uuid: uuid,
        email: accountData.email,
        password: securePassword,
      });
      connection.release();
      const verificationCode = await addVerificationCode(uuid);
      await sendEmailRegistration(accountData.email, verificationCode);
      await createUserProfile(uuid, accountData.name);
      return res.status(201).send();
      } catch (e) {
        if(connection){
          connection.release();
        }
        return res.status(500).send(e.message);
      }
    }
    module.exports = createAccount;




  











  
  
