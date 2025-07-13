// Certificate verification function using database
const { MongoClient } = require('mongodb');

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
    const { certificateId, participantName } = data;
    
    if (!certificateId || !participantName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Certificate ID and Participant Name are required' 
        })
      };
    }

    // Clean and validate inputs
    const cleanCertificateId = certificateId.trim().toUpperCase();
    const cleanParticipantName = participantName.trim();

    // Enhanced validation
    const certificateIdRegex = /^[A-Z]{3}-\d{4}-\d{3}$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    
    if (!certificateIdRegex.test(cleanCertificateId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Certificate ID must be in format: XXX-YYYY-NNN (e.g., PVI-2024-001)' 
        })
      };
    }
    
    if (!nameRegex.test(cleanParticipantName)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Participant name must be 2-50 characters and contain only letters and spaces' 
        })
      };
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      // Fallback to mock data if database not configured
      console.log('Database not configured, using mock data');
      return await handleMockVerification(cleanCertificateId, cleanParticipantName);
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    
    // Find the certificate in database
    const certificate = await collection.findOne({
      certificateId: cleanCertificateId,
      participantName: { $regex: cleanParticipantName, $options: 'i' }
    });
    
    await client.close();
    
    // Log verification attempt
    console.log(`Certificate verification attempt:`, {
      certificateId: cleanCertificateId,
      participantName: cleanParticipantName,
      timestamp: new Date().toISOString(),
      ip: event.headers['client-ip'] || 'unknown',
      found: !!certificate
    });

    if (certificate) {
      // Certificate found and valid
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'Success',
          verified: true,
          certificate: {
            id: certificate.certificateId,
            participantName: certificate.participantName,
            program: certificate.program,
            completionDate: certificate.completionDate,
            status: certificate.status,
            issuedDate: certificate.issuedDate
          },
          message: 'Certificate verified successfully!'
        })
      };
    } else {
      // Certificate not found
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          status: 'Error',
          verified: false,
          message: 'Certificate not found or invalid. Please check the certificate ID and participant name.',
          suggestions: [
            'Verify the certificate ID is correct',
            'Ensure the participant name matches exactly',
            'Check that the certificate is from SentriX',
            'Contact support if you believe this is an error'
          ]
        })
      };
    }

  } catch (error) {
    console.error('Error processing certificate verification:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'Error',
        verified: false,
        message: 'Internal server error. Please try again later.'
      })
    };
  }
};

// Fallback mock verification function
async function handleMockVerification(certificateId, participantName) {
  // Mock database of valid certificates
  const validCertificates = [
    {
      certificateId: 'PVI-2024-001',
      participantName: 'John Doe',
      program: 'Web Development Internship',
      completionDate: 'December 2024',
      status: 'Valid',
      issuedDate: '2024-12-15'
    },
    {
      certificateId: 'PVI-2024-002',
      participantName: 'Jane Smith',
      program: 'Machine Learning Internship',
      completionDate: 'November 2024',
      status: 'Valid',
      issuedDate: '2024-11-20'
    },
    {
      certificateId: 'PVI-2024-003',
      participantName: 'Mike Johnson',
      program: 'Full Stack Web Development',
      completionDate: 'October 2024',
      status: 'Valid',
      issuedDate: '2024-10-10'
    }
  ];

  // Find the certificate
  const certificate = validCertificates.find(cert => 
    cert.certificateId === certificateId && 
    cert.participantName.toLowerCase() === participantName.toLowerCase()
  );

  if (certificate) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'Success',
        verified: true,
        certificate: {
          id: certificate.certificateId,
          participantName: certificate.participantName,
          program: certificate.program,
          completionDate: certificate.completionDate,
          status: certificate.status,
          issuedDate: certificate.issuedDate
        },
        message: 'Certificate verified successfully! (Mock data)'
      })
    };
  } else {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        status: 'Error',
        verified: false,
        message: 'Certificate not found or invalid. Please check the certificate ID and participant name.',
        suggestions: [
          'Verify the certificate ID is correct',
          'Ensure the participant name matches exactly',
                      'Check that the certificate is from SentriX',
          'Contact support if you believe this is an error'
        ]
      })
    };
  }
} 