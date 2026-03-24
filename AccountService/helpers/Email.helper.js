import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendTransferRequestEmail = async ({ toEmail, toName, fromName, amount, currency, noOperacion, transferToken, cancelWindowMinutes }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `Chapin Bank - Tienes una transferencia pendiente #${noOperacion}`,
        html: `
            <h2>Hola ${toName},</h2>
            <p><strong>${fromName}</strong> te ha enviado una transferencia por <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong>.</p>
            <p><strong>No. de operación:</strong> ${noOperacion}</p>
            <p>Para <strong>ACEPTAR o RECHAZAR</strong> la transferencia, usa el siguiente token para confirmar o rechazar la transferencia.</p>
            <p style="font-size: 14px; background: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all;">
                <strong>Token:</strong> ${transferToken}
            </p>
            <p>Este token expira en <strong>1 hora</strong>.</p>
            <p>Tener en cuenta que el emisor puede <strong>cancelar la transferencia</strong> dentro de los primeros <strong>${cancelWindowMinutes} minutos</strong>.</p>
            <p>Si no reconoces esta operación, ignora este correo.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `
    };

    await transporter.sendMail(mailOptions);
};//sendTransferRequestEmail

export const sendTransferCancelledEmail = async ({ toEmail, toName, amount, currency, noOperacion }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `Chapin Bank - Transferencia cancelada #${noOperacion}`,
        html: `
            <h2>Hola ${toName},</h2>
            <p>La transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> que le habían enviado fue <strong>cancelada por el emisor</strong>.</p>
            <p>El token que recibiste ya no es válido.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `
    };

    await transporter.sendMail(mailOptions);
};//sendTransferCancelledEmail

export const sendTransferRejectedEmail = async ({ toEmail, toName, amount, currency, noOperacion }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `Chapin Bank - Transferencia rechazada #${noOperacion}`,
        html: `
            <h2>Hola ${toName},</h2>
            <p>Su transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> fue <strong>rechazada por el destinatario</strong>.</p>
            <p>El monto ha sido reembolsado a su cuenta de origen.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `
    };

    await transporter.sendMail(mailOptions);
};//sendTransferRejectedEmail

export const sendTransferAcceptedEmail = async ({ toEmail, toName, amount, currency, noOperacion }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `Chapin Bank - Transferencia aceptada #${noOperacion}`,
        html: `
            <h2>Hola ${toName},</h2>
            <p>Su transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> fue <strong>aceptada por el destinatario</strong>.</p>
            <p>El dinero ha sido acreditado exitosamente.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `
    };

    await transporter.sendMail(mailOptions);
};//Notificar al emisor que su transferencia fue aceptada

export const sendTransferAcceptEmail = async ({ toEmail, toName, amount, currency, noOperacion }) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `Chapin Bank - Confirmación de transferencia recibida #${noOperacion}`,
        html: `
            <h2>Hola ${toName},</h2>
            <p>Has aceptado una transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong>.</p>
            <p>El monto ha sido acreditado a tu cuenta.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `
    };
    await transporter.sendMail(mailOptions);
};//Notificar al destinatario que aceptó la transferencia