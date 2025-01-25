# 📄 UpResume - AI-Powered Resume Enhancement Platform

> Transform your career narrative with intelligent resume optimization

<p align="center">
  <img src="UpResume/public/logo.png", width="400", height="400", title="UpResume"/>
</p>
  <div align="center">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/lviffy/upresume">
  <img alt="GitHub license" src="https://img.shields.io/github/license/lviffy/upresume">
  <a href="https://github.com/lviffy/upresumegraphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/lviffy/upresume"></a>
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/lviffy/upresume">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/lviffy/upresume">
</div>
<p align="center">
  <a href="## ✨ Key Features">Features</a> •
  <a href="## 🚀 Getting Started">Installation</a> •
  <a href="## 📁 Project Structure">Project Structure</a> •
  <a href="#required-tools">Required Tools</a>
  <br>
  <br>

<div align="center">


https://github.com/user-attachments/assets/90abfad7-5e19-42b7-8fad-37ae


</div>



## 🎯 Problem Statement
In today's highly competitive job market, candidates often struggle to make their resumes stand out to recruiters and pass Applicant Tracking Systems (ATS). Many resumes are either too generic or fail to highlight the skills and experiences that align with specific job roles. This mismatch often leads to missed opportunities for qualified candidates and creates inefficiencies for recruiters trying to find the right talent.

## 💡 Solution
UpResume is an innovative AI-powered platform that helps job seekers create, optimize, and tailor their resumes for specific job positions. By leveraging advanced AI technologies, we provide intelligent suggestions, content optimization, and real-time feedback to make your resume stand out.

## ✨ Key Features

### Resume Enhancement
- 🤖 AI-powered content suggestions and improvements
- 📊 ATS compatibility scoring and optimization
- 🎨 Professional template selection
- 📝 Smart keyword optimization for job matching

### Smart Analysis
- 📈 Real-time resume score analysis
- 🎯 Job description matching
- 🔍 Keyword gap analysis
- 📋 Industry-specific recommendations

### Customization & Export
- 🎨 Multiple design templates
- 📁 Export to multiple formats (PDF, DOCX)
- 🔄 Version control and history
- 💾 Cloud storage for resume versions

### Advanced Features
- 🌐 Multi-language support
- 📱 Responsive design for all devices
- 🔒 Secure data handling
- 💬 Chat-based resume assistance

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Python3

## 🔧 Tech Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Redux Toolkit
- React Router DOM
- Framer Motion
- Python
- Google Generative AI

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd project
```

### 2. Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration values

### 3. Install Dependencies

```bash
npm install
```

### 4. Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

### 6. Linting

To run the linter:

```bash
npm run lint
```

## 📁 Project Structure

- `/src` - Main application source code
- `/public` - Static assets
- `/pages` - Application pages/routes
- `/backend` - Backend related code
- `/supabase` - Supabase configuration and types
- `/dist` - Production build output

## ℹ️ Additional Information

- The project uses ESLint for code quality
- Tailwind CSS is configured with PostCSS
- TypeScript configurations are split between app and Node environments
- Custom ESLint configuration is provided for better code quality control

## ❓ Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are properly set
2. Clear the `node_modules` and reinstall dependencies
3. Check the `backend.log` file for any backend-related issues
4. Ensure Supabase connection is properly configured

For more detailed information or issues, please refer to the project documentation or create an issue in the repository
