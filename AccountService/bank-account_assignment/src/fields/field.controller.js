import User from './field.user_model.js';
import { Account, SavingsAccount, MonetaryAccount } from './field.model.js';

export const UserRegister = async (req, res, next) => {
    try {
        const { name, email, account_type, saving_goal } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email existente. Por favor, use otro email.'
            });
        }

        const newUser = new User({ name, email });
        await newUser.save();

        const numGeneratedAccount =
            Math.floor(1000000000 + Math.random() * 9000000000).toString();

        let newAccount;

        if (account_type === 'Savings') {
            newAccount = new SavingsAccount({
                user: newUser._id,
                account_number: numGeneratedAccount,
                balance: 100,
                annual_interest_rate: 0.07,
                saving_goal: saving_goal || 0
            });
        } else if (account_type === 'Monetary') {
            newAccount = new MonetaryAccount({
                user: newUser._id,
                account_number: numGeneratedAccount,
                balance: 0,
                overdraft_limit: 5000
            });
        } else {
            throw new Error('Invalid account type');
        }

        await newAccount.save();

        newUser.principal_account = newAccount._id;
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Usuario y cuenta creados exitosamente',
            applied_benefits:
                account_type === 'Savings'
                    ? '7% Rate + Opening Bonus'
                    : 'Extended Overdraft Limit',
            data: { user: newUser, account: newAccount }
        });

    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('principal_account');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('principal_account');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        ).populate('principal_account');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (user.principal_account) {
            await Account.findByIdAndDelete(user.principal_account);
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Usuario y cuenta eliminados exitosamente'
        });
    } catch (error) {
        next(error);
    }
};