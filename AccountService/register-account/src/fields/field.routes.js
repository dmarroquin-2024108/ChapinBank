import { Router} from 'express';
import{ createField} from './field.controller.js'
import{ validateCreateField} from '../../middlewares/field-validator.js'
import{ uploadFieldImage} from '../../middlewares/file-uploader.js'
import{ cleanupUploadedFileOnFinish} from '../../middlewares/delete-file-on-error.js'

const router = Router();

router.post(
    '/',
    uploadFieldImage.single('image'),
    cleanupUploadedFileOnFinish,
    validateCreateField,
    createField
);

export default router;

