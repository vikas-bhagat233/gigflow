# Frontend Deployment Guide

## Vercel Deployment

### Prerequisites
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Push your code to GitHub

### Steps

1. **Build Configuration**
```json
// In your frontend package.json, ensure you have:
{
  "scripts": {
    "build": "vite build"
  }
}