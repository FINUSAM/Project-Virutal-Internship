// Function to add certificate data to database
// This can be used by admins to add new certificates

const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check for admin authentication
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Authentication required' 
      })
    };
  }

  // In a production app, you'd validate the token with the server
  // For now, we'll just check if it exists
  const token = authHeader.replace('Bearer ', '');
  if (!token || token.length < 10) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Invalid authentication token' 
      })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = ['certificateId', 'participantName', 'program', 'completionDate'];
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          body: JSON.stringify({ 
            error: `Missing required field: ${field}` 
          })
        };
      }
    }

    // Validate certificate ID format (optional)
    if (!data.certificateId.match(/^[A-Z]{3}-\d{4}-\d{3}$/)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ 
          error: 'Certificate ID must be in format: XXX-YYYY-NNN (e.g., PVI-2024-001)' 
        })
      };
    }

    // Check if database is configured
    if (!process.env.MONGODB_URI) {
      console.log('Database not configured, using mock storage');
      return await handleMockCertificateAddition(data);
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    
    // Check if certificate already exists
    const existingCertificate = await collection.findOne({
      certificateId: data.certificateId
    });
    
    if (existingCertificate) {
      await client.close();
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ 
          error: 'Certificate ID already exists' 
        })
      };
    }
    
    // Create certificate document
    const certificateData = {
      certificateId: data.certificateId,
      participantName: data.participantName,
      program: data.program,
      completionDate: data.completionDate,
      issuedDate: data.issuedDate || new Date(),
      status: data.status || 'valid',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert certificate into database
    const result = await collection.insertOne(certificateData);
    
    await client.close();
    
    console.log('Certificate added:', result.insertedId);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Certificate added successfully!',
        certificateId: data.certificateId,
        participantName: data.participantName,
        status: 'Success'
      })
    };

  } catch (error) {
    console.error('Error adding certificate:', error);
    
    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          error: 'Database connection failed. Please check your database configuration.',
          status: 'Error'
        })
      };
    }
    
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

// Fallback mock certificate addition function
async function handleMockCertificateAddition(data) {
  // In a real implementation, you might store this in memory or a simple file
  // For now, we'll just simulate success
  console.log('Mock certificate addition:', data);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      message: 'Certificate added successfully! (Mock mode - database not configured)',
      certificateId: data.certificateId,
      participantName: data.participantName,
      status: 'Success',
      note: 'This is running in mock mode. Configure MONGODB_URI environment variable for persistent storage.'
    })
  };
} 