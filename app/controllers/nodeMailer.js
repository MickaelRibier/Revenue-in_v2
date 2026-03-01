import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.mail.yahoo.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
  secure: process.env.SMTP_SECURE === 'false' ? false : true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PWD,
  },
  tls: {
    // For self-hosted Postfix, useful if certs are self-signed or have issues
    rejectUnauthorized: process.env.SMTP_IGNORE_TLS === 'true' ? false : true,
  },
  logger: true,
  debug: true,
});

export async function main(params) {
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const info = await transporter.sendMail({
    from: `"RevenueIn website" <${fromAddress}>`, // sender address
    to: process.env.EMAIL_RECIPIENT, // list of receivers
    subject: `${params.name} vous a contacté via le site RevenueIn`, // Subject line
    text: `${params.name} vous a envoyé le message suivant : \n
    ${params.message} \n\n Email de contact : ${params.email}`, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
}
