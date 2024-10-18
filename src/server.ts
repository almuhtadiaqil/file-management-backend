import 'reflect-metadata'
import express from 'express'
import { AppDataSource } from "./data-source"
import folderRoutes from './routes/folderRoutes';
import cors from 'cors'
import path from 'path'
import { getFoldersInDirectory } from './handlers/directory';

const app = express()
app.use(cors())
app.use(express.json())

AppDataSource.initialize()
    .then(
        async () => {
            app.use("/folders", folderRoutes)
            const directoryPath = path.join('public', 'static');
            await getFoldersInDirectory(directoryPath);

            const PORT = process.env.PORT || 5000
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`)
            })
        })
    .catch(error => console.log(error))