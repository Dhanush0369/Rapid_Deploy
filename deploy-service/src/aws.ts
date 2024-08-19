import fs from "fs";
import path from "path";
import { S3 } from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
    endpoint: process.env.CF_ENDPOINT
});

export async function downloadS3Files(prefix:string){
    const allFiles = await s3.listObjectsV2({
        Bucket: "rapiddeploy",
        Prefix: prefix
    }).promise();


    const allPromises = allFiles.Contents?.map(async ({Key})=> {
        return new Promise(async (resolve) => {
            if(!Key){
                resolve("");
                return;
            }
        console.log(Key);
        const finalOutputPath = path.join(__dirname,Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, {recursive:true});
        }
        s3.getObject({
            Bucket: "rapiddeploy",
            Key
        }).createReadStream().pipe(outputFile).on("finish", () => {
            resolve("");
            })
        })
    }) || []

    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x!==undefined));
}   


export function getAllFiles(folderpath:string) {
    let response:string[] = [];
    const allfilesandfolder = fs.readdirSync(folderpath);
    allfilesandfolder.forEach((file) => {
        const fullpath = path.join(folderpath,file);
        if(fs.statSync(fullpath).isDirectory()){
            response = response.concat(getAllFiles(fullpath))
        }else{
            response.push(fullpath)
        }
    });

    return response;
}

export async function uploadFile(filename:string,filepath:string){
    const fileContent = fs.readFileSync(filepath);
    const response = await s3.upload({
        Bucket: "rapiddeploy",
        Body: fileContent,
        Key: filename
    }).promise();
    //console.log(response);
}
