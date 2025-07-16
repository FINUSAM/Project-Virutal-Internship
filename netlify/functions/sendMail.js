const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['name', 'eaddress', 'phone', 'message'];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            error: `Missing required field: ${field}` 
          })
        };
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.eaddress)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid email format' 
        })
      };
    }

    // Validate phone number
    const phoneRegex = /^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid phone number format' 
        })
      };
    }

    // Send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: 'New Contact Form Message - CyberSync',
          html: `
            <h2>New Contact Form Message</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.eaddress}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact form email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue without failing the request
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Message sent successfully! We will get back to you soon.',
        status: 'Success'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        error: 'Internal server error. Please try again later.',
        status: 'Error'
      })
    };
  }
}; 