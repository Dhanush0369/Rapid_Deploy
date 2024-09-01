import express from "express";
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

const app = express();


dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
    endpoint: process.env.CF_ENDPOINT
});


app.get("/*", async (req,res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path;
    console.log(filePath);

    const contents = await s3.getObject({
        Bucket: "rapiddeploy",
        Key: `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
    res.set("Content-Type", type);

     res.send(contents.Body);
})

app.listen(3001);