import History from './history.model.js';

export const getAccountHistory = async ({ accountNumber }) => {
  const history = await History.find({
    $or: [
      { accountNumber: accountNumber },
      { numberAccountOrigin: accountNumber },
      { numberAccountDestination: accountNumber },
    ],
  }).sort({ createdAt: -1 });
  return history.map(formatMovement);
}; //Busqueda en una cuenta en especifico

export const getBankHistory = async ({ page = 1, limit = 20 } = {}) => {
  const history = await History.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  return history.map(formatMovement);
}; //Todo el banco

export const getAccountsByMovements = async (order) => {
  const sortOrder = order === 'asc' ? 1 : -1;
  return await History.aggregate([
    {
      $project: {
        movementAccounts: {
          $filter: {
            input: {
              $setUnion: [
                ['$accountNumber', '$numberAccountOrigin', '$numberAccountDestination'],
                [],
              ],
            },
            as: 'account',
            cond: {
              $and: [{ $ne: ['$$account', null] }, { $ne: ['$$account', ''] }],
            },
          },
        },
      },
    },
    { $unwind: '$movementAccounts' },
    {
      $group: {
        _id: '$movementAccounts',
        totalMovements: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        accountNumber: '$_id',
        totalMovements: 1,
      },
    },
    { $sort: { totalMovements: sortOrder } },
  ]);
}; //Cuentas ordenadas por movimientos

const formatMovement = (doc) => {
  switch (doc.type) {
    case 'DEPOSIT':
      return formatDeposit(doc);

    case 'TRANSFER':
      return formatTransfer(doc);

    case 'TRANSACTION':
      return formatTransaction(doc);

    default:
      return { type: doc.type, amount: doc.amount, date: doc.createdAt };
  }
}; //Definir que tipo de movimiento se quiere en el historial

const formatDeposit = (doc) => ({
  id: doc._id,
  type: doc.type,
  accountNumber: doc.accountNumber,
  amount: doc.amount.toFixed(2),
  currency: doc.currency,
  depositMethod: doc.depositMethod,
  description: doc.description ?? 'Sin descripción',
  date: doc.createdAt,
});

const formatTransfer = (doc) => ({
  id: doc._id,
  type: doc.type,
  noOperacion: doc.noOperacion,
  amount: doc.amount.toFixed(2),
  currency: doc.currency,
  numberAccountOrigin: doc.numberAccountOrigin,
  numberAccountDestination: doc.numberAccountDestination,
  accountNumber: doc.accountNumber,
  commision: doc.commision,
  status: doc.status,
  description: doc.description ?? 'Sin descripción',
  date: doc.createdAt,
});

const formatTransaction = (doc) => ({
  id: doc._id,
  type: doc.type,
  productId: doc.productId,
  amount: doc.amount,
  accountNumber: doc.accountNumber,
  status: doc.status,
  date: doc.createdAt
});
