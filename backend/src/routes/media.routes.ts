import { Router } from 'express';
import { mediaController } from '../controllers/media.controller.js';
import { uploadSingleImage, uploadMultipleImages } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @openapi
 * /upload/image:
 *   post:
 *     summary: Upload a single image to Cloudinary
 *     tags: [Media & Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 example: travelos/customers/profile
 *               oldPublicId:
 *                 type: string
 *                 example: travelos/customers/profile/sample_id
 *     responses:
 *       201:
 *         description: Image uploaded and optimized in Cloudinary
 */
router.post('/image', uploadSingleImage('image'), mediaController.uploadImage);
router.post('/upload', uploadSingleImage('image'), mediaController.uploadImage);

/**
 * @openapi
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple images to Cloudinary
 *     tags: [Media & Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 example: travelos/trips/gallery
 *     responses:
 *       201:
 *         description: Images uploaded and optimized in Cloudinary
 */
router.post('/multiple', uploadMultipleImages('images', 10), mediaController.uploadMultiple);
router.post('/upload-multiple', uploadMultipleImages('images', 10), mediaController.uploadMultiple);

/**
 * @openapi
 * /upload/delete:
 *   post:
 *     summary: Delete an image from Cloudinary
 *     tags: [Media & Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [publicId]
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: travelos/customers/profile/user_123
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.post('/delete', mediaController.deleteImage);
router.delete('/:publicId(*)', mediaController.deleteImage);

export default router;
