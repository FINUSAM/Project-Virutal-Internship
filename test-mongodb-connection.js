const { MongoClient } = require('mongodb');

// ========================================
// CONFIGURATION - FILL IN YOUR DETAILS HERE
// ========================================

// Replace these with your actual MongoDB Atlas connection details
const MONGODB_URI = 'mongodb+srv://finusam:%40Finusam2010@clusterinternship.5tzuknl.mongodb.net/?retryWrites=true&w=majority&appName=ClusterInternship'; // Paste your MongoDB connection string here
const DATABASE_NAME = 'internship_applications'; // Your database name
const COLLECTION_NAME = 'certificates'; // Your collection name

// Test certificate data
const testCertificate = {
  certificateId: 'TEST-2025-001',
  participantName: 'Test User',
  program: 'Test Program',
  completionDate: 'January 2025',
  issuedDate: new Date(),
  status: 'valid',
  createdAt: new Date(),
  updatedAt: new Date()
};

// ========================================
// TEST FUNCTIONS
// ========================================

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  if (!MONGODB_URI) {
    console.log('❌ ERROR: MONGODB_URI is empty!');
    console.log('Please paste your MongoDB connection string in the MONGODB_URI variable above.\n');
    return;
  }

  let client;
  
  try {
    console.log('📡 Attempting to connect to MongoDB...');
    console.log('Connection string:', MONGODB_URI.substring(0, 50) + '...');
    
    // Create MongoDB client
    client = new MongoClient(MONGODB_URI);
    
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    console.log('\n📊 Testing database access...');
    const db = client.db(DATABASE_NAME);
    console.log(`✅ Successfully accessed database: ${DATABASE_NAME}`);
    
    // Test collection access
    console.log('\n📋 Testing collection access...');
    const collection = db.collection(COLLECTION_NAME);
    console.log(`✅ Successfully accessed collection: ${COLLECTION_NAME}`);
    
    // Test basic operations
    console.log('\n🔢 Testing basic operations...');
    
    // Count documents
    const count = await collection.countDocuments();
    console.log(`✅ Collection has ${count} documents`);
    
    // Test insert operation
    console.log('\n➕ Testing insert operation...');
    const insertResult = await collection.insertOne(testCertificate);
    console.log(`✅ Successfully inserted test certificate with ID: ${insertResult.insertedId}`);
    
    // Test find operation
    console.log('\n🔍 Testing find operation...');
    const foundCertificate = await collection.findOne({ certificateId: testCertificate.certificateId });
    if (foundCertificate) {
      console.log('✅ Successfully found inserted certificate');
      console.log(`   Certificate ID: ${foundCertificate.certificateId}`);
      console.log(`   Participant: ${foundCertificate.participantName}`);
    } else {
      console.log('❌ Could not find inserted certificate');
    }
    
    // Clean up - remove test certificate
    console.log('\n🧹 Cleaning up test data...');
    const deleteResult = await collection.deleteOne({ certificateId: testCertificate.certificateId });
    if (deleteResult.deletedCount > 0) {
      console.log('✅ Successfully removed test certificate');
    } else {
      console.log('⚠️  Could not remove test certificate (might not exist)');
    }
    
    console.log('\n🎉 All tests passed! Your MongoDB connection is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Copy your MongoDB connection string to Netlify environment variables');
    console.log('2. Set MONGODB_URI in your Netlify dashboard');
    console.log('3. Deploy your updated functions');
    console.log('4. Test the admin panel again');
    
  } catch (error) {
    console.log('\n❌ ERROR: MongoDB connection failed!');
    console.log('Error details:');
    console.log(`   Type: ${error.name}`);
    console.log(`   Message: ${error.message}`);
    
    // Provide helpful error messages
    if (error.name === 'MongoNetworkError') {
      console.log('\n💡 Possible solutions:');
      console.log('   - Check if your MongoDB Atlas cluster is running');
      console.log('   - Verify network access settings (should allow 0.0.0.0/0)');
      console.log('   - Check your internet connection');
    } else if (error.name === 'MongoServerError' && error.message.includes('authentication')) {
      console.log('\n💡 Possible solutions:');
      console.log('   - Check your MongoDB username and password');
      console.log('   - Verify the user has read/write permissions');
      console.log('   - Make sure the user exists in the database');
    } else if (error.name === 'MongoParseError') {
      console.log('\n💡 Possible solutions:');
      console.log('   - Check your connection string format');
      console.log('   - Make sure the connection string is complete');
      console.log('   - Verify there are no extra spaces or characters');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Go to MongoDB Atlas dashboard');
    console.log('2. Click "Connect" on your cluster');
    console.log('3. Choose "Connect your application"');
    console.log('4. Copy the connection string');
    console.log('5. Replace <password> with your actual password');
    console.log('6. Add ?retryWrites=true&w=majority at the end');
    
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed.');
    }
  }
}

// ========================================
// RUN THE TEST
// ========================================

console.log('🚀 MongoDB Connection Test');
console.log('========================\n');

// Check if MongoDB package is installed
try {
  require('mongodb');
  console.log('✅ MongoDB package is installed');
} catch (error) {
  console.log('❌ MongoDB package is not installed!');
  console.log('Please run: npm install mongodb');
  process.exit(1);
}

// Run the test
testConnection().catch(console.error); 