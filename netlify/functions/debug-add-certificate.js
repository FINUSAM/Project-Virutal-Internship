const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  console.log('=== DEBUG: Add Certificate Function ===');
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Body:', event.body);
  console.log('Environment variables:');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
  console.log('- ADMIN_USERNAME:', process.env.ADMIN_USERNAME ? 'SET' : 'NOT SET');
  console.log('- ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET');

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Method not allowed',
        debug: {
          method: event.httpMethod,
          expected: 'POST'
        }
      })
    };
  }

  // Check for admin authentication
  const authHeader = event.headers.authorization;
  console.log('Auth header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Authentication required',
        debug: {
          hasAuthHeader: !!authHeader,
          startsWithBearer: authHeader ? authHeader.startsWith('Bearer ') : false
        }
      })
    };
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token length:', token.length);
  
  if (!token || token.length < 10) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ 
        error: 'Invalid authentication token',
        debug: {
          tokenLength: token.length,
          hasToken: !!token
        }
      })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Parsed data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['certificateId', 'participantName', 'program', 'completionDate'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          debug: {
            missingFields,
            receivedData: data
          }
        })
      };
    }

    // Validate certificate ID format
    if (!data.certificateId.match(/^[A-Z]{3}-\d{4}-\d{3}$/)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        body: JSON.stringify({ 
          error: 'Certificate ID must be in format: XXX-YYYY-NNN (e.g., PVI-2024-001)',
          debug: {
            certificateId: data.certificateId,
            pattern: /^[A-Z]{3}-\d{4}-\d{3}$/
          }
        })
      };
    }

    // Check if database is configured
    if (!process.env.MONGODB_URI) {
      console.log('Database not configured, using mock storage');
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
          note: 'This is running in mock mode. Configure MONGODB_URI environment variable for persistent storage.',
          debug: {
            mongoUriSet: false
          }
        })
      };
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    console.log('Successfully accessed database and collection');
    
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
          error: 'Certificate ID already exists',
          debug: {
            existingCertificateId: existingCertificate.certificateId
          }
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
    
    console.log('Inserting certificate:', JSON.stringify(certificateData, null, 2));
    
    // Insert certificate into database
    const result = await collection.insertOne(certificateData);
    console.log('Certificate inserted with ID:', result.insertedId);
    
    await client.close();
    console.log('Database connection closed');
    
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
        status: 'Success',
        debug: {
          insertedId: result.insertedId,
          mongoUriSet: true
        }
      })
    };

  } catch (error) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Environment variables:');
    console.error('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        error: 'Internal server error. Please try again later.',
        debug: {
          errorName: error.name,
          errorMessage: error.message,
          mongoUriSet: !!process.env.MONGODB_URI,
          stack: error.stack
        }
      })
    };
  }
}; 