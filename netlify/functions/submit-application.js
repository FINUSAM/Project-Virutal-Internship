const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'internship', 'motivation'];
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid email format' 
        })
      };
    }

    // Phone validation (basic)
    const phoneRegex = /^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!phoneRegex.test(data.phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid phone number format' 
        })
      };
    }

    // Create email content
    const emailContent = `
      New Internship Application Received
      
      Name: ${data.fullName}
      Email: ${data.email}
      Phone: ${data.phone}
      Preferred Internship: ${data.internship}
      Previous Experience: ${data.experience || 'Not provided'}
      Motivation: ${data.motivation}
      
      Submitted on: ${new Date().toISOString()}
    `;

    // Send email if email credentials are configured
    // These will be set in Netlify dashboard, not in the code
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT || 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          subject: 'New Internship Application - SentriX',
          text: emailContent,
          html: `
            <h2>New Internship Application Received</h2>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Preferred Internship:</strong> ${data.internship}</p>
            <p><strong>Previous Experience:</strong> ${data.experience || 'Not provided'}</p>
            <p><strong>Motivation:</strong></p>
            <p>${data.motivation}</p>
            <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      // Log the application if email is not configured
      console.log('Application received (email not configured):', emailContent);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Application submitted successfully! We will review your submission and get back to you soon.',
        status: 'Success'
      })
    };

  } catch (error) {
    console.error('Error processing application:', error);
    
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