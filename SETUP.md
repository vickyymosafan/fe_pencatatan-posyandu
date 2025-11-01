# Frontend Setup - Posyandu Lansia

## Project Structure

```
fe/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   ├── ui/                # UI components (Button, Input, Card, etc.)
│   ├── layout/            # Layout components (Navbar, Sidebar)
│   └── features/          # Feature-specific components
├── lib/                   # Utility functions and helpers
│   ├── api/              # API client and endpoints
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── context/          # React Context providers
├── types/                 # TypeScript type definitions
└── public/               # Static assets

```

## Technology Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5+
- **Styling**: TailwindCSS 4
- **QR Code**: html5-qrcode, qrcode.react
- **Charts**: Recharts
- **PDF**: jspdf, html2canvas
- **Icons**: lucide-react

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Design System

### Colors
- Neutral palette (neutral-50 to neutral-950)
- No dark mode, single theme

### Typography
- Font: Montserrat (300, 400, 500, 600, 700)

### Components
- Custom shadow: `shadow-custom`
- Border radius: `rounded-xl` or `rounded-2xl`
- Transitions: `transition-all duration-300 ease-in-out`

### Responsive Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px
