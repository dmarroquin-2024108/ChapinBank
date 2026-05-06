export const errorMessage = (err, defaultMessage) => {
    return Object.values(err.response?.data?.errors || {})[0]?.[0]
        || e.response?.data?.message
        || defaultMessage;
};