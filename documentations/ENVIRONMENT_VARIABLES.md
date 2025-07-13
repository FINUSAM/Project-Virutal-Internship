# Environment Variables

This document lists all the environment variables required for the SentriX application.

## Email Configuration

### Required for Email Functionality
- `EMAIL_HOST` - SMTP server host (e.g., "smtp.gmail.com")
- `EMAIL_PORT` - SMTP server port (e.g., 587)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - Email password or app-specific password
- `EMAIL_FROM` - From email address (usually same as EMAIL_USER)

### Example Email Configuration
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## Database Configuration

### MongoDB Atlas (Recommended)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name (e.g., "virtual-internship")

### Supabase
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### PlanetScale
- `DATABASE_URL` - PlanetScale connection string

### Fauna
- `FAUNA_SECRET` - Fauna secret key

## Application Configuration

### Admin Panel Authentication
- `ADMIN_USERNAME` - Username for admin panel access
- `ADMIN_PASSWORD` - Password for admin panel access

### Optional Settings
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Setup Instructions

### 1. Local Development
Create a `.env` file in your project root:
```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Database Configuration (Choose one)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=virtual-internship

# Or for Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Or for PlanetScale
DATABASE_URL=mysql://username:password@host/database

# Or for Fauna
FAUNA_SECRET=your-fauna-secret

# Admin Panel Authentication
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password

# Application Settings
NODE_ENV=development
LOG_LEVEL=debug
```

### 2. Netlify Deployment
Set environment variables in Netlify dashboard:
1. Go to your site settings
2. Navigate to "Environment variables"
3. Add each variable with its corresponding value

## Testing Environment Variables

### Test Email Configuration
```bash
# Test email sending
curl -X POST https://your-site.netlify.app/.netlify/functions/submit-application \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","message":"Test message"}'
```

### Test Database Connection
```bash
# Test database operations
curl -X POST https://your-site.netlify.app/.netlify/functions/add-certificate \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","certificateId":"TEST123","issueDate":"2024-01-01"}'
```

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check EMAIL_HOST and EMAIL_PORT
   - Verify EMAIL_USER and EMAIL_PASS
   - For Gmail, use app-specific password
   - Check firewall/network restrictions

2. **Database Connection Failed**
   - Verify connection string format
   - Check network access (IP whitelist)
   - Ensure database exists and is accessible
   - Check authentication credentials

3. **Environment Variables Not Loading**
   - Restart Netlify functions after adding variables
   - Check variable names (case-sensitive)
   - Verify no extra spaces in values

### Debug Mode
Set `LOG_LEVEL=debug` to see detailed logs:
```bash
LOG_LEVEL=debug
```

## Security Best Practices

### 1. Never Commit Secrets
- Keep `.env` files in `.gitignore`
- Use environment variables for all secrets
- Never hardcode credentials in code

### 2. Use Strong Passwords
- Generate strong, unique passwords
- Use app-specific passwords for email
- Rotate credentials regularly

### 3. Limit Access
- Use read-only database users when possible
- Implement proper authentication
- Monitor access logs

### 4. Environment Separation
- Use different credentials for dev/staging/prod
- Test with production-like data
- Validate all configurations

## Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EMAIL_HOST` | Yes | SMTP server host | smtp.gmail.com |
| `EMAIL_PORT` | Yes | SMTP server port | 587 |
| `EMAIL_USER` | Yes | Email username | user@gmail.com |
| `EMAIL_PASS` | Yes | Email password | app-password |
| `EMAIL_FROM` | Yes | From email address | user@gmail.com |
| `MONGODB_URI` | Yes* | MongoDB connection string | mongodb+srv://... |
| `DB_NAME` | Yes* | Database name | virtual-internship |
| `SUPABASE_URL` | Yes* | Supabase project URL | https://... |
| `SUPABASE_ANON_KEY` | Yes* | Supabase anonymous key | eyJ... |
| `DATABASE_URL` | Yes* | PlanetScale connection string | mysql://... |
| `FAUNA_SECRET` | Yes* | Fauna secret key | fn... |
| `ADMIN_USERNAME` | Yes | Admin panel username | admin |
| `ADMIN_PASSWORD` | Yes | Admin panel password | secure-password |
| `NODE_ENV` | No | Environment | production |
| `LOG_LEVEL` | No | Logging level | debug |

*Choose one database option based on your preference.

## Next Steps

1. Set up your chosen database (see [DATABASE_SETUP.md](./DATABASE_SETUP.md))
2. Configure email settings
3. Deploy to Netlify (see [DEPLOYMENT.md](./DEPLOYMENT.md))
4. Test all functionality
5. Monitor logs and performance 