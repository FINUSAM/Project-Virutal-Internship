const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    // Check if database is configured
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          certificates: [],
          message: 'Database not configured. No certificates to display.',
          total: 0
        })
      };
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    
    // Get all certificates, sorted by creation date (newest first)
    const certificates = await collection.find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    await client.close();
    
    // Format certificates for display
    const formattedCertificates = certificates.map(cert => ({
      id: cert._id,
      certificateId: cert.certificateId,
      participantName: cert.participantName,
      program: cert.program,
      completionDate: cert.completionDate,
      issuedDate: cert.issuedDate,
      status: cert.status,
      createdAt: cert.createdAt
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        certificates: formattedCertificates,
        total: formattedCertificates.length,
        message: `Found ${formattedCertificates.length} certificate(s)`
      })
    };

  } catch (error) {
    console.error('Error listing certificates:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        error: 'Failed to load certificates',
        certificates: [],
        total: 0
      })
    };
  }
}; 