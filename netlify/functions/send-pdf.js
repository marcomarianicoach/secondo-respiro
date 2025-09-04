// netlify/functions/send-pdf.js  (ESM, coerente con "type": "module")
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { pdfBase64, filename, subject, body, coachee } = JSON.parse(event.body || '{}');
    if (!pdfBase64 || !filename) return { statusCode: 400, body: 'Missing payload' };

    const msgToCoach = {
      to: process.env.TO_EMAIL,        // es: 'marcomariani.coach@gmail.com'
      from: process.env.FROM_EMAIL,    // es: 'no-reply@tuodominio.it' (verificato in SendGrid)
      subject: subject || 'Nuovo Accordo di Coaching firmato',
      text: (body || 'In allegato il PDF firmato.')
          + (coachee ? `\n\nDati coachee: ${JSON.stringify(coachee)}` : ''),
      attachments: [{
        content: pdfBase64,
        filename,
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    };

    const messages = [msgToCoach];

    if (coachee?.email) {
      messages.push({
        to: coachee.email,
        from: process.env.FROM_EMAIL,
        subject: 'Copia del tuo Accordo di Coaching firmato',
        text: 'Grazie! In allegato trovi la copia del tuo accordo firmato.',
        attachments: msgToCoach.attachments
      });
    }

    await sgMail.send(messages);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Email send failed' };
  }
};
