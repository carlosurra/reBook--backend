"use strict";

const cloudinary = require("cloudinary");
const mysqlPool = require("../../../databases/mysql-pool");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAvatar(req, res, next) {
  const { file } = req;
  const { uuid } = req.claims;
  if (!file || !file.buffer) {
    return res.status(400).send();
  }

  cloudinary.v2.uploader
    .upload_stream(
      {
        resource_type: "raw",
        public_id: uuid,
        width: 100,
        height: 100,
        format: "jpg",
        crop: "limit"
      },

      async (err, result) => {
        if (err) {
          return res.status(400).send(err);
        }

        const { etag, secure_url: secureUrl } = result;
        const sqlUpdate = `UPDATE users SET ? WHERE uuid = '${uuid}';`;
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
      }).end(file.buffer);
}
module.exports = uploadAvatar;