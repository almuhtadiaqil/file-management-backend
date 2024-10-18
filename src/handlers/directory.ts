import { Request, Response } from 'express';
import { DirectoryRepository } from "../repositories/directory";
import { mapErrorResponse, mapSuccessResponse } from "../utils/mapper/response";
import { promises as fs } from 'fs';
import path from "path";
import { exec } from "child_process";
import { Directory } from '../entities/Directory';



const directoryRepo = new DirectoryRepository()

export const getDirectories = async (req: Request, res: Response) => {
    try {
        const { name, path } = req.query
        let directories: Directory[]
        let subDirectories: Directory[] | [] = []
        
        if(!path){
            res.status(400).json(mapErrorResponse(400, "path is required!"))
        }
        directories = await directoryRepo.findByPath(path?.toString())
        if (name) {
            let parentPath = path?.toString() + `/${name}`
            subDirectories = await directoryRepo.findByParentNameAndPath(name?.toString(), parentPath)
        }
        res.status(200).json(mapSuccessResponse(200, {"directories":directories,"sub_directories":subDirectories}))
    } catch (error) {
        res.status(500).json(mapErrorResponse(500, error))
    }
}

export const addDirectory = async (req: Request, res: Response) => {
    try {
        const { name, parent_name, parentPath } = req.body

        if (name == "" || name == null) {
            res.status(400).json(mapErrorResponse(400, "Name is required!"))
            return
        }

        const checkDirectory = await directoryRepo.findByNameAndParentPath(name,parentPath)
        if (checkDirectory != null) {
            res.status(400).json(mapErrorResponse(400, "Directory is already exists!"))
            return
        }

        let dirPath = path.join('public', 'dynamic', name)
        if (parent_name) {
            dirPath = path.join(parentPath, name)
        }

        exec(`mkdir ${dirPath}`, async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                res.status(500).json(mapErrorResponse(500, error))
                return
            }

            if (stderr) {
                console.log(`stderr: ${stderr}`)
                res.status(500).json(mapErrorResponse(500, (stderr)))
                return
            }

            console.log(`stdout: ${stdout}`)

            const directory = await directoryRepo.createFolder(name, parentPath, true, parent_name)

            res.status(201).json(mapSuccessResponse(201, directory))

        })
    } catch (error) {
        res.status(500).json(mapErrorResponse(500, error))
    }
}

export const deleteDirectory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await directoryRepo.deleteFolder(id)
        res.status(200).json(mapSuccessResponse(200, null))
    } catch (error) {
        res.status(500).json(mapErrorResponse(500, error))
    }
}



export const getFoldersInDirectory = async (directoryPath: string) => {
    try {
        const files = await fs.readdir(directoryPath, { withFileTypes: true });

        for(let i=0; i< files.length; i++){
            if (files[i].parentPath.includes("\\")) {
                files[i].parentPath = files[i].parentPath.replace("\\","/")
            }
            const checkDirectory = await directoryRepo.findByNameAndParentPath(files[i].name, files[i].parentPath)
            if (checkDirectory != null) {
                continue;
            }
            const directory = await directoryRepo.createFolder(files[i].name, files[i].parentPath, files[i].isDirectory(), 'static')
            console.log(`created directory ${directory.name} ${directory.parent_name}`)
            
            if (files[i].isDirectory()) {
                const subFiles = await fs.readdir(`public/static/${files[i].name}`, { withFileTypes: true })
                for (let j = 0; j < subFiles.length; j++) {                    
                    const checkDirectory = await directoryRepo.findByNameAndParentPath(subFiles[i].name, subFiles[i].parentPath)
                    if (checkDirectory != null) {
                        continue
                    }
                    const directory = await directoryRepo.createFolder(subFiles[i].name, subFiles[i].parentPath, subFiles[i].isDirectory(), files[i].name)
                    console.log(`created sub directory ${directory.name} ${directory.parent_name}`)
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory: ${error}`);
        throw error;
    }
}
