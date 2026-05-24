import { getAccountHistory, getBankHistory, getAccountsByMovements } from './history.service.js';
import History from './history.model.js';
import { getAccountByNumberAccount } from '../accounts/account.service.js';

const ADMIN_ROLES = new Set(['ADMIN_ROLE', 'SUPERADMIN_ROLE']);

export const accountHistory = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;

    if (!ADMIN_ROLES.has(req.user.role)) {
      const account = await getAccountByNumberAccount(accountNumber);

      if (account.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para consultar el historial de esta cuenta',
        });
      }
    }

    const history = await getAccountHistory({
      accountNumber,
    });

    res.status(200).json({
      success: true,
      message: 'Historial de cuenta obtenido',
      total: history.length,
      data: history,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: 'Error al obtener historial de cuenta',
      error: err.message,
    });
  }
}; //Historial de cuenta

export const bankHistory = async (req, res) => {
  try {
    const history = await getBankHistory();

    res.status(200).json({
      success: true,
      message: 'Historial del banco obtenido (últimos 20 movimientos)',
      total: history.length,
      data: history,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial bancario',
      error: e.message,
    });
  }
}; //historial del banco

export const createHistoryInternal = async (req, res) => {
  const movement = await History.create(req.body);
  res.status(201).json({
    success: true,
    data: movement,
  });
};

export const accountsByMovements = async (req, res) => {
  try {
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const result = await getAccountsByMovements(order);

    res.status(200).json({
      success: true,
      message: 'Cuentas ordenadas por movimientos',
      total: result.length,
      data: result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cuentas por movimientos',
      error: e.message,
    });
  }
}; //Cuentas con más movimientos

export const userRecentMovements = async (req, res) => {
  try {
    const { getUserRecentMovements } = await import('./history.service.js');
    const history = await getUserRecentMovements(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Ultimos movimientos del usuario',
      total: history.length,
      data: history,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Error al obtener movimientos recientes',
        error: err.message,
      });
  }
};

export const accountHistoryByType = async (req, res) => {
  try {
    const { getAccountHistoryByType } = await import('./history.service.js');
    const { accountNumber, accountType, limit } = req.query;
    const history = await getAccountHistoryByType({ accountNumber, accountType, limit });
    res.status(200).json({
      success: true,
      message: 'Historial por cuenta obtenido',
      total: history.length,
      data: history,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error al filtrar historial', error: err.message });
  }
};
