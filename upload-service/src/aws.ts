import {S3} from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "28cc04cc25ebf7a76e0000811f95e8b4",
    secretAccessKey: "e91032aa213842333833351700bba1c30e490af87605dc97af78d7e889415929",
    endpoint: "https://4d1ec783bad1c616696abe541ec3e06c.r2.cloudflarestorage.com"
})

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