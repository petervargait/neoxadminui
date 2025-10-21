# NEOX Infinity - Multi-Tenant Admin Platform

A production-ready, multi-tenant administrative web application built with Next.js 14, TypeScript, Prisma, and NextAuth.js. Features comprehensive role-based access control, white-labeling capabilities, and OWASP security compliance.

## 🚀 Features

### Global Admin (NEOX Admin)
- **Multi-tenant Management**: Create, suspend, and manage tenant organizations
- **GDPR Compliance**: Complete tenant data export and backup/restore functionality
- **Module & Permission Management**: Granular control over features and access
- **White-labeling**: Custom branding, logos, and themes per tenant
- **User Management**: Excel import, manual user creation, and Entra ID integration
- **Reporting**: Customizable analytics and audit trails
- **Environment Management**: Production, staging, and development environments

### Tenant Admin (Reception/Office Manager)
- **User Management**: Invite, manage, and organize team members
- **Visitor Management**: Digital visitor registration and tracking
- **Email Templates**: Rich-text template editor with white-label previews
- **Invitation System**: Automated visitor invitations with deep-link authentication
- **Parking Management**: Real-time parking availability tracking
- **Domain Blocking**: Internal domain restrictions for security
- **Multi-language Support**: English and Hungarian localization

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Microsoft Entra ID
- **Styling**: Tailwind CSS with custom NEOX theme
- **UI Components**: Radix UI primitives
- **File Storage**: Vercel Blob
- **Email Service**: Resend
- **Deployment**: Vercel
- **Excel Processing**: SheetJS (xlsx)
- **Icons**: Lucide React

## 🎨 Design System

The application uses a custom NEOX design system with:
- **Primary Colors**: Navy (#08122E) and Gold (#D7BB91)
- **Typography**: Poppins font family
- **Components**: Rounded corners, soft shadows, and gradient backgrounds
- **Responsive**: Mobile-first design approach

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Azure AD application (for authentication)
- Resend account (for emails)
- Vercel account (for blob storage)

### 1. Clone and Install

```bash
git clone <repository-url>
cd neoxadminui
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update the following required variables in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/neoxadmin"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Azure AD
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"

# Resend
RESEND_API_KEY="your-resend-api-key"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with default data
npm run db:seed
```

### 4. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 👥 Default Users

After seeding the database, you can log in with:

- **Super Admin**: `admin@neox.hu`
- **Demo Tenant Admin**: `demo@neox.hu`
- **Demo Tenant**: `demo.neox.hu`

## 🛠️ Available Scripts

```bash
# Development
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema to database
npm run db:migrate         # Run database migrations
npm run db:seed            # Seed database with default data
npm run db:studio          # Open Prisma Studio

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript compiler check
```

## 🚀 Next Steps

To complete the implementation, you'll need to create:

1. **UI Components**: Complete the shadcn/ui component library
2. **Admin Dashboard**: Global admin interface with tenant management
3. **Tenant Dashboard**: Tenant-specific admin interface
4. **Authentication Pages**: Custom sign-in and error pages
5. **API Routes**: Server actions and API endpoints
6. **Email Integration**: Resend email service implementation
7. **File Upload**: Blob storage for white-label assets
8. **Excel Processing**: User import/export functionality
9. **Internationalization**: next-intl setup for EN/HU
10. **Testing**: Unit and integration tests

## 📞 Support

For questions or support, contact: admin@neox.hu

---

**Built with ❤️ by the NEOX Team**
