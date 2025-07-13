# Admin Panel Setup Guide

## Quick Fix for "Internal Server Error"

The error you're seeing is because the database connection is not configured. Here's how to fix it:

### Option 1: Quick Test (No Database Setup Required)
The updated code now includes a fallback mechanism. When you try to add a certificate, it will work in "mock mode" and show a success message with a note that the database isn't configured.

### Option 2: Full Setup with Database

#### Step 1: Set up MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Set up database access (create a user)
5. Set up network access (allow all IPs: 0.0.0.0/0)
6. Get your connection string

#### Step 2: Configure Environment Variables in Netlify
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/internship_applications?retryWrites=true&w=majority
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
```

#### Step 3: Test the Admin Panel
1. Go to your admin panel: `https://your-site.netlify.app/admin`
2. Login with your admin credentials
3. Try adding a certificate

### Admin Credentials
- **Username**: Set in `ADMIN_USERNAME` environment variable
- **Password**: Set in `ADMIN_PASSWORD` environment variable

### Certificate Format
- **Certificate ID**: Must be in format `XXX-YYYY-NNN` (e.g., PVI-2025-001)
- **Participant Name**: Full name of the participant
- **Program**: Select from the dropdown
- **Completion Date**: Text field (e.g., "December 2024")
- **Issued Date**: Optional, leave empty for current date
- **Status**: Valid/Pending/Revoked

### Troubleshooting

#### If you still get errors:
1. Check Netlify function logs in your dashboard
2. Verify environment variables are set correctly
3. Test database connection
4. Make sure MongoDB Atlas cluster is running

#### Common Issues:
- **"Database not configured"**: Set `MONGODB_URI` environment variable
- **"Authentication required"**: Make sure you're logged in to admin panel
- **"Certificate ID already exists"**: Use a unique certificate ID
- **"Invalid format"**: Follow the XXX-YYYY-NNN format

### Testing Without Database
If you want to test the functionality without setting up a database:
1. The system will automatically use mock mode
2. Certificates will be "added" but not persisted
3. You'll see a note about mock mode in the success message

This allows you to test the interface while you set up the database. 