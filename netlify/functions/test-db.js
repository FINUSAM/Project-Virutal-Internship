const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // Only allow GET requests for testing
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check if environment variable is set
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'error',
          message: 'MONGODB_URI environment variable is not set',
          envVars: {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasAdminUsername: !!process.env.ADMIN_USERNAME,
            hasAdminPassword: !!process.env.ADMIN_PASSWORD
          }
        })
      };
    }

    // Test MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Test database access
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    
    // Try a simple operation
    const count = await collection.countDocuments();
    
    await client.close();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'success',
        message: 'Database connection successful',
        certificateCount: count,
        envVars: {
          hasMongoUri: !!process.env.MONGODB_URI,
          hasAdminUsername: !!process.env.ADMIN_USERNAME,
          hasAdminPassword: !!process.env.ADMIN_PASSWORD
        }
      })
    };

  } catch (error) {
    console.error('Database test error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        errorType: error.name,
        envVars: {
          hasMongoUri: !!process.env.MONGODB_URI,
          hasAdminUsername: !!process.env.ADMIN_USERNAME,
          hasAdminPassword: !!process.env.ADMIN_PASSWORD
        }
      })
    };
  }
}; 