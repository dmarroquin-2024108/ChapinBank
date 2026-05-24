export const validateActiveAccount = (account, type = 'cuenta') => {
  if (!account) {
    const error = new Error(`${type} no encontrada`);
    error.statusCode = 404;
    throw error;
  }

  if (!account.status) {
    const error = new Error(
      `La ${type} se encuentra deshabilitada. Debe solicitar al banco su reactivación.`
    );
    error.statusCode = 403;
    throw error;
  }
};
