import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía un correo de bienvenida al Merchant de Shopify
 */
export async function sendWelcomeEmail(to: string, storeName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ConciliAI <hola@concilia.ai>',
      to: [to],
      subject: '¡Bienvenido a ConciliAI! 🚀 Tu primera auditoría te espera',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h1 style="color: #4f46e5; font-size: 24px; font-weight: 800;">¡Hola, ${storeName}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">Bienvenido a <strong>ConciliAI</strong>. Estamos muy emocionados de ayudarte a recuperar tiempo y dinero en tu contabilidad.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 25px 0;">
            <p style="margin: 0; font-weight: bold; color: #0f172a;">Próximo paso recomendado:</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Carga tu primer extracto bancario en el Dashboard para ver la magia de la IA en acción.</p>
          </div>
          <a href="https://concilia-six.vercel.app/dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Ir al Dashboard</a>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b;">Si tienes alguna duda, responde a este correo o escríbenos por Telegram. Estamos aquí para ti 24/7.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error enviando email bienvenida:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Excepción enviando email bienvenida:', error);
    return { success: false, error };
  }
}

/**
 * Envía un reporte resumen de conciliación finalizada
 */
export async function sendReconciliationSuccessEmail(to: string, storeName: string, dataSummary: { 
  period: string, 
  totalMatches: number, 
  difference: number 
}) {
  const formattedDiff = new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP' 
  }).format(dataSummary.difference);

  try {
    const { data, error } = await resend.emails.send({
      from: 'ConciliAI Reports <reportes@concilia.ai>',
      to: [to],
      subject: `Reporte de Conciliación Listo - ${dataSummary.period} ✅`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
           <div style="text-align: center; margin-bottom: 20px;">
            <span style="background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Conciliación Exitosa</span>
          </div>
          <h2 style="color: #0f172a; margin-bottom: 10px;">¡Listo, ${storeName}!</h2>
          <p style="font-size: 14px;">Hemos procesado tu extracto correspondiente al periodo <strong>${dataSummary.period}</strong>.</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">Transacciones Cruzadas</p>
              <p style="font-size: 20px; font-weight: 800; color: #4f46e5; margin: 5px 0;">${dataSummary.totalMatches}</p>
            </div>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">Diferencia Neta</p>
              <p style="font-size: 20px; font-weight: 800; color: ${dataSummary.difference === 0 ? '#16a34a' : '#e11d48'}; margin: 5px 0;">
                ${formattedDiff}
              </p>
            </div>
          </div>

          <p style="font-size: 14px;">Tu Acta de Auditoría y el Reporte de Ajustes Matemáticos ya están disponibles para descargar en formato PDF.</p>
          <a href="https://concilia-six.vercel.app/dashboard" style="display: block; text-align: center; background-color: #0f172a; color: white; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 20px;">Ver Auditoría Completa</a>
          
          <p style="font-size: 11px; color: #94a3b8; margin-top: 40px; text-align: center;">
            Enviado automáticamente por ConciliAI Engine.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error enviando reporte email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Excepción enviando reporte email:', error);
    return { success: false, error };
  }
}
