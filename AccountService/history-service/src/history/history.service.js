import Deposit from './history.model.js';

export const getAccountHistory = async({accountId})=>{
    const history = await Deposit.find({accountId})
        .sort({createdAt:-1});

    return history;
}
