# Lansia Management Components

Feature-specific components for lansia (elderly) data management with CRUD operations.

## Components

### CreateLansiaModal

Modal for creating a new lansia record with 7 form fields.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onSubmit`: (data: CreateLansiaRequest) => Promise<void> - Callback when form is submitted
- `isLoading`: boolean (optional) - Loading state for submit button

**Form Fields:**
1. Nama Lengkap (required)
2. NIK - 16 digits (required)
3. Tanggal Lahir (required)
4. Alamat - textarea (required)
5. Penyakit Bawaan - textarea (optional)
6. Kontak Keluarga - phone (required)

**Features:**
- Form validation (NIK format, date validation)
- Textarea support for long text fields
- Error display for each field
- Auto-close on successful submit

**Usage:**
```tsx
<CreateLansiaModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleCreate}
  isLoading={isSubmitting}
/>
```

### EditLansiaModal

Modal for editing an existing lansia record.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onSubmit`: (id: string, data: UpdateLansiaRequest) => Promise<void> - Callback when form is submitted
- `lansia`: Lansia | null - Lansia data to edit
- `isLoading`: boolean (optional) - Loading state for submit button

**Features:**
- Pre-filled form with lansia data
- Date formatting for input field
- Form validation
- Only sends changed fields to API

**Usage:**
```tsx
<EditLansiaModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleUpdate}
  lansia={selectedLansia}
  isLoading={isSubmitting}
/>
```

### DeleteConfirmModal

Confirmation dialog for deleting a lansia record.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onConfirm`: (id: string) => Promise<void> - Callback when deletion is confirmed
- `lansia`: Lansia | null - Lansia to delete
- `isLoading`: boolean (optional) - Loading state for confirm button

**Features:**
- Warning message with lansia details (nama, NIK, age)
- Additional warning about related pemeriksaan deletion
- Danger styling (red theme)
- Age calculation display

**Usage:**
```tsx
<DeleteConfirmModal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleDelete}
  lansia={selectedLansia}
  isLoading={isSubmitting}
/>
```

### QRCodeModal

Modal for displaying QR code after successful lansia creation.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `lansia`: Lansia | null - Lansia with QR code

**Features:**
- Success message display
- QR code image display (250x250px)
- Lansia info (nama, NIK)
- Print button for QR code
- Informational note about QR code usage

**Usage:**
```tsx
<QRCodeModal
  isOpen={isOpen}
  onClose={handleClose}
  lansia={createdLansia}
/>
```

## Design Principles

- **Separation of Concerns**: Modals are presentational components, business logic stays in the page
- **Reusability**: All modals can be used in different contexts
- **Validation**: Client-side validation before API calls
- **Accessibility**: Proper ARIA labels, keyboard navigation, focus management
- **User Feedback**: Clear error messages and loading states
- **Consistency**: Follows same pattern as user management components

## Form Validation Rules

### NIK (Nomor Induk Kependudukan)
- Required for create
- Must be exactly 16 digits: `/^\d{16}$/`
- Numeric only

### Tanggal Lahir
- Required for create
- Cannot be in the future
- Date format validation

### Nama
- Required for create
- Cannot be empty string

### Alamat
- Required for create
- Textarea field for long addresses
- Cannot be empty string

### Kontak Keluarga
- Required for create
- Phone number format
- Cannot be empty string

### Penyakit Bawaan
- Optional field
- Textarea for multiple conditions
- Can be empty

## Age Calculation

The age is calculated from `tanggal_lahir` using the following logic:
```typescript
const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
```

## QR Code Integration

After successful lansia creation:
1. Backend generates QR code automatically
2. QR code URL is returned in response (`qr_code_url`)
3. QRCodeModal displays the generated QR code
4. User can print or close the modal
5. QR code can be accessed later from QR Code page
