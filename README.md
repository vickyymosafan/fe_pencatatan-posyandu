# Posyandu Lansia - Frontend

Frontend aplikasi Sistem Rekam Medis Digital Posyandu Lansia yang dibangun dengan Next.js 14+, React 18+, TypeScript, dan TailwindCSS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

## ✨ Features

### Admin Features
- 👥 User management (CRUD petugas)
- 👴 Lansia data management
- 🔲 QR code generation and printing
- 📊 Dashboard with statistics and charts
- 📈 Health reports and analytics

### Petugas Features
- 📱 QR code scanning
- 📝 Health examination input
- 📜 Examination history
- 📊 Personal dashboard

### General Features
- 🔐 JWT-based authentication
- 🎨 Responsive design (mobile, tablet, desktop)
- ♿ Accessibility compliant (WCAG 2.1 AA)
- 🌐 Indonesian language interface
- 🔔 Toast notifications
- ⚡ Optimized performance
- 🛡️ Security headers and best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 4
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom wrapper
- **QR Code**: html5-qrcode, qrcode.react
- **Charts**: Recharts
- **PDF Generation**: jspdf, html2canvas
- **Icons**: Lucide React

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Backend API** running and accessible
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
# Windows: notepad .env.local
# Mac/Linux: nano .env.local
```

Update `NEXT_PUBLIC_API_URL` with your backend URL.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Login Credentials

Use the credentials from your backend setup:
- **Admin**: admin@example.com / password123
- **Petugas**: petugas@example.com / password123

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `Sistem Rekam Medis Digital Posyandu Lansia` |
| `NEXT_PUBLIC_DEBUG` | Enable debug mode | `false` |

See `.env.example` for complete list and documentation.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run type-check` | Run TypeScript type checking |
| `npm run build:production` | Full production build (type-check + lint + build) |
| `npm run preview` | Build and preview production locally |
| `npm run clean` | Clean build artifacts and cache |

## 📁 Project Structure

```
fe/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin routes
│   ├── (petugas)/         # Petugas routes
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   └── providers/        # Context providers
├── lib/                   # Utilities and logic
│   ├── api/              # API client and endpoints
│   ├── context/          # React contexts
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── middleware.ts          # Next.js middleware
```

## 💻 Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for complex functions
- Follow the existing code structure

### Component Guidelines

- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper accessibility
- Add loading and error states
- Use semantic HTML

### State Management

- Use React Context for global state
- Use local state for component-specific data
- Implement custom hooks for reusable logic

### API Integration

- Use the centralized API client (`lib/api/client.ts`)
- Handle errors gracefully
- Show loading states
- Display user-friendly error messages

## 🧪 Testing

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Manual Testing

1. Test all user flows
2. Test on different screen sizes
3. Test on different browsers
4. Test error scenarios
5. Test loading states

## 🚢 Deployment

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Detailed Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide including:
- Vercel deployment
- Netlify deployment
- Docker deployment
- Environment configuration
- Post-deployment checklist

### Production Checklist

Before deploying to production, complete the [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- [SETUP.md](./SETUP.md) - Initial setup guide
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Authentication flow
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility guidelines
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [lib/utils/ERROR_HANDLING.md](./lib/utils/ERROR_HANDLING.md) - Error handling system

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

### Commit Convention

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Developer: [Your Name]
- Designer: [Designer Name]
- Project Manager: [PM Name]

## 🆘 Support

For issues or questions:
- Check documentation in `/docs`
- Review [Next.js Documentation](https://nextjs.org/docs)
- Contact development team

## 🔗 Related Projects

- [Backend API](../be) - Express.js backend
- [Documentation](../docs) - Project documentation

---

**Version**: 1.0.0  
**Last Updated**: 2024
