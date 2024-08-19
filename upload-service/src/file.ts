import fs from "fs";
import path from "path";

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