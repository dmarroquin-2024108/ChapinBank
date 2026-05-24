import {
  createAccountRecord,
  getAccountsRecord,
  getAccountById,
  updateAccountRecord,
  getAccountByNumberAccount,
  updateAccountBalanceInternal,
  getAccountsSummary,
  getAllAccountsRecord,
  toggleAccountStatusRecord,
} from './account.service.js';
import { notifyAccountStatusChanged } from '../notifications/notification.service.js';
import { authServiceClient } from '../../configs/axios.configuration.js';

const formatBalance = (account) => ({
  ...account.toObject(),
  balance: account.balance.toFixed(2),
});

export const createAccount = async (req, res) => {
  try {
    const account = await createAccountRecord({
      accountType: req.body.accountType,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Cuenta resgitrada exitosamente',
      data: formatBalance(account),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al crear la cuenta',
      error: e.message,
    });
  } //try-catch
}; //createAccount

export const getAccounts = async (req, res) => {
  try {
    const accounts = await getAccountsRecord(req.user.id);
    res.status(200).json({
      success: true,
      total: accounts.length,
      data: accounts.map(formatBalance),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al obtener las cuentas',
      error: e.message,
    });
  } //try-catcha
}; //getAccounts

export const getAccountId = async (req, res) => {
  try {
    const account = await getAccountById({
      accountNumber: req.params.accountNumber,
      userId: req.user.id,
    });
    res.status(200).json({
      success: true,
      data: formatBalance(account),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al obtener las cuentas',
      error: e.message,
    });
  }
};

export const getAccountInternal = async (req, res) => {
  try {
    const account = await getAccountByNumberAccount(req.params.accountNumber);
    res.status(200).json({
      success: true,
      data: formatBalance(account),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al obtener la cuenta',
      error: e.message,
    });
  }
}; //getAccountInternal

export const updateAccount = async (req, res) => {
  try {
    const account = await updateAccountRecord({
      accountNumber: req.params.accountNumber,
      userId: req.user.id,
      data: req.body,
    });
    res.status(200).json({
      success: true,
      message: 'Cuenta actualizada exitosamente',
      data: formatBalance(account),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al actualizar campos',
      error: e.message,
    });
  }
};

export const updateAccountInternal = async (req, res) => {
  try {
    const account = await updateAccountBalanceInternal(req.params.accountNumber, req.body.balance);
    res.status(200).json({
      success: true,
      data: formatBalance(account),
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al actualizar cuenta',
      error: e.message,
    });
  }
};

export const getAccountsSummaryAdmin = async (req, res) => {
  try {
    const summary = await getAccountsSummary();
    res.status(200).json({
      success: true,
      message: 'Resumen de cuentas obtenido',
      data: summary,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al obtener resumen de cuentas',
      error: e.message,
    });
  }
};

export const getAllAccountsAdmin = async (req, res) => {
  try {
    const [accounts, usersResponse] = await Promise.all([
      getAllAccountsRecord(),
      authServiceClient.get('/api/v1/auth/admin/users', {
        headers: { Authorization: req.headers.authorization },
      }),
    ]);

    const usersMap = Object.fromEntries(
      (usersResponse.data?.data ?? []).map((u) => [u.idUserResponse, u])
    );
    const enriched = accounts.map((acc) => {
      const owner = usersMap[acc.userId] ?? {};
      return {
        ...acc.toObject(),
        balance: Number(acc.balance).toFixed(2),
        ownerName: owner.name && owner.surname ? `${owner.name} ${owner.surname}` : '—',
        ownerUsername: owner.username ?? null,
        ownerEmail: owner.email ?? null,
      };
    });
    res.status(200).json({ success: true, total: enriched.length, data: enriched });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: 'Error al obtener las cuentas',
      error: e.message,
    });
  }
};

export const toggleAccountStatusAdmin = async (req, res) => {
  const { accountNumber } = req.params;
  const { status } = req.body;
  if (typeof status !== 'boolean') {
    return res
      .status(400)
      .json({ success: false, message: 'El campo status debe ser un booleano' });
  }
  try {
    const account = await toggleAccountStatusRecord(accountNumber, status);
    notifyAccountStatusChanged({
      userId: account.userId,
      accountNumber,
      status,
    }).catch((err) => console.error('[notify] Error al notificar estado de cuenta:', err.message));
    res.status(200).json({
      success: true,
      message: `Cuenta ${status ? 'habilitada' : 'inhabilitada'} correctamente`,
      data: formatBalance(account),
    });
  } catch (e) {
    res
      .status(e.statusCode || 500)
      .json({ success: false, message: 'Error al cambiar el estado', error: e.message });
  }
};
