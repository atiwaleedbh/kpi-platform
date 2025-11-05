# 🎯 KPI Management Platform

> **Enterprise-grade KPI tracking system built with Next.js 14 and Supabase**

A comprehensive, dynamic platform for manufacturing plants and organizations to track, analyze, and improve Key Performance Indicators (KPIs) across hierarchical departments.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

---

## 🌟 Key Features

### ✅ **Phase 1: Foundation (Complete)**
- ✨ Modern Next.js 14 with App Router
- 🔐 Supabase authentication & authorization
- 💾 Comprehensive PostgreSQL database schema
- 🎨 Tailwind CSS + shadcn/ui components
- 📱 Fully responsive design
- 🔒 Row Level Security (RLS) policies
- 📊 TypeScript for type safety

### 🚧 **Phase 2: Core Features (Ready to Build)**
- 🏢 Department hierarchy management (cascading structure)
- 📈 Dynamic KPI definitions
- ✍️ Manual data entry interface
- 🧮 Calculation engine (KPI formulas)
- 📊 Basic dashboards with visualizations
- 👥 Role-based access control
- 🎯 Target vs Actual tracking with color coding

### 📋 **Phase 3: Advanced Features (Infrastructure Ready)**
- ⛓️ Cascading KPIs (roll up from lines → departments → plant)
- 🎛️ Dynamic dashboard builder (drag & drop widgets)
- 📈 Advanced visualizations (charts, gauges, heatmaps)
- 🔄 Real-time updates via Supabase subscriptions
- 📤 Data export (CSV, Excel, PDF)
- 📧 Alerts & notifications

### 🔮 **Phase 4: Future Enhancements (Database Ready)**
- 🔌 API integrations (REST, MQTT, OPC-UA)
- 🏭 Automated data collection from machines
- 🔍 Lean tools integration (Fishbone, 5 Whys, Pareto)
- 🤖 AI-powered insights (GPT integration)
- 💡 Smart KPI issue diagnosis
- 📱 Mobile applications

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- Git
- Supabase account (free)
- Code editor (VS Code recommended)

### **Installation**

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/kpi-platform.git
cd kpi-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### **Database Setup**

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Go to SQL Editor
3. Copy and run the contents of `supabase-schema.sql`
4. Create your first user in Authentication
5. Add user profile with super_admin role

**Full setup guide:** See `SETUP_GUIDE.md` for detailed step-by-step instructions

---

## 📂 Project Structure

```
kpi-platform/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Base UI components
├── lib/                  # Utilities
│   ├── supabase/        # Supabase clients
│   └── utils.ts         # Helper functions
├── types/               # TypeScript types
├── supabase-schema.sql  # Database schema
├── ARCHITECTURE.md      # Architecture docs
└── SETUP_GUIDE.md       # Beginner guide
```

---

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full platform access & configuration |
| **Admin** | Manage KPIs, departments, users |
| **Manager** | View department KPIs, drill down |
| **Operator** | Enter data for assigned KPIs |
| **Viewer** | Read-only dashboard access |

---

## 🎨 KPI Status Colors

| Performance | Color | Status |
|------------|-------|--------|
| 100%+ | 🟢 Green | Excellent |
| 90-99% | 🟡 Yellow | Good |
| 75-89% | 🟠 Orange | Warning |
| < 75% | 🔴 Red | Critical |

---

## 🏭 Use Case Example

**Manufacturing Plant:**
```
Plant Manager Dashboard
└── Overall Plant OEE: 82% 🟡
    ├── Production Dept: 85% 🟢
    │   ├── Line 1: 88% 🟢
    │   └── Line 2: 82% 🟡
    └── Quality Dept: 89% 🟡
```

**Workflow:**
1. Operator enters hourly data
2. Line KPI auto-calculates
3. Department average updates
4. Plant-level KPI rolls up
5. Dashboards refresh in real-time

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| `README.md` | This file - overview & quick start |
| `ARCHITECTURE.md` | Complete system architecture |
| `SETUP_GUIDE.md` | Detailed beginner-friendly setup |
| `supabase-schema.sql` | Database schema with comments |

---

## 🛠️ Development

```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Production server
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

---

## 🚢 Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy! ✨

Your app will be live at `https://your-project.vercel.app`

---

## 🎯 Next Steps

After setup:
1. ✅ Review `ARCHITECTURE.md` for system overview
2. ✅ Follow `SETUP_GUIDE.md` for detailed setup
3. ✅ Create your first department
4. ✅ Define KPIs for your organization
5. ✅ Start tracking performance!

---

## 📝 License

MIT License

---

## 🙏 Acknowledgments

Built with:
- ⚡ Next.js by Vercel
- 🔥 Supabase
- 🎨 Tailwind CSS
- 🧩 Radix UI
- 📊 Recharts

---

**Made for manufacturing excellence** 🏭✨

**Questions?** See `SETUP_GUIDE.md` or open an issue!
