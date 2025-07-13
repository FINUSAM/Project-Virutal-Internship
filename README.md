# SentriX

A virtual internship platform built with HTML, CSS, and JavaScript, deployed on Netlify with serverless functions for form handling.

## Features

- ✅ Responsive design
- ✅ Multiple internship categories
- ✅ Application form with Netlify Functions
- ✅ Email notifications (configurable)
- ✅ Contact form integration
- ✅ SEO optimized

## ⚠️ **Important Security Notice**

This repository is designed for public GitHub deployment. **Never commit sensitive information** like API keys, email passwords, or database credentials to this public repository.

All sensitive data should be configured as **environment variables** in your Netlify dashboard.

## Setup Instructions

### 1. Local Development

```bash
# Install dependencies
npm install

# Run locally with Netlify CLI
npm run dev
```

### 2. Netlify Deployment

1. **Connect your repository to Netlify**
   - Push your code to GitHub/GitLab
   - Connect your repository in Netlify dashboard
   - Deploy automatically

2. **Install dependencies on Netlify**
   - Go to Site settings > Build & deploy > Environment
   - Add build command: `npm install`
   - Add publish directory: `.`

### 3. Email Configuration (Optional)

To enable email notifications for applications, set these environment variables in Netlify:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin email (where to receive applications)
ADMIN_EMAIL=admin@yourdomain.com
```

#### Email Service Options:

**Gmail:**
- SMTP_HOST: smtp.gmail.com
- SMTP_PORT: 587
- Use App Password (not regular password)

**SendGrid:**
- SMTP_HOST: smtp.sendgrid.net
- SMTP_PORT: 587
- Use API key as password

**Mailgun:**
- SMTP_HOST: smtp.mailgun.org
- SMTP_PORT: 587
- Use domain credentials

### 4. Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add the variables listed above

### 5. Testing the Forms

**Application Form:**
1. Deploy to Netlify
2. Navigate to `/apply.html`
3. Fill out the form
4. Check Netlify Function logs in the dashboard

**Certificate Verification:**
1. Deploy to Netlify
2. Navigate to `/verify.html`
3. Use these test certificates:
   - Certificate ID: `PVI-2024-001`, Name: `John Doe`
   - Certificate ID: `PVI-2024-002`, Name: `Jane Smith`
   - Certificate ID: `PVI-2024-003`, Name: `Mike Johnson`
4. Check Netlify Function logs in the dashboard

## File Structure

```
project-intern/
├── index.html                 # Main landing page
├── apply.html                 # Application form
├── verify.html               # Certificate verification page
├── adminoly.html                # Admin panel for certificate management
├── netlify.toml              # Netlify configuration
├── package.json              # Dependencies
├── netlify/
│   └── functions/
│       ├── submit-application.js          # Application form handler
│       ├── submit-application-with-db.js  # Application with database
│       ├── verify-certificate.js          # Certificate verification
│       ├── verify-certificate-with-db.js  # Certificate verification with database
│       ├── add-certificate.js             # Admin function to add certificates
│       └── sendMail.js                    # Contact form handler
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── documentations/           # Detailed documentation
│   ├── DEPLOYMENT.md
│   ├── DATABASE_SETUP.md
│   ├── CERTIFICATE_MANAGEMENT.md
│   └── ENVIRONMENT_VARIABLES.md
└── README.md
```

## 📚 Documentation

For detailed setup and configuration instructions, see the `documentations/` folder:

- **[DEPLOYMENT.md](documentations/DEPLOYMENT.md)** - Complete deployment guide
- **[DATABASE_SETUP.md](documentations/DATABASE_SETUP.md)** - Database configuration
- **[CERTIFICATE_MANAGEMENT.md](documentations/CERTIFICATE_MANAGEMENT.md)** - Certificate system setup
- **[ENVIRONMENT_VARIABLES.md](documentations/ENVIRONMENT_VARIABLES.md)** - Environment variables guide

## Netlify Functions

The application uses Netlify Functions for serverless form processing:

### Application Form Handler
- **Function**: `submit-application.js`
- **Endpoint**: `/.netlify/functions/submit-application`
- **Method**: POST
- **Features**: 
  - Form validation
  - Email notifications
  - Error handling
  - CORS support

### Certificate Verification Handler
- **Function**: `verify-certificate.js`
- **Endpoint**: `/.netlify/functions/verify-certificate`
- **Method**: POST
- **Features**:
  - Certificate validation
  - Database lookup (mock data)
  - Input sanitization
  - Detailed error messages
  - Verification logging

## Customization

### Adding New Internships

1. Edit `index.html` - add new internship cards
2. Update `apply.html` - add options to the dropdown
3. Update the Netlify Function if needed

### Styling

- Main styles: `assets/css/ud-styles.css`
- SCSS source: `assets/scss/` (compile to CSS)
- Responsive design included

### Contact Form

The contact form on the main page uses a separate Netlify Function:
- Function: `sendMail` (referenced in index.html)
- You can create this function similarly to `submit-application.js`

### Admin Panel

The admin panel (`/adminoly.html`) includes authentication:
- **Function**: `admin-auth.js` - Handles login authentication
- **Security**: Requires `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- **Access**: Only authenticated users can add certificates
- **Session**: Uses localStorage for session management (simple implementation)

## Troubleshooting

### Common Issues

1. **Function not found**: Ensure `netlify.toml` is configured correctly
2. **Email not sending**: Check environment variables in Netlify dashboard
3. **CORS errors**: Function includes proper CORS headers
4. **Form validation**: Client and server-side validation implemented

### Debugging

1. Check Netlify Function logs in the dashboard
2. Use browser developer tools to see network requests
3. Test locally with `netlify dev`

## License

MIT License - feel free to use and modify as needed. 