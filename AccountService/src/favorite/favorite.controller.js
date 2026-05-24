import {
  addFavoriteRecord,
  getFavoritesRecord,
  getFavoriteByIdRecord,
  updateFavoriteRecord,
  deleteFavoriteRecord,
} from './favorite.service.js';

export const addFavorite = async (req, res) => {
  try {
    const favorite = await addFavoriteRecord({
      userId: req.user.id,
      accountNumber: req.body.accountNumber,
      alias: req.body.alias,
    });
    res.status(201).json({
      success: true,
      message: 'Cuenta agregada a favoritos',
      data: favorite,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await getFavoritesRecord(req.user.id);
    res.status(200).json({
      success: true,
      total: favorites.length,
      data: favorites,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
};

export const getFavoriteById = async (req, res) => {
  try {
    const favorite = await getFavoriteByIdRecord({
      favoriteId: req.params.id,
      userId: req.user.id,
    });
    res.status(200).json({
      success: true,
      data: favorite,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const favorite = await updateFavoriteRecord({
      favoriteId: req.params.id,
      userId: req.user.id,
      alias: req.body.alias,
    });
    res.status(200).json({
      success: true,
      message: 'Favorito actualizado',
      data: favorite,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    await deleteFavoriteRecord({
      favoriteId: req.params.id,
      userId: req.user.id,
    });
    res.status(200).json({
      success: true,
      message: 'Favorito eliminado',
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
};
