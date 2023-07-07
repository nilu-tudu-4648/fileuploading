// require('./db');
require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-west-2' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const multer = require('multer')

const multerConfig = multer({
    storage: multer.memoryStorage(),
    // limits: {
    //     fileSize: 200000
    // }
})

const upload = multer(multerConfig)

var uploadParams = {
    Bucket: 'nilesh-15-bucket',
    Key: '',
    Body: '',
    ACL: 'public-read',
    ContentEncoding: '',
    ContentType: '',
};
// upload user images

app.post('/uploadimg', upload.array('img'), async (req, res) => {
    try {
        const { originalname, buffer, encoding, mimetype } = req.files[0]
        s3.upload({
            ...uploadParams,
            Key: originalname,
            Body: buffer,
            ContentEncoding: encoding,
            ContentType: mimetype,
        }, (err, data) => {
            if (err) return res.status(400).json({ error: err })
            if (data) return res.status(200).json({ img: data })
        })

    } catch (err) {
        console.log(err.error)
        console.log(err.message)
        return res.status(400).json({ err: err.message })
    }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`server running on ${PORT}`));
