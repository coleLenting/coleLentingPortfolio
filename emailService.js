const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        // Create the transporter (think of this as configuring your email client)
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,    // Gmail's SMTP server
            port: parseInt(process.env.EMAIL_PORT), // Port 587 for TLS
            secure: false,                   // false for port 587, true for 465
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS  // Your App Password
            },
            // Additional security options
            tls: {
                rejectUnauthorized: false    // Allow self-signed certificates
            }
        });

        // Verify the connection on startup
        this.verifyConnection();
    }

    /**
     * Verify that we can connect to the email server
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service connected successfully');
        } catch (error) {
            console.error('❌ Email service connection failed:', error.message);
            console.error('Check your EMAIL_USER and EMAIL_PASS in .env file');
        }
    }

    /**
     * Send a simple text email
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} text - Plain text content
     */
    async sendTextEmail(to, subject, text) {
        try {
            const mailOptions = {
                from: `"Email Bot" <${process.env.EMAIL_USER}>`, // Sender name and email
                to: to,           // Recipient
                subject: subject, // Subject line
                text: text       // Plain text body
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', result.messageId);
            
            return {
                success: true,
                messageId: result.messageId,
                response: result.response
            };
        } catch (error) {
            console.error('❌ Failed to send email:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send an HTML email with attachments
     * @param {Object} options - Email options
     */
    async sendHtmlEmail(options) {
        try {
            const {
                to,
                subject,
                text,
                html,
                attachments = []
            } = options;

            const mailOptions = {
                from: `${process.env.EMAIL_USER}`,
                to: to,
                subject: subject,
                text: text,        // Fallback for clients that don't support HTML
                html: html,        // HTML content
                attachments: attachments
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            console.log('✅ HTML Email sent successfully!');
            console.log('Message ID:', result.messageId);
            
            return {
                success: true,
                messageId: result.messageId,
                response: result.response
            };
        } catch (error) {
            console.error('❌ Failed to send HTML email:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send email to multiple recipients
     * @param {Array} recipients - Array of email addresses
     * @param {string} subject - Email subject
     * @param {string} text - Email content
     */
    async sendBulkEmail(recipients, subject, text) {
        const results = [];
        
        // Send emails one by one to avoid being flagged as spam
        for (const recipient of recipients) {
            console.log(`📧 Sending email to: ${recipient}`);
            
            const result = await this.sendTextEmail(recipient, subject, text);
            results.push({
                recipient,
                ...result
            });
            
            // Wait 1 second between emails to be respectful
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    }

    /**
     * Send a welcome email template
     * @param {string} to - Recipient email
     * @param {string} name - Recipient name
     */
    async sendWelcomeEmail(to, name) {
        const subject = `Welcome ${name}! 🎉`;
        const text = `
Hello ${name},

Welcome to our service! We're excited to have you on board.

Here's what you can expect:
- Regular updates about new features
- Tips and tricks to get the most out of our service
- Direct support when you need it

If you have any questions, just reply to this email.

Best regards,
The Team
        `;

        const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #333; text-align: center;">Welcome ${name}! 🎉</h1>
    
    <p>We're excited to have you on board.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">What's Next?</h3>
        <ul>
            <li>Regular updates about new features</li>
            <li>Tips and tricks to get the most out of our service</li>
            <li>Direct support when you need it</li>
        </ul>
    </div>
    
    <p>If you have any questions, just reply to this email.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="color: #666; font-size: 14px; text-align: center;">
        Best regards,<br>
        The Team
    </p>
</div>
        `;

        return await this.sendHtmlEmail({
            to,
            subject,
            text,
            html
        });
    }
}

module.exports = EmailService;