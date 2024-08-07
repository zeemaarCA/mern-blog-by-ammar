import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import { create, getproducts, uploadImage, deleteproduct, updateproduct } from '../controllers/product.controller.js';
import multer from 'multer';


const router = express.Router();

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'client/src/assets/img');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage });


router.post('/create', verifyToken, create);
// router.post('/upload-image', verifyToken, upload.single('file'), uploadImage);
router.get('/getproducts', getproducts);
router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteproduct);
router.put('/updateproduct/:productId/:userId', verifyToken, updateproduct);



export default router