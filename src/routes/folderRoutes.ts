import { Router } from "express";
import { 
    addDirectory, 
    deleteDirectory, 
    getDirectories 
} from "../handlers/directory";

const router = Router()

router.get("/", getDirectories)
router.post("/", addDirectory)
router.delete("/:id",deleteDirectory)



// router.get("/test",async (req,res) => {
//     const {dir} = req.query
//     const directoryPath = path.join('public', 'static', dir? dir.toString():"");
//     const folders = await getFoldersInDirectory(directoryPath);
//     console.log(folders);
//     res.json(folders)
// })


export default router