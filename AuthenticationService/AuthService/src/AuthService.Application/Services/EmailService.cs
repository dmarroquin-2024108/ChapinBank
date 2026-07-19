using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using AuthService.Application.Interfaces;

namespace AuthService.Application.Services;

public class EmailService(HttpClient httpClient, IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{


    public async Task SendAdminCreatedUserEmailAsync(string email, string username, string tempPassword, string verificationToken)
    {
        var subject = "Tu cuenta ha sido creada por el administrador";

        var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={verificationToken}";

        var body = $@"
        <h2>Hola {username},</h2>
        <p>Tu cuenta ha sido creada por el administrador.</p>
        <p><strong>Usuario:</strong> {username}</p>
        <p><strong>Contraseña temporal:</strong> {tempPassword}</p>
        <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <a href='{verificationUrl}' style='background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
            Activar Cuenta
        </a>
        <p>Si no puedes hacer clic, copia y pega esta URL en tu navegador:</p>
        <p>{verificationUrl}</p>
        <p>Recuerda que al iniciar sesión deberás cambiar tu contraseña.</p>
    ";

        await SendEmailAsync(email, subject, body);
    }
    public async Task SendEmailVerificationAsync(string email, string username, string token)
    {
        var subject = "Verifica tu dirección de correo electrónico";
        var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}";

        var body = $@"
            <h2>¡Bienvenido {username}!</h2>
            <p>Por favor, verifica tu dirección de correo electrónico haciendo clic en el enlace a continuación:</p>
            <a href='{verificationUrl}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                Verificar Correo Electrónico
            </a>
            <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
            <p>{verificationUrl}</p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no creaste una cuenta, por favor ignora este correo.</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetAsync(string email, string username, string token)
    {
        var subject = "Restablece tu contraseña";
        var resetUrl = $"{configuration["AppSettings:FrontendUrl"]}/reset-password?token={token}";

        var body = $@"
            <h2>Solicitud de Restablecimiento de Contraseña</h2>
            <p>Hola {username},</p>
            <p>Solicitaste restablecer tu contraseña. Haz clic en el enlace a continuación para restablecerla:</p>
            <a href='{resetUrl}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
                Restablecer Contraseña
            </a>
            <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
            <p>{resetUrl}</p>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendWelcomeEmailAsync(string email, string username)
    {
        var subject = "¡Bienvenido a Chapin Bank!";

        var body = $@"
            <h2>¡Bienvenido a Chapin Bank, {username}!</h2>
            <p>Tu cuenta ha sido verificada y activada exitosamente.</p>
            <p>Ahora puedes disfrutar de todas las funciones de nuestra plataforma.</p>
            <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
            <p>¡Gracias por unirte a nosotros!</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordChangeAsync(string email, string username)
    {
        var subject = "Contraseña Actualizada Correctamente";
        var body = $@"
            <h2>Contraseña Actualizada</h2>
            <p>Hola {username},</p>
            <p>Le informamos que su contraseña a sido actualizada exitosamente.</p>

            <p><b>El link de solicitud de cambiar contraseña queda deshabilitado por motivos de seguridad</b></p>
            <p>¡Gracias por usar nuestros servicios de Chapin Bank!</p>
        ";

        await SendEmailAsync(email, subject, body);
    }
    public async Task SendAccountDeletionConfirmationAsync(string email, string username, string token)
    {
        var subject = "Confirmación de eliminación de cuenta";

        var body = $@"
            <h2>Solicitud de eliminación de cuenta</h2>
            <p>Hola {username},</p>
            <p>Recibimos una solicitud para eliminar tu cuenta de Chapin Bank.</p>
            <p>Para confirmar la eliminación, usa el siguiente token:</p>
            <p style='font-size: 18px; font-weight: bold;'>{token}</p>
            <p>Este token expirará en <strong>1 hora</strong>.</p>
            <p>Si no solicitaste esto, ignora este correo. Tu cuenta permanecerá activa.</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        // Verificar si el email está habilitado
        var enabled = bool.Parse(smtpSettings["Enabled"] ?? "true");
        if (!enabled)
        {
            logger.LogInformation("El envío de emails está deshabilitado en la configuración. Omitiendo envío");
            return;
        }

        var apiKey = configuration["Brevo:ApiKey"];
        var fromEmail = smtpSettings["FromEmail"];
        var fromName = smtpSettings["FromName"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            logger.LogError("Brevo:ApiKey no está configurado");
            throw new InvalidOperationException("Brevo:ApiKey no configurado");
        }

        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            logger.LogError("SmtpSettings:FromEmail no está configurado");
            throw new InvalidOperationException("FromEmail no configurado en SmtpSettings");
        }

        try
        {
            var payload = new
            {
                sender = new { name = fromName, email = fromEmail },
                to = new[] { new { email = to } },
                subject,
                htmlContent = body
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            };
            request.Headers.Add("api-key", apiKey);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var timeoutMs = int.Parse(smtpSettings["Timeout"] ?? "30000");
            using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(timeoutMs));

            var response = await httpClient.SendAsync(request, cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                logger.LogError("Brevo respondió con error {StatusCode}: {Body}", response.StatusCode, errorBody);
                throw new InvalidOperationException($"Error al enviar el email: {response.StatusCode}");
            }

            logger.LogInformation("Email enviado exitosamente vía Brevo");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar el email");

            var useFallback = bool.Parse(smtpSettings["UseFallback"] ?? "false");
            if (useFallback)
            {
                logger.LogWarning("Usando respaldo de email");
                return; // No fallar, solo logear
            }

            throw new InvalidOperationException($"Error al enviar el email: {ex.Message}", ex);
        }
    }
}