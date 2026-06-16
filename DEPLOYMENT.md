# TheFrontDesk - Deployment Guide

## GitHub Pages Deployment (Recommended)

### Step 1: Repository Setup
1. Create a GitHub repository named `TheFrontDesk`
2. Push all files to the `main` branch
3. Ensure the repository is **public**

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to the **Pages** section
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Wait for Deployment
- GitHub Pages will automatically deploy your site
- This typically takes 1-2 minutes
- Check the **Environments** tab to see deployment status

### Step 4: Access Your Site
- Your site will be available at: `https://Ceebree148102.github.io/TheFrontDesk/`
- GitHub will display the URL in the Pages section

### Step 5: Custom Domain (Optional)
1. Go to Settings > Pages
2. Under "Custom domain", enter your domain
3. Update DNS records at your domain provider
4. GitHub will handle HTTPS automatically

---

## Alternative: Netlify Deployment

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub
4. Authorize and select your repository

### Step 2: Configure Settings
- **Build command**: Leave empty (static site)
- **Publish directory**: `.` (root directory)
- Click **Deploy site**

### Step 3: Access Your Site
- Netlify will assign a URL automatically
- You can customize the subdomain
- Add custom domain in Site settings

---

## Alternative: Vercel Deployment

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository

### Step 2: Configure
- Framework: Select "Other"
- Root Directory: `.`
- Click **Deploy**

### Step 3: Access Your Site
- Vercel will provide a deployment URL
- Custom domain can be added in Project Settings

---

## File Structure for Hosting

Ensure your repository has this structure:

```
TheFrontDesk/
├── index.html
├── README.md
├── DEPLOYMENT.md
├── .gitignore
├── css/
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── main.js
│   └── animations.js
└── pages/
    ├── privacy.html
    ├── terms.html
    └── cookies.html
```

---

## SSL/HTTPS

- **GitHub Pages**: Automatic HTTPS ✅
- **Netlify**: Automatic HTTPS ✅
- **Vercel**: Automatic HTTPS ✅
- **Custom Server**: Configure SSL certificate

---

## Performance Tips

1. **Images**: Optimize and compress before uploading
2. **CSS**: Minify for production
3. **JavaScript**: Use async loading where possible
4. **Caching**: GitHub Pages caches automatically

---

## Troubleshooting

### 404 Error After Deployment
- Check if `index.html` is in the root directory
- Verify file paths are relative (not absolute)
- Clear browser cache

### Styles Not Loading
- Check if CSS files are in correct folders
- Verify relative paths in HTML: `href="css/styles.css"`
- Ensure case sensitivity matches file names

### Forms Not Working
- Forms are client-side only
- Check browser console for JavaScript errors
- Test in different browsers

### Slow Loading
- Check file sizes
- Optimize images
- Enable caching headers
- Use CDN for assets

---

## Environment Variables

For this static site, no environment variables are needed. When you add backend functionality later:

```bash
# GitHub Secrets (for CI/CD)
Go to Settings > Secrets and variables > Actions
```

---

## Monitoring

### GitHub Pages
- Check deployment status in Settings > Pages
- View build logs in Actions tab

### Netlify
- Dashboard shows deployment history
- Real-time deploy logs available

### Vercel
- Deployment analytics in dashboard
- Performance metrics available

---

## Updates & Maintenance

1. Make changes locally
2. Commit to git: `git add . && git commit -m "Update"`
3. Push to GitHub: `git push origin main`
4. Hosting platform auto-deploys (usually within 1-2 minutes)

---

## Domain Setup Examples

### Pointing Domain to GitHub Pages
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
```

### Pointing Domain to Netlify
```
A Record: 75.75.75.75
```

### Pointing Domain to Vercel
- Use Vercel Nameservers (recommended)
- Or point CNAME to provided Vercel URL

---

## Security Checklist

- ✅ HTTPS enabled
- ✅ No hardcoded secrets
- ✅ No sensitive data in code
- ✅ External links use HTTPS
- ✅ Form validation implemented
- ✅ No local file access

---

## Next Steps

1. Deploy the website
2. Test all links and forms
3. Test on mobile devices
4. Share URL with users
5. Monitor analytics (add later)
6. Plan backend integration (optional)

---

For more help, visit the GitHub Pages documentation:
https://docs.github.com/en/pages
