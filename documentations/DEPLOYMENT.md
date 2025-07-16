# Deployment Guide: Public GitHub to Netlify

This guide covers deploying your CyberSync site from a public GitHub repository to Netlify.

## 🚀 **Step-by-Step Deployment**

### **1. Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: CyberSync"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### **2. Connect to Netlify**

1. **Go to [Netlify](https://netlify.com)**
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize Netlify
4. **Select your repository**
5. **Configure build settings:**
   - **Build command**: `npm install`
   - **Publish directory**: `.`
   - **Base directory**: (leave empty)

### **3. Set Environment Variables in Netlify**

**IMPORTANT**: Never commit these to your public repo!

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```bash
# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com

# Add any other sensitive data here
```

### **4. Deploy**

1. **Netlify will automatically deploy** when you push to GitHub
2. **Check the deployment** in the Netlify dashboard
3. **Test your functions**:
   - Go to `/apply.html` and submit a test application
   - Go to `/verify.html` and test certificate verification

## 🔐 **Security Best Practices**

### **What's Safe to Commit:**
✅ HTML, CSS, JavaScript files  
✅ Static assets (images, fonts)  
✅ Configuration files (netlify.toml, package.json)  
✅ Netlify Functions (without sensitive data)  

### **What's NOT Safe to Commit:**
❌ Environment variables (.env files)  
❌ API keys or secrets  
❌ Database credentials  
❌ Personal information  

### **Environment Variables in Netlify:**
- **SMTP_HOST**: Your email server
- **SMTP_USER**: Your email username
- **SMTP_PASS**: Your email password/app key
- **ADMIN_EMAIL**: Where to receive applications

## 🧪 **Testing Your Deployment**

### **Test Application Form:**
1. Visit `https://your-site.netlify.app/apply.html`
2. Fill out the form
3. Check Netlify Function logs in dashboard

### **Test Certificate Verification:**
1. Visit `https://your-site.netlify.app/verify.html`
2. Use test certificates:
   - ID: `PVI-2024-001`, Name: `John Doe`
   - ID: `PVI-2024-002`, Name: `Jane Smith`

### **Check Function Logs:**
1. Go to Netlify dashboard
2. Navigate to **Functions** tab
3. Click on function name to see logs

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. Functions not working:**
- Check Netlify Function logs
- Ensure `netlify.toml` is configured correctly
- Verify environment variables are set

**2. Email not sending:**
- Check SMTP credentials in environment variables
- Verify email service settings
- Check function logs for errors

**3. Build errors:**
- Ensure `package.json` is in root directory
- Check build command in Netlify settings
- Verify all dependencies are listed

### **Useful Commands:**

```bash
# Test locally with Netlify CLI
npm install -g netlify-cli
netlify dev

# Check function logs
netlify functions:list
netlify functions:invoke submit-application --data '{"test": "data"}'
```

## 📝 **Custom Domain (Optional)**

1. Go to **Domain settings** in Netlify
2. Add your custom domain
3. Configure DNS settings
4. Enable HTTPS (automatic with Netlify)

## 🔄 **Continuous Deployment**

Your site will automatically redeploy when you:
- Push to the `main` branch
- Create a pull request
- Merge pull requests

## 📊 **Monitoring**

- **Function logs**: Check Netlify dashboard
- **Site analytics**: Available in Netlify dashboard
- **Error tracking**: Check function logs for issues

## 🆘 **Support**

If you encounter issues:
1. Check Netlify Function logs
2. Verify environment variables
3. Test functions locally with `netlify dev`
4. Check Netlify documentation

---

**Remember**: Your code is public, but your sensitive data (emails, API keys) should only be in Netlify's environment variables! 