import nodemailer from 'nodemailer';

class EmailService {
  constructor() {

    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
    });
      
    this.fromAddress = process.env.EMAIL_FROM;
  }

  async sendEmail({ to, subject, html }) {
    const mailOptions = {
      from: this.fromAddress,
      to,
      subject,
      html,
      replyTo: this.fromAddress,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendVerificationEmail(to, otp) {
    const subject = 'Verify Your Account';
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
          color: white !important; text-decoration: none; border-radius: 5px; 
          font-weight: bold; margin: 20px 0; 
        }
        .footer { font-size: 12px; color: #999; margin-top: 30px; }
      </style>
    </head>
    <body>
      <h2 style="color: #333;">Welcome to Our App!</h2>
      <p style="color: #555;">Thank you for signing up. Please verify your account by clicking the button below:</p>
      
      
      <p>Here is your otp </p>
      <p style="word-break: break-all;">${otp}</p>
      
      <p class="footer">
        If you did not request this email, you can safely ignore it.
      </p>
    </body>
    </html>
    `;
    
    await this.sendEmail({ to, subject, html });
  }

  async sendTwoFactorCode(to, code) {
    const subject = 'Your Two-Factor Authentication Code';
    const html = `
      <h1>2FA Code</h1>
      <p>Your code is: <strong>${code}</strong></p>
    `;
    await this.sendEmail({ to, subject, html });
  }

  async sendPaymentConfirmation(to, orderDetails) {
    const subject = 'Payment Confirmation';
    const html = `
      <h1>Payment Successful</h1>
      <p>Thank you for your payment.</p>
      <p>Order ID: ${orderDetails.orderId}</p>
      <p>Amount: $${orderDetails.amount}</p>
    `;
    await this.sendEmail({ to, subject, html });
  }

  async sendOrderConfirmation(to, orderDetails) {
    const subject = 'Order Confirmation';
    const html = `
      <h1>Order Placed</h1>
      <p>Your order has been placed successfully.</p>
      <p>Order ID: ${orderDetails.orderId}</p>
      <p>Expected Delivery: ${orderDetails.deliveryDate}</p>
    `;
    await this.sendEmail({ to, subject, html });
  }

  async sendPromotionalEmail(to, promotionContent) {
    const subject = promotionContent.subject;
    const html = `
      <h1>${promotionContent.title}</h1>
      <p>${promotionContent.body}</p>
      ${promotionContent.ctaLink ? `<a href="${promotionContent.ctaLink}">Learn More</a>` : ''}
    `;
    await this.sendEmail({ to, subject, html });
  }
}

const emailService = new EmailService();
export default emailService;
