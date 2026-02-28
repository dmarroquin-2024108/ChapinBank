import { getNotificationByUser, markAsRead } from "./notification.service.js";

//devuelve todas las notificaciones del usuario autenticado
export const getMyNotifications = async (req, res) =>{
    try {
        const notifications = await getNotificationByUser(req.user.id);
        res.status(200).json({
            success: true,
            total: notifications.length,
            unread: notifications.filter(n => !n.read).length,
            data: notifications
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'error al obtener noti',
            error: err.message
        });
    }
};

//marca una notificación especifica como leída
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await markAsRead(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Notificación marcada como leída',
            data: notification
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};