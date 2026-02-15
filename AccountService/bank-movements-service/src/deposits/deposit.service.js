import Deposit from './deposit.model.js';

export const createDepositRecord = async({depositData})=>{
    const data = {...depositData}
    const deposit = new Deposit(data);
    await deposit.save();
    return deposit;
}