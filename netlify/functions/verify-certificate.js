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

    if (cleanCertificateId.length < 5 || cleanParticipantName.length < 2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid certificate ID or participant name format' 
        })
      };
    }

    // Mock database of valid certificates
    // In a real application, this would be a database query
    const validCertificates = [
      {
        id: 'PVI-2024-001',
        participantName: 'John Doe',
        program: 'Web Development Internship',
        completionDate: 'December 2024',
        status: 'Valid',
        issuedDate: '2024-12-15'
      },
      {
        id: 'PVI-2024-002',
        participantName: 'Jane Smith',
        program: 'Machine Learning Internship',
        completionDate: 'November 2024',
        status: 'Valid',
        issuedDate: '2024-11-20'
      },
      {
        id: 'PVI-2024-003',
        participantName: 'Mike Johnson',
        program: 'Full Stack Web Development',
        completionDate: 'October 2024',
        status: 'Valid',
        issuedDate: '2024-10-10'
      },
      {
        id: 'PVI-2024-004',
        participantName: 'Sarah Wilson',
        program: 'Data Science Internship',
        completionDate: 'September 2024',
        status: 'Valid',
        issuedDate: '2024-09-25'
      },
      {
        id: 'PVI-2024-005',
        participantName: 'David Brown',
        program: 'Software Development Internship',
        completionDate: 'August 2024',
        status: 'Valid',
        issuedDate: '2024-08-15'
      }
    ];

    // Find the certificate
    const certificate = validCertificates.find(cert => 
      cert.id === cleanCertificateId && 
      cert.participantName.toLowerCase() === cleanParticipantName.toLowerCase()
    );

    // Log verification attempt
    console.log(`Certificate verification attempt:`, {
      certificateId: cleanCertificateId,
      participantName: cleanParticipantName,
      timestamp: new Date().toISOString(),
      ip: event.headers['client-ip'] || 'unknown'
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
            id: certificate.id,
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
            'Check that the certificate is from CyberSync',
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