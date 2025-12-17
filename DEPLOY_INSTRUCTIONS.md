# Deploying Your MERN Stack Application

This guide explains how to deploy your "Story Nest" application. Since this is a MERN stack app (MongoDB, Express, React, Node.js), it's often best to deploy the **Frontend** and **Backend** separately.

**Recommended Platform: Vercel** (for both frontend and backend) or **Render** (for backend) + **Vercel** (for frontend).

## Option 1: Deploying Both on Vercel (Easiest for quick start)

I have created `vercel.json` configuration files for both your client and server folders to make this easier.

### Step 1: Push your code to GitHub
Make sure your code is pushed to a GitHub repository.

### Step 2: Deploy the Backend (Server)
1.  Go to [Vercel](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your repository.
4.  **Important**: In the "Root Directory" setting, click "Edit" and select `client/server`.
5.  In "Environment Variables", add:
    *   `MONGO_URI`: `mongodb+srv://Mobeen:Mobeen@cluster0.nzopyhk.mongodb.net/blogingweb` (Make sure usage of this IP is whitelisted in MongoDB Atlas or allow access from anywhere `0.0.0.0/0`)
    *   `CLIENT_URL`: `https://your-frontend-url.vercel.app` (You will update this later after deploying frontend)
6.  Click **Deploy**.
7.  Once deployed, copy the **domain** assigned to your backend (e.g., `https://your-server-app.vercel.app`).

### Step 3: Configure Frontend to use Deployed Backend
1.  Go to configuration (or set environment variable in Vercel).
2.  The app is configured to look for `VITE_API_BASE_URL`.

### Step 4: Deploy the Frontend (Client)
1.  Go to Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the **same** repository again.
4.  **Important**: In the "Root Directory" setting, click "Edit" and select `client`.
5.  In "Environment Variables", add:
    *   `VITE_API_BASE_URL`: Paste the backend URL from Step 2 (e.g., `https://your-server-app.vercel.app`).
6.  Click **Deploy**.

## Option 2: Deploy Backend on Render (Better for sockets/full Node server)

Since Vercel is serverless, sometimes a dedicated Node server on Render is better for things like file uploads if they are stored locally.

**CRITICAL NOTE ON IMAGES:** 
You are currently storing images in a local `uploads` folder. **This will NOT persist** on serverless platforms like Vercel or ephemeral instances like Render free tier.
*   **Solution**: Use a cloud storage service like **Cloudinary**, **AWS S3**, or **Firebase Storage** for production image uploads.
*   If you deploy as is, uploaded images will disappear when the server restarts.

### Steps for Render:
1.  Create a `render.yaml` or just connect your repo on Render.com.
2.  **Root Directory**: `client/server`
3.  **Build Command**: `npm install`
4.  **Start Command**: `node index.js`
5.  Add Environment Variables (`MONGO_URI`).

## Final Step
Update your MongoDB Atlas Network Access to allow `0.0.0.0/0` (Allow access from anywhere) so that your deployed server can connect to it.
