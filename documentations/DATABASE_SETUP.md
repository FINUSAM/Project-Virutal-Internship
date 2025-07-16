# Database Setup Guide for Netlify Functions

This guide covers integrating databases with your Netlify Functions for the CyberSync platform.

## 🗄️ **Recommended Database Options**

### **1. MongoDB Atlas (Recommended)**
**Best for**: Applications, certificates, user data
**Pros**: 
- ✅ Serverless-friendly
- ✅ Easy to set up
- ✅ Good free tier
- ✅ Works well with Netlify Functions

### **2. Supabase (PostgreSQL)**
**Best for**: Complex queries, relationships
**Pros**:
- ✅ PostgreSQL with real-time features
- ✅ Built-in auth
- ✅ Great dashboard
- ✅ Free tier available

### **3. PlanetScale (MySQL)**
**Best for**: Traditional SQL needs
**Pros**:
- ✅ MySQL compatible
- ✅ Serverless
- ✅ Branch-based development
- ✅ Good performance

### **4. Fauna (Serverless Database)**
**Best for**: Complex data relationships
**Pros**:
- ✅ Built for serverless
- ✅ GraphQL support
- ✅ ACID transactions
- ✅ Free tier

## 🚀 **MongoDB Atlas Setup (Recommended)**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a new cluster (free tier)
4. Set up database access (username/password)
5. Set up network access (allow all IPs: 0.0.0.0/0)

### **Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

### **Step 3: Update Package.json**
```json
{
  "dependencies": {
    "mongodb": "^5.0.0",
    "nodemailer": "^6.9.7"
  }
}
```

### **Step 4: Set Environment Variables in Netlify**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internship_applications?retryWrites=true&w=majority
```

### **Step 5: Create Database Collections**
```javascript
// Collections you'll need:
// - applications (for form submissions)
// - certificates (for verification)
// - users (if you add authentication)
```

## 🗄️ **Supabase Setup**

### **Step 1: Create Supabase Account**
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get your project URL and anon key

### **Step 2: Create Tables**
```sql
-- Applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  internship VARCHAR(100) NOT NULL,
  experience TEXT,
  motivation TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);

-- Certificates table
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  certificate_id VARCHAR(100) UNIQUE NOT NULL,
  participant_name VARCHAR(255) NOT NULL,
  program VARCHAR(100) NOT NULL,
  completion_date VARCHAR(50) NOT NULL,
  issued_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'valid'
);
```

### **Step 3: Set Environment Variables**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 🗄️ **PlanetScale Setup**

### **Step 1: Create PlanetScale Account**
1. Go to [PlanetScale](https://planetscale.com)
2. Create new database
3. Get connection string

### **Step 2: Create Tables**
```sql
-- Applications table
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  internship VARCHAR(100) NOT NULL,
  experience TEXT,
  motivation TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- Certificates table
CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  certificate_id VARCHAR(100) UNIQUE NOT NULL,
  participant_name VARCHAR(255) NOT NULL,
  program VARCHAR(100) NOT NULL,
  completion_date VARCHAR(50) NOT NULL,
  issued_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'valid'
);
```

### **Step 3: Set Environment Variables**
```bash
DATABASE_URL=mysql://username:password@host:port/database
```

## 🔧 **Implementation Examples**

### **Application Form with Database**
```javascript
// netlify/functions/submit-application-with-db.js
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  // ... validation code ...
  
  // Save to database
  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('internship_applications');
    const collection = db.collection('applications');
    
    await collection.insertOne({
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
  }
  
  // ... rest of function ...
};
```

### **Certificate Verification with Database**
```javascript
// netlify/functions/verify-certificate-with-db.js
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  const { certificateId, participantName } = JSON.parse(event.body);
  
  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('internship_applications');
    const collection = db.collection('certificates');
    
    const certificate = await collection.findOne({
      certificateId: certificateId,
      participantName: { $regex: participantName, $options: 'i' }
    });
    
    await client.close();
    
    if (certificate) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          verified: true,
          certificate: certificate
        })
      };
    }
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({
      verified: false,
      message: 'Certificate not found'
    })
  };
};
```

## 📊 **Database Schema Examples**

### **MongoDB Collections**
```javascript
// applications collection
{
  _id: ObjectId,
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  internship: "Web Development",
  experience: "Some experience...",
  motivation: "I want to learn...",
  submittedAt: ISODate("2024-01-15"),
  status: "pending"
}

// certificates collection
{
  _id: ObjectId,
  certificateId: "PVI-2024-001",
  participantName: "John Doe",
  program: "Web Development Internship",
  completionDate: "December 2024",
  issuedDate: ISODate("2024-12-15"),
  status: "valid"
}
```

## 🔐 **Security Best Practices**

### **Environment Variables**
```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Supabase
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# PlanetScale
DATABASE_URL=mysql://username:password@host:port/database
```

### **Connection Pooling**
```javascript
// For better performance, use connection pooling
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}
```

## 🧪 **Testing Database Functions**

### **Local Testing**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Test function locally
netlify dev

# Test specific function
netlify functions:invoke submit-application-with-db --data '{"fullName":"Test","email":"test@test.com","phone":"1234567890","internship":"Web Development","motivation":"Test"}'
```

### **Production Testing**
1. Deploy to Netlify
2. Test form submission
3. Check database for new records
4. Verify certificate lookup works

## 📈 **Performance Considerations**

### **Cold Starts**
- Database connections add latency
- Consider connection pooling
- Use serverless-optimized databases

### **Cost Optimization**
- Use free tiers when possible
- Monitor function execution time
- Optimize database queries

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Connection timeout**: Check network access settings
2. **Authentication failed**: Verify credentials
3. **Function timeout**: Optimize database queries
4. **Memory limits**: Keep functions lightweight

### **Debugging**
```javascript
// Add logging to your functions
console.log('Database connection:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');
console.log('Query result:', result);
```

---

**Recommendation**: Start with **MongoDB Atlas** for simplicity, then migrate to **Supabase** if you need more complex queries or real-time features. 