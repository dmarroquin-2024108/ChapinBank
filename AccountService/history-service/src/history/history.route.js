import { Router } from "express";
import { History } from "./history.controller.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";

const router = Router();

router.get(
    '/:accountId',
    validateJWT,
    History
);

export default router;
