// Configuration - Update this with your server URL
        const API_BASE_URL = 'http://localhost:3000'; // Change this to your deployed server URL

        // Get form elements
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('messageDiv');
        const btnText = document.querySelector('.btn-text');

        // Form submission handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                subject: formData.get('subject').trim(),
                message: formData.get('message').trim()
            };

            // Validate form data
            if (!data.name || !data.email || !data.subject || !data.message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            try {
                // Show loading state
                setLoadingState(true);
                hideMessage();

                // Create email content
                const emailData = {
                    to: 'colelenting7@gmail.com' ,
                    subject: `Portfolio Contact: ${data.subject}`,
                    text: `
New message from your portfolio contact form:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent from your portfolio contact form.
                    `,
                    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        New Portfolio Contact Message
    </h2>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Subject:</strong> ${data.subject}</p>
    </div>
    
    <div style="background-color: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 10px;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="line-height: 1.6; color: #666;">${data.message.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;">
        <p>This message was sent from your portfolio contact form on ${new Date().toLocaleString()}.</p>
        <p>Reply directly to this email to respond to ${data.name}.</p>
    </div>
</div>
                    `
                };

                // Send email via your API
                const response = await fetch(`${API_BASE_URL}/send-html`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success
                    showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
                    form.reset();
                    
                    // Optional: Send auto-reply to the user
                    setTimeout(() => {
                        sendAutoReply(data);
                    }, 1000);
                } else {
                    throw new Error(result.error || 'Failed to send email');
                }

            } catch (error) {
                console.error('Error sending email:', error);
                showMessage('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            } finally {
                setLoadingState(false);
            }
        });

        // Optional: Send auto-reply to the user
        async function sendAutoReply(userData) {
            try {
                const autoReplyData = {
                    to: userData.email,
                    subject: 'Thank you for your message!',
                    text: `
Hi ${userData.name},

Thank you for reaching out through my portfolio! I've received your message about "${userData.subject}" and I'll get back to you as soon as possible.

In the meantime, feel free to check out more of my work on my portfolio.

Best regards,
Cole Lenting

---
This is an automated response. Please don't reply to this email.
                    `,
                    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #667eea;">Thank you for your message!</h2>
    
    <p>Hi ${userData.name},</p>
    
    <p>Thank you for reaching out through my portfolio! I've received your message about "<strong>${userData.subject}</strong>" and I'll get back to you as soon as possible.</p>
    
    <p>In the meantime, feel free to check out more of my work on my portfolio.</p>
    
    <p>Best regards,<br>Cole Lenting</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;">
        <p>This is an automated response. Please don't reply to this email.</p>
    </div>
</div>
                    `
                };

                await fetch(`${API_BASE_URL}/send-html`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(autoReplyData)
                });
            } catch (error) {
                console.error('Error sending auto-reply:', error);
                // Don't show error to user for auto-reply failure
            }
        }

        function setLoadingState(loading) {
            if (loading) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                btnText.textContent = 'Sending...';
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
            }
        }

        function showMessage(message, type) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    hideMessage();
                }, 5000);
            }
        }

        function hideMessage() {
            messageDiv.style.display = 'none';
        }

        // Add input validation feedback
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.target.style.borderColor = '#dc3545';
            });
            
            input.addEventListener('input', (e) => {
                if (e.target.checkValidity()) {
                    e.target.style.borderColor = '#28a745';
                } else {
                    e.target.style.borderColor = '#e1e5e9';
                }
            });
        });