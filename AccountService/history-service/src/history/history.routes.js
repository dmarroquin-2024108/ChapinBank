// Ruta que permite acceder al estado de cuenta
// Definir las rutas necesarias para el módulo history

import { Router } from "express";
import { getAccountStatement } from "../history.controller.js";
import { validateJWT } from "../middlewares/validate-JWT.js";
import { validateRole } from "../middlewares/validate-role.js";

const router = Router();

router.get(
    '/',
    validateJWT,
    validateRole('ADMIN_ROLE'),
    getAccountStatement
);

export default router;
