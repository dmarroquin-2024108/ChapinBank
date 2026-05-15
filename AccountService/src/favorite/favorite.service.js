import Favorite from './favorite.model.js';
import { getAccountByNumberAccount } from '../accounts/account.service.js';
import { createTransferRecord } from '../transfers/transfer.service.js';

export const addFavoriteRecord = async ({ userId, accountNumber, alias }) => {
    // Verificar que la cuenta exista antes de guardarla
    const account = await getAccountByNumberAccount(accountNumber);

    if (account.userId === userId) {
        const e = new Error('No puedes agregar tus propias cuentas como favorito');
        e.statusCode = 400;
        throw e;
    }

    const aliasExists = await Favorite.findOne({
        userId,
        alias
    });

    if (aliasExists) {
        const e = new Error('Alias ya existente en tus favoritos');
        e.statusCode = 400;
        throw e;
    }

    const favoriteExists = await Favorite.findOne({
        userId,
        accountNumber
    });

    if (favoriteExists) {
        const e = new Error('Esta cuenta ya está agregada a favoritos');
        e.statusCode = 400;
        throw e;
    }

    const favorite = new Favorite({
        userId,
        accountNumber,
        accountType: account.accountType,
        alias,
    });
    await favorite.save();
    return favorite;
};

export const getFavoritesRecord = async (userId) => {
    return Favorite.find({userId}).sort({ alias: 1 });
};

export const getFavoriteByIdRecord = async ({ favoriteId, userId }) => {
    const favorite = await Favorite.findOne({ _id: favoriteId, userId });
    if (!favorite) {
        const e = new Error('Favorito no encontrado');
        e.statusCode = 404;
        throw e;
    }
    return favorite;
};

export const updateFavoriteRecord = async ({ favoriteId, userId, alias }) => {
    const aliasExists = await Favorite.findOne({
        userId,
        alias,
        _id: { $ne: favoriteId }
    });

    if (aliasExists) {
        const e = new Error('Ya existe otro favorito con ese alias');
        e.statusCode = 400;
        throw e;
    }
    
    const favorite = await Favorite.findOneAndUpdate(
        { _id: favoriteId, userId},
        { alias },
        { new: true, runValidators: true }
    );
    if (!favorite) {
        const e = new Error('Favorito no encontrado');
        e.statusCode = 404;
        throw e;
    }
    return favorite;
};

export const deleteFavoriteRecord = async ({ favoriteId, userId }) => {
    const favorite = await Favorite.findOneAndDelete({ _id: favoriteId, userId });
    if (!favorite) {
        const e = new Error('Favorito no encontrado');
        e.statusCode = 404;
        throw e;
    }
    return favorite;
};

export const quickTransferFromFavoriteRecord = async ({
    favoriteId,
    userId,
    token,
    transferData,
}) => {
    const favorite = await getFavoriteByIdRecord({ favoriteId, userId });
    return createTransferRecord({
        transferData: {
            ...transferData,
            numberAccountDestination: favorite.accountNumber,
            destinationHolder: transferData.destinationHolder ?? favorite.alias,
        },
        userId,
        token,
    });
};//Para las transferencias rápidas