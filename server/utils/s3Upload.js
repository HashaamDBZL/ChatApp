const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadToS3 = (file) => {
  return new Promise((resolve, reject) => {
    const fileExt = path.extname(file.originalname);
    const key = `uploads/${uuidv4()}${fileExt}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Location); // Return the file URL
    });
  });
};

module.exports = uploadToS3;
