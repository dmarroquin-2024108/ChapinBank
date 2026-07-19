const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendBrevoMail = async ({ to, toName, subject, html }) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: process.env.SMTP_FROM_NAME,
        email: process.env.SMTP_FROM_EMAIL,
      },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error al enviar el email: ${response.status} ${errorBody}`);
  }
};

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
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const acceptUrl = `${baseUrl}/inicio/confirmar-transferencia?token=${transferToken}&action=ACEPTAR`;
  const rejectUrl = `${baseUrl}/inicio/confirmar-transferencia?token=${transferToken}&action=RECHAZAR`;

  const html = `
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
        `;

  await sendBrevoMail({
    to: toEmail,
    toName,
    subject: `Chapin Bank - Tienes una transferencia pendiente #${noOperacion}`,
    html,
  });
}; //sendTransferRequestEmail

export const sendTransferCancelledEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
  const html = `
            <h2>Hola ${toName},</h2>
            <p>La transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> que le habían enviado fue <strong>cancelada por el emisor</strong>.</p>
            <p>El token que recibiste ya no es válido.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `;

  await sendBrevoMail({
    to: toEmail,
    toName,
    subject: `Chapin Bank - Transferencia cancelada #${noOperacion}`,
    html,
  });
}; //sendTransferCancelledEmail

export const sendTransferRejectedEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
  const html = `
            <h2>Hola ${toName},</h2>
            <p>Su transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> fue <strong>rechazada por el destinatario</strong>.</p>
            <p>El monto ha sido reembolsado a su cuenta de origen.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `;

  await sendBrevoMail({
    to: toEmail,
    toName,
    subject: `Chapin Bank - Transferencia rechazada #${noOperacion}`,
    html,
  });
}; //sendTransferRejectedEmail

export const sendTransferAcceptedEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
  const html = `
            <h2>Hola ${toName},</h2>
            <p>Su transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong> fue <strong>aceptada por el destinatario</strong>.</p>
            <p>El dinero ha sido acreditado exitosamente.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `;

  await sendBrevoMail({
    to: toEmail,
    toName,
    subject: `Chapin Bank - Transferencia aceptada #${noOperacion}`,
    html,
  });
}; //Notificar al emisor que su transferencia fue aceptada

export const sendTransferAcceptEmail = async ({
  toEmail,
  toName,
  amount,
  currency,
  noOperacion,
}) => {
  const html = `
            <h2>Hola ${toName},</h2>
            <p>Has aceptado una transferencia de <strong>${currency} ${parseFloat(amount).toFixed(2)}</strong> con No. de operación <strong>#${noOperacion}</strong>.</p>
            <p>El monto ha sido acreditado a tu cuenta.</p>
            <br/>
            <p>Equipo Chapin Bank</p>
        `;

  await sendBrevoMail({
    to: toEmail,
    toName,
    subject: `Chapin Bank - Confirmación de transferencia recibida #${noOperacion}`,
    html,
  });
}; //Notificar al destinatario que aceptó la transferencia