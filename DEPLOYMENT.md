# 🚀 Deployment Guide - NewComanager S2

Since the Railway CLI is not currently available in this terminal session, follow these steps to deploy the enhanced **AI Co-Manager S2** to a new Railway project.

## Prerequisites
- A [Railway](https://railway.app) account.
- GitHub account (recommended) or Railway CLI installed locally.

## Option A: Deploy via GitHub (Recommended)

1.  **Create a Repository**:
    - Create a new empty repository on GitHub (e.g., `new-comanager-s2`).
2.  **Push Code**:
    Run these commands in your `c:\NEW AI COMANAGER\NewComanager_S2` terminal:
    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/new-comanager-s2.git
    git branch -M main
    git push -u origin main
    ```
3.  **Create Project in Railway**:
    - Go to Railway Dashboard -> "New Project" -> "Deploy from GitHub repo".
    - Select `new-comanager-s2`.
4.  **Configure Environment Variables**:
    - Add the variables from your `.env` file (OPENAI_API_KEY, NEXTAUTH_SECRET, etc.).
    - **Database**: Railway will likely ask to add a PostgreSQL database. Add it.
    - Update `DATABASE_URL` in Railway variables to point to this new internal database.
5.  **Build & Deploy**:
    - Railway will automatically detect `railway.json` and deploy.

## Option B: Deploy via Railway CLI (If you have it)

If you have `railway` CLI installed elsewhere or can install it:

1.  **Login**:
    ```powershell
    railway login
    ```
2.  **Initialize Project**:
    ```powershell
    railway init
    # Select "Empty Project" or "New Project"
    ```
3.  **Add Database**:
    ```powershell
    railway add postgresql
    ```
4.  **Link Service**:
    ```powershell
    railway link
    ```
5.  **Deploy**:
    ```powershell
    railway up
    ```

## Post-Deployment Checks
- Run `npx prisma migrate deploy` in the build command (already configured in `railway.json`).
- Verify the app loads at the provided `*.up.railway.app` URL.
