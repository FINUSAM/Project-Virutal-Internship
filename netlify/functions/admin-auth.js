const crypto = require('crypto');

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
    if (!data.username || !data.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Username and password are required' 
        })
      };
    }

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Admin authentication not configured' 
        })
      };
    }

    // Validate credentials
    if (data.username === adminUsername && data.password === adminPassword) {
      // Generate a simple session token (in production, use JWT)
      const sessionToken = crypto.randomBytes(32).toString('hex');
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: true,
          message: 'Authentication successful',
          sessionToken: sessionToken
        })
      };
    } else {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          error: 'Invalid username or password'
        })
      };
    }

  } catch (error) {
    console.error('Error processing admin authentication:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
}; 