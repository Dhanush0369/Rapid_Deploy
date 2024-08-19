import express from "express";
import {S3} from "aws-sdk";

const app = express();
const s3 = new S3({
    accessKeyId: "28cc04cc25ebf7a76e0000811f95e8b4",
    secretAccessKey: "e91032aa213842333833351700bba1c30e490af87605dc97af78d7e889415929",
    endpoint: "https://4d1ec783bad1c616696abe541ec3e06c.r2.cloudflarestorage.com"
})


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