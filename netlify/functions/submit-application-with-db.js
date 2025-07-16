// Example: Application form with database integration
// Choose one of these database options:

// Option 1: MongoDB Atlas (Recommended for Netlify Functions)
const { MongoClient } = require('mongodb');

// Option 2: Supabase (PostgreSQL)
// const { createClient } = require('@supabase/supabase-js');

// Option 3: PlanetScale (MySQL)
// const mysql = require('mysql2/promise');

// Option 4: Fauna (Serverless Database)
// const faunadb = require('faunadb');

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

    // ===== MONGODB ATLAS EXAMPLE =====
    if (process.env.MONGODB_URI) {
      try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        const db = client.db('internship_applications');
        const collection = db.collection('applications');
        
        // Insert application into database
        const result = await collection.insertOne({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          internship: data.internship,
          experience: data.experience || '',
          motivation: data.motivation,
          submittedAt: new Date(),
          status: 'pending'
        });
        
        await client.close();
        
        console.log('Application saved to MongoDB:', result.insertedId);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue with email even if DB fails
      }
    }

    // ===== SUPABASE EXAMPLE =====
    /*
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );
      
      const { data: result, error } = await supabase
        .from('applications')
        .insert([{
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          internship: data.internship,
          experience: data.experience || '',
          motivation: data.motivation,
          submitted_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Application saved to Supabase:', result);
      }
    }
    */

    // ===== PLANETSCALE EXAMPLE =====
    /*
    if (process.env.DATABASE_URL) {
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      
      const [result] = await connection.execute(
        'INSERT INTO applications (full_name, email, phone, internship, experience, motivation, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.fullName, data.email, data.phone, data.internship, data.experience || '', data.motivation, new Date()]
      );
      
      await connection.end();
      console.log('Application saved to PlanetScale:', result);
    }
    */

    // Send email notification
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = require('nodemailer');
      
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
          subject: 'New Internship Application - CyberSync',
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
        message: 'Application submitted successfully! We will review your submission and get back to you soon.',
        status: 'Success'
      })
    };

  } catch (error) {
    console.error('Error processing application:', error);
    
    // Log the actual error for debugging (but don't expose it to user)
    console.error('Detailed error:', error);
    
    // Determine if it's a user error or system error
    let userMessage = 'We encountered an issue processing your application. Please try again in a few minutes.';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      userMessage = 'Please check your input and try again.';
      statusCode = 400;
    } else if (error.code === 'ECONNREFUSED') {
      userMessage = 'Service temporarily unavailable. Please try again later.';
      statusCode = 503;
    }
    
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        error: userMessage,
        status: 'Error'
      })
    };
  }
}; 