import fs from "fs";
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
    endpoint: process.env.CF_ENDPOINT
});

//filename output/ncdp6/src/index.css
//filepath /home/dhanush/Documents/cv_projects/RapidDeploy/dist/output/ncdp6/src/index.css
export async function upload(filename:string, filePath:string){
    const fileContent = fs.readFileSync(filePath);
    const response = await s3.upload({
        Body:fileContent,
        Bucket: "rapiddeploy",
        Key: filename,
    }).promise();
    console.log(response);
}