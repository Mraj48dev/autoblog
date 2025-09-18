# AutoBlog

Webapp per l'automazione della produzione e pubblicazione di articoli su blog, siti news e piattaforme WordPress.

## 🚀 Tech Stack

- **Frontend/Backend**: Next.js 14 with App Router, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS + Shadcn/ui
- **Deployment**: Vercel
- **Database Cloud**: Supabase

## 🏗️ Development Setup

1. **Clone e install**:

   ```bash
   git clone <your-repo>
   cd autoblog/app
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Database setup**:

   ```bash
   # Local development (Prisma dev)
   npx prisma dev

   # Or with Supabase
   npx prisma db push
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router
├── modules/                # Feature modules
│   ├── auth/              # Authentication
│   ├── sites/             # Site management
│   ├── sources/           # Content sources
│   ├── automation/        # Automation engine
│   ├── content/           # Content generation
│   ├── publishing/        # Publishing system
│   ├── content-viewer/    # Export/copy-paste
│   ├── payments/          # Billing system
│   └── admin/             # Admin panel
└── shared/                # Shared components/utils
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect Vercel** to your GitHub repository
3. **Set environment variables** in Vercel dashboard
4. **Deploy automatically** on every push

### Environment Variables for Production

```bash
DATABASE_URL="your-supabase-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-app.vercel.app"
```

## 📋 Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prettier` - Format with Prettier

## 🎯 Current Status

**Phase 1 - Foundation MVP**

- ✅ Project Setup (Next.js, TypeScript, Tailwind, Shadcn)
- ✅ Deployment Setup (Vercel + Supabase ready)
- 🔄 Auth Module (in progress)
- ⏳ Dashboard Skeleton
- ⏳ Content Generation
- ⏳ WordPress Integration

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run linting: `npm run lint:fix`
4. Commit with conventional commits
5. Push and create PR

## 📄 License

Private project - All rights reserved.
