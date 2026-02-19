import { Schema, model } from "mongoose";

const options = { discriminatorKey: 'account_type', collection: 'accounts' };

const AccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account_number: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    opening_date: { type: Date, default: Date.now }
}, options);

const Account = model('Account', AccountSchema);

const SavingsAccount = Account.discriminator('Savings',
    new Schema({
        annual_interest_rate: { type: Number, default: 0.05 },
        saving_goal: { type: Number, default: 0 }
    })
);

const MonetaryAccount = Account.discriminator('Monetary',
    new Schema({
        overdraft_limit: { type: Number, default: 1000 },
        has_checkbook: { type: Boolean, default: true }
    })
);

export { Account, SavingsAccount, MonetaryAccount };