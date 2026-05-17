import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';
import Account from '../src/accounts/account.model.js';

export const validateAccountHistory = [
  param('accountNumber').notEmpty().withMessage('El número de cuenta es requerido').trim(),
  checkValidators,
];

//Aqui vamos a verificar que solo el dueño de la cuenta pueda ver su respectiva cuenta
//Poniendo en excepción a los administradores, quienes podrán ver todas las cuentas
export const validateAccountOwnership = async (req, res, next) => {
  try {
    const { role, id: userId } = req.user; 

    if (role === 'ADMIN_ROLE' || role === 'SUPERADMIN_ROLE') {
      return next();
    }

    const { accountNumber } = req.params;

    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Cuenta no encontrada',
        error: 'ACCOUNT_NOT_FOUND',
      });
    }

    if (account.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver el historial de esta cuenta',
        error: 'FORBIDDEN',
      });
    }

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar propiedad de la cuenta',
      error: err.message,
    });
  }
};


