# Deployment & Domain Connection Guide

This guide covers how to deploy the User Journey Mapping Tool and connect a custom domain.

## Deployment Options

Since this is a standard **Vite + React** application, it can be hosted on any static site provider. We recommend **Vercel** or **Netlify** for the easiest setup.

### Option 1: Vercel (Recommended)

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2.  **Add New Project**: Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select the `user-journey` repository from your list.
4.  **Configure Project**:
    -   **Framework Preset**: It should automatically detect **Vite**.
    -   **Root Directory**: Leave as `./`.
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).
5.  **Deploy**: Click **"Deploy"**. Vercel will build your site and give you a live URL (e.g., `user-journey.vercel.app`).

### Option 2: Netlify

1.  **Sign Up/Login**: Go to [netlify.com](https://netlify.com/) and sign in.
2.  **Add New Site**: Click **"Add new site"** -> **"Import from specific git provider"**.
3.  **Select Repository**: Choose GitHub and select `user-journey`.
4.  **Build Settings**:
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`
5.  **Deploy**: Click **"Deploy site"**.

---

## Connecting a Custom Domain

Once your site is deployed, you can connect your own domain (e.g., `www.my-journey-tool.com`).

### If Using Vercel:

1.  Go to your project dashboard on Vercel.
2.  Navigate to **Settings** -> **Domains**.
3.  Enter your domain name (e.g., `example.com`) and click **Add**.
4.  **DNS Configuration**: Vercel will verify if you own the domain.
    -   If you bought the domain elsewhere (GoDaddy, Namecheap, etc.), Vercel will give you **Nameservers** or **A/CNAME records**.
    -   Log in to your domain registrar, find the DNS settings, and add the records provided by Vercel.
5.  Wait for propagation (usually minutes, but can take up to 48 hours).

### If Using Netlify:

1.  Go to your site dashboard on Netlify.
2.  Click **"Domain management"** (or "Site settings" -> "Domain management").
3.  Click **"Add a domain"** and verify it.
4.  **DNS Configuration**: Follow the instructions to update your DNS records at your registrar to point to Netlify.

### If Hosting Manually (e.g., Apache/Nginx):

1.  Build the project locally:
    ```bash
    npm run build
    ```
2.  Upload the contents of the `dist/` folder to your web server's public directory.
3.  Configure your server to serve `index.html` for all routes (SPA fallback).
    -   **Nginx Example**:
        ```nginx
        location / {
          try_files $uri $uri/ /index.html;
        }
        ```
