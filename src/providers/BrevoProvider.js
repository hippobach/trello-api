import { env } from '~/config/environment';
const SibApiV3Sdk = require('@getbrevo/brevo');

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khởi tạo một sendSmtpEmail
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  // Tài khoản gửi mail: chính là tài khoản email trên Brevo
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };
  // Địa chỉ những tài khoản nhận mail
  sendSmtpEmail.to = [{ email: recipientEmail }];
  // Tiêu đề của email
  sendSmtpEmail.subject = customSubject;
  // Nội dung email dùng HTML
  sendSmtpEmail.htmlContent = htmlContent;
  // Thực hiện gửi email
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

export const BrevoProvider = {
  sendEmail,
};
