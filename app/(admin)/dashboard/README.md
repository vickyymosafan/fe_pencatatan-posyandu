# Admin Dashboard

Admin dashboard page displaying system statistics, activity charts, and recent pemeriksaan.

## Features

### Statistics Cards
- Total Lansia (blue)
- Total Petugas (green)
- Pemeriksaan Bulan Ini (purple)
- Petugas Aktif (orange)

### Activity Chart
- Line chart showing pemeriksaan trends over 6 months
- Built with Recharts library
- Responsive design

### Recent Pemeriksaan
- Table showing 10 most recent pemeriksaan records
- (To be implemented in future tasks)

## Data Flow

1. Component mounts → `useEffect` triggers
2. `fetchDashboardData()` calls `getDashboardStats()` from API
3. Loading state shows skeleton placeholders
4. Data received → renders stat cards and chart
5. Error handling with toast notifications

## Components Used

- `StatCard` - Custom dashboard component
- `Card` - Generic UI component
- `Skeleton` - Loading placeholder
- `LineChart` from Recharts - Data visualization

## API Integration

Endpoint: `GET /api/laporan/dashboard`

Response:
```typescript
{
  totalLansia: number;
  totalPetugas: number;
  pemeriksaanBulanIni: number;
  petugasAktif: number;
  pemeriksaanPerBulan: Array<{
    bulan: string;
    jumlah: number;
  }>;
  rataRataKesehatan: {
    tekananDarah: number;
    gulaDarah: number;
    kolesterol: number;
  };
}
```

## Responsive Design

- Mobile (< 768px): 1 column grid
- Tablet (768px - 1024px): 2 columns grid
- Desktop (> 1024px): 4 columns grid

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
