export const formatAmount = (amount) =>
  new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2 }).format(Math.abs(amount));

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

export const formatBalance = (amount) =>
  amount != null
    ? `Q ${new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2 }).format(amount)}`
    : '—';
