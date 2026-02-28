
const IVA_RATES = {
    AHORRO:    0.12, // 12% IVA
    MONETARIA: 0.00  // sin IVA
};

/**
 * Calcula el monto final aplicando IVA según tipo de cuenta
 * @param {number} basePrice  - Precio base del producto
 * @param {string} accountType - 'AHORRO' | 'MONETARIA'
 * @returns {{ basePrice, ivaRate, ivaAmount, totalAmount }}
 */
export const calculateFinalAmount = (basePrice, accountType) => {
    const ivaRate = IVA_RATES[accountType] ?? IVA_RATES['MONETARIA'];
    const ivaAmount = parseFloat((basePrice * ivaRate).toFixed(2));
    const totalAmount = parseFloat((basePrice + ivaAmount).toFixed(2));

    return {
        basePrice,
        ivaRate,
        ivaAmount,
        totalAmount
    };
};