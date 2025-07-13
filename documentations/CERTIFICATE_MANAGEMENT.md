# Certificate Management Guide

This guide covers how to add and manage certificate data in your SentriX platform.

## 🗄️ **Database Setup Required**

Before adding certificates, you need to set up a database:

1. **Choose a database** (MongoDB Atlas recommended)
2. **Set environment variables** in Netlify
3. **Deploy the functions**

See `DATABASE_SETUP.md` for detailed instructions.

## 📝 **Adding Certificate Data**

### **Method 1: Admin Panel (Recommended)**

1. **Deploy your site** to Netlify
2. **Visit the admin panel**: `https://your-site.netlify.app/admin.html`
3. **Fill out the form** with certificate details:
   - Certificate ID (e.g., PVI-2024-001)
   - Participant Name
   - Program
   - Completion Date
   - Status

### **Method 2: Direct API Call**

You can add certificates programmatically:

```javascript
// Example: Add certificate via API
const certificateData = {
  certificateId: "PVI-2024-006",
  participantName: "Alice Johnson",
  program: "Web Development Internship",
  completionDate: "January 2025",
  issuedDate: "2025-01-15",
  status: "valid"
};

const response = await fetch('/.netlify/functions/add-certificate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(certificateData),
});

const result = await response.json();
console.log(result);
```

### **Method 3: Database Direct Access**

If you have MongoDB Atlas access:

```javascript
// Connect to your MongoDB database
// Collection: certificates
// Document structure:
{
  certificateId: "PVI-2024-001",
  participantName: "John Doe",
  program: "Web Development Internship",
  completionDate: "December 2024",
  issuedDate: "2024-12-15",
  status: "valid",
  createdAt: "2024-12-15T10:30:00Z",
  updatedAt: "2024-12-15T10:30:00Z"
}
```

## 📊 **Certificate Data Structure**

### **Required Fields:**
- `certificateId`: Unique identifier (format: XXX-YYYY-NNN)
- `participantName`: Full name of the participant
- `program`: Internship program name
- `completionDate`: When the program was completed

### **Optional Fields:**
- `issuedDate`: When certificate was issued (defaults to current date)
- `status`: Certificate status (valid, pending, revoked)

### **Example Certificate:**
```json
{
  "certificateId": "PVI-2024-001",
  "participantName": "John Doe",
  "program": "Web Development Internship",
  "completionDate": "December 2024",
  "issuedDate": "2024-12-15",
  "status": "valid",
  "createdAt": "2024-12-15T10:30:00Z",
  "updatedAt": "2024-12-15T10:30:00Z"
}
```

## 🔧 **Certificate ID Format**

### **Standard Format:**
- **Pattern**: `XXX-YYYY-NNN`
- **Example**: `PVI-2024-001`
- **Where**:
  - `XXX`: Organization code (SRI = SentriX)
  - `YYYY`: Year (2024)
  - `NNN`: Sequential number (001, 002, 003...)

### **Validation Rules:**
- Must be exactly 11 characters
- Format: 3 letters + hyphen + 4 digits + hyphen + 3 digits
- Case insensitive (automatically converted to uppercase)

## 📋 **Bulk Certificate Addition**

### **Using Admin Panel:**
1. Add certificates one by one through the admin interface
2. Each certificate is validated before saving
3. Duplicate certificate IDs are prevented

### **Using Database Tools:**
If you have MongoDB Compass or similar:

```javascript
// Bulk insert example
const certificates = [
  {
    certificateId: "PVI-2024-001",
    participantName: "John Doe",
    program: "Web Development Internship",
    completionDate: "December 2024",
    status: "valid"
  },
  {
    certificateId: "PVI-2024-002",
    participantName: "Jane Smith",
    program: "Machine Learning Internship",
    completionDate: "November 2024",
    status: "valid"
  }
  // ... more certificates
];

// Insert into MongoDB
db.certificates.insertMany(certificates);
```

## 🔍 **Verifying Certificates**

### **Public Verification:**
- Users can verify certificates at `/verify.html`
- Enter certificate ID and participant name
- System checks against database

### **Verification Process:**
1. **Input validation** - Check format and required fields
2. **Database lookup** - Search for matching certificate
3. **Name matching** - Case-insensitive participant name search
4. **Response** - Return certificate details or error

### **Example Verification:**
```javascript
// Certificate ID: PVI-2024-001
// Participant Name: John Doe
// Result: Certificate verified successfully
```

## 🛡️ **Security Features**

### **Input Validation:**
- Certificate ID format validation
- Required field checking
- Duplicate prevention
- SQL injection protection

### **Data Protection:**
- All data stored securely in database
- No sensitive data in public code
- Environment variables for database credentials

### **Access Control:**
- Admin panel for authorized users only
- Public verification for certificate holders
- Logging of verification attempts

## 📈 **Monitoring and Analytics**

### **Verification Logs:**
The system logs all verification attempts:
```javascript
{
  certificateId: "PVI-2024-001",
  participantName: "John Doe",
  timestamp: "2024-01-15T10:30:00Z",
  ip: "192.168.1.1",
  found: true
}
```

### **Database Metrics:**
- Total certificates in database
- Verification success rate
- Most verified certificates
- Failed verification attempts

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. Certificate not found:**
- Check certificate ID format
- Verify participant name spelling
- Ensure certificate exists in database

**2. Database connection error:**
- Check MongoDB URI in environment variables
- Verify network access settings
- Test database connectivity

**3. Admin panel not working:**
- Check function deployment
- Verify environment variables
- Check browser console for errors

### **Debugging Steps:**
1. Check Netlify Function logs
2. Verify database connection
3. Test with known valid certificates
4. Check environment variables

## 📞 **Support**

### **For Certificate Issues:**
- Contact: support@sentrix.in.net
- Include certificate ID and participant name
- Provide error messages if available

### **For Technical Issues:**
- Check Netlify Function logs
- Verify database setup
- Test with sample data

---

**Remember**: All certificate data is stored securely in your database and can only be accessed through the verification system or admin panel. 