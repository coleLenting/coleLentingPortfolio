const express = require('express');
const EmailService = require('./emailService');
require('dotenv').config();

const app = express();
const emailService = new EmailService();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Enable CORS for frontend integration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve static files (for your portfolio)
app.use(express.static('public'));

// Routes

/**
 * Health check endpoint
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Portfolio Email Service API is running! 🚀',
        endpoints: {
            'POST /portfolio-contact': 'Send contact form email from portfolio',
            'POST /send-text': 'Send a simple text email',
            'POST /send-html': 'Send an HTML email',
            'POST /send-welcome': 'Send a welcome email template',
            'POST /send-bulk': 'Send email to multiple recipients'
        }
    });
});

/**
 * Portfolio Contact Form Endpoint
 * POST /portfolio-contact
 * Body: { "name": "John Doe", "email": "john@example.com", "subject": "Hello", "message": "Your message here" }
 */
app.post('/portfolio-contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, email, subject, message'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Sanitize input to prevent HTML injection
        const sanitize = (str) => str.replace(/[<>]/g, '');
        const sanitizedData = {
            name: sanitize(name.trim()),
            email: email.trim().toLowerCase(),
            subject: sanitize(subject.trim()),
            message: message.trim()
        };

        console.log(`📧 New portfolio contact from: ${sanitizedData.name} (${sanitizedData.email})`);

        // Create email content for yourself
        const emailToYou = {
            to: process.env.YOUR_EMAIL , 
            subject: `Portfolio Contact: ${sanitizedData.subject}`,
            replyTo: sanitizedData.email,
            text: `
New message from your portfolio contact form:

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Subject: ${sanitizedData.subject}

Message:
${sanitizedData.message}

---
Reply to: ${sanitizedData.email}
Sent: ${new Date().toLocaleString()}
From: Portfolio Contact Form
            `,
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 0;">
            📧 New Portfolio Contact Message
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; width: 80px;">Name:</td>
                    <td style="padding: 8px 0; color: #333;">${sanitizedData.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${sanitizedData.email}" style="color: #667eea; text-decoration: none;">${sanitizedData.email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                    <td style="padding: 8px 0; color: #333;">${sanitizedData.subject}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">💬 Message:</h3>
            <div style="line-height: 1.6; color: #666; white-space: pre-wrap;">${sanitizedData.message}</div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h4 style="color: #1976d2; margin-top: 0;">Quick Actions:</h4>
            <p style="margin: 10px 0;">
                <a href="mailto:${sanitizedData.email}?subject=Re: ${encodeURIComponent(sanitizedData.subject)}" 
                   style="display: inline-block; background-color: #667eea; color: white; padding: 10px 20px; 
                   text-decoration: none; border-radius: 5px; margin-right: 10px;">
                   📧 Reply to ${sanitizedData.name}
                </a>
            </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;">
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Source:</strong> Portfolio Contact Form</p>
        </div>
    </div>
</div>
            `
        };

        // Send email to yourself
        const result = await emailService.sendHtmlEmail(emailToYou);

        if (result.success) {
            console.log('✅ Portfolio contact email sent successfully');
            
            // Send auto-reply to the user (optional)
            try {
                const autoReply = {
                    to: sanitizedData.email,
                    subject: 'Thank you for your message!',
                    text: `
Hello ${sanitizedData.name},

Thank you for reaching out through my portfolio! I've received your message about "${sanitizedData.subject}" and I appreciate you taking the time to contact me.

I'll review your message and get back to you as soon as possible, usually within 24-48 hours.

Best regards,
[Your Name]

---
This is an automated confirmation. Please don't reply to this email.
                    `,
                    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #667eea; margin-top: 0;">Thank you for your message! 🙏</h2>
        
        <p style="color: #333; line-height: 1.6;">Hello ${sanitizedData.name},</p>
        
        <p style="color: #333; line-height: 1.6;">
            Thank you for reaching out through my portfolio! I've received your message about 
            "<strong>${sanitizedData.subject}</strong>" and I appreciate you taking the time to contact me.
        </p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #555;">
                📋 <strong>Your message summary:</strong><br>
                Subject: ${sanitizedData.subject}<br>
                Received: ${new Date().toLocaleString()}
            </p>
        </div>
        
        <p style="color: #333; line-height: 1.6;">
            I'll review your message and get back to you as soon as possible, usually within 24-48 hours.
        </p>
        
        <p style="color: #333; line-height: 1.6;">
            Yours truly,<br>
            <strong>Cole Charles Peter Lenting</strong>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;">
            <p>This is an automated confirmation. Please don't reply to this email.</p>
        </div>
    </div>
</div>
                    `
                };

                await emailService.sendHtmlEmail(autoReply);
                console.log('✅ Auto-reply sent to user');
            } catch (autoReplyError) {
                console.log('⚠️ Auto-reply failed (not critical):', autoReplyError.message);
            }

            res.json({
                success: true,
                message: 'Thank you! Your message has been sent successfully.',
                messageId: result.messageId
            });
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error in /portfolio-contact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.'
        });
    }
});

/**
 * Send a simple text email
 * POST /send-text
 * Body: { "to": "user@example.com", "subject": "Hello", "text": "Hello World!" }
 */
app.post('/send-text', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        // Validation
        if (!to || !subject || !text) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, text'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        console.log(`📧 Sending text email to: ${to}`);
        const result = await emailService.sendTextEmail(to, subject, text);

        if (result.success) {
            res.json({
                success: true,
                message: 'Email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in /send-text:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Send an HTML email
 * POST /send-html
 */
app.post('/send-html', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!to || !subject || (!text && !html)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, and (text or html)'
            });
        }

        console.log(`📧 Sending HTML email to: ${to}`);
        const result = await emailService.sendHtmlEmail({
            to,
            subject,
            text,
            html
        });

        if (result.success) {
            res.json({
                success: true,
                message: 'HTML email sent successfully!',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in /send-html:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Send a welcome email
 * POST /send-welcome
 * Body: { "to": "user@example.com", "name": "John Doe" }
 */
app.post('/send-welcome', async (req, res) => {
    try {
        const { to, name } = req.body;

        if (!to || !name) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, name'
            });
        }

        console.log(`📧 Sending welcome email to: ${name} (${to})`);
        const result = await emailService.sendWelcomeEmail(to, name);

        if (result.success) {
            res.json({
                success: true,
                message: `Welcome email sent to ${name}!`,
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in /send-welcome:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Send bulk emails
 * POST /send-bulk
 * Body: { "recipients": ["user1@example.com", "user2@example.com"], "subject": "Hello", "text": "Hello World!" }
 */
app.post('/send-bulk', async (req, res) => {
    try {
        const { recipients, subject, text } = req.body;

        if (!recipients || !Array.isArray(recipients) || !subject || !text) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: recipients (array), subject, text'
            });
        }

        if (recipients.length > 10) {
            return res.status(400).json({
                success: false,
                error: 'Maximum 10 recipients allowed per request'
            });
        }

        console.log(`📧 Sending bulk email to ${recipients.length} recipients`);
        const results = await emailService.sendBulkEmail(recipients, subject, text);

        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;

        res.json({
            success: true,
            message: `Bulk email completed: ${successful} sent, ${failed} failed`,
            results: results
        });
    } catch (error) {
        console.error('Error in /send-bulk:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio Email service running on port ${PORT}`);
    console.log(`📧 Visit http://localhost:${PORT} to see available endpoints`);
    console.log(`🌐 Portfolio contact form endpoint: POST /portfolio-contact`);
    console.log('Press Ctrl+C to stop the server');
});

// Gracefully handle shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down email service...');
    process.exit(0);
});