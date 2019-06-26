'use strict';

const cloudinary = require('cloudinary');
const mysqlPool = require("../../../ddbb/mysql-pool");

cloudinary.config({
  cloud_name: process.env.CLOUDINARI_CLOUD_NAME,
  api_key: process.env.CLOUDINARI_API_KEY,
  api_secret: process.env.CLOUDINARI_API_SECRET,
});

async function uploadCover(req, res, next) {
  const { file } = req;
  const { uuid } = req.claims;

  if (!file || !file.buffer) {
    return res.status(400).send();
  }

  cloudinary.v2.uploader.upload_stream({
    resource_type: 'raw',
    public_id: uuid,
    width: 200,
    height: 200,
    format: 'jpg',
    crop: 'limit',
  }, async(err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    const {
      etag,
      secure_url: secureUrl,
    } = result;
    
    const sqlUpdate = `UPDATE books SET ? WHERE users_uuid = '${uuid}';`;
    const connection = await mysqlPool.getConnection();
        try {
          const result = await connection.query(sqlUpdate, {
            avatarUrl: secureUrl
          });
          connection.release();
        } catch (e) {
          return res.status(500).send(e.message);
        }
        res.header("Location", secureUrl);
        res.status(201).send();
      }
    ).end(file.buffer);
}
module.exports = uploadCover;
