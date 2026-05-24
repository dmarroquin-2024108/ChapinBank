import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendTransferRequestEmail = async ({
  toEmail,
  toName,
  fromName,
  amount,
  currency,
  noOperacion,
  transferToken,
  cancelWindowMinutes,
}) => {
  const transporter = createTransporter();

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const acceptUrl = `${baseUrl}/inicio/confirmar-transferencia?token=${transferToken}&action=ACEPTAR`;
  const rejectUrl = `${baseUrl}/inicio/confirmar-transferencia?token=${transferToken}&action=RECHAZAR`;

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: toEmail,
    subject: `Chapin Bank - Tienes una transferencia pendiente #${noOperacion}`,
    html: `
            <h2>Hola ${toName},</h2>
            <p><strong>${fromName}</strong> te ha enviado una transferencia por <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong>.</p>
            <p><strong>No. de operación:</strong> ${noOperacion}</p>
            <p>Tener en cuenta que el emisor puede <strong>cancelar la transferencia</strong> dentro de los primeros <strong>${cancelWindowMinutes} minutos</strong>.</p>
            <div style="margin: 24px 0;">
                <a href="${acceptUrl}"
                   style="display: inline-block; padding: 12px 28px; background-color: #F28C00; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin-right: 12px;">
                    Aceptar transferencia
                </a>
                <a href="${rejectUrl}"
                   style="display: inline-block; padding: 12px 28px; background-color: #032340; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    Rechazar transferencia
                </a>
            </div>
            <p>Si no reconoces esta operación, ignora este correo.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `,
  };

  await transporter.sendMail(mailOptions);
}; //sendTransferRequestEmail

export const sendTransferCancelledEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
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
        `,
  };

  await transporter.sendMail(mailOptions);
}; //sendTransferCancelledEmail

export const sendTransferRejectedEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
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
        `,
  };

  await transporter.sendMail(mailOptions);
}; //sendTransferRejectedEmail

export const sendTransferAcceptedEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
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
        `,
  };

  await transporter.sendMail(mailOptions);
}; //Notificar al emisor que su transferencia fue aceptada

export const sendTransferAcceptEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
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
        `,
  };
  await transporter.sendMail(mailOptions);
}; //Notificar al destinatario que aceptó la transferencia
