# Climate Finance & Taxonomy Dashboard

A production-ready Next.js dashboard for **Transition Finance** (PGIM private portfolio) and **Resilience Finance** (Vadodara Municipal Corporation), aligned to EU Taxonomy, Climate Bonds Initiative, and Science-Based Targets.

---

## Features

### PGIM – Transition Finance Tab
- **KPI Cards**: Total Portfolio Value · % EU Taxonomy Aligned · Green Revenue % · Transition Assets %
- **Alignment Pie Chart**: Aligned vs non-aligned (revenue-weighted)
- **Sector Bar Chart**: Average taxonomy alignment per sector with 67% target line
- **Emissions Trajectory**: Actual vs Science-Based Target vs Business-As-Usual (2019–2030)
- **Portfolio Table**: Sortable by any column, with alignment bars and transition score dots
- **Filters**: Sector dropdown + alignment threshold slider
- **CSV Export**: Download filtered portfolio data

### VMC – Resilience Finance Tab

**A) EU Taxonomy Budget Mapping**
- Budget by sector (stacked bar: aligned vs non-aligned)
- Taxonomy alignment pie chart
- Sector-level alignment table with status badges

**B) Climate Resilience Framework**
- Multi-hazard risk radar chart (Flood · Heat · Water · Storm · Drought)
- Zone selector for comparative analysis
- Color-coded risk heatmap table

**C) Climate Bond Readiness Toolkit (CBRT)**
- Project prioritisation bubble chart (X = Risk, Y = Impact, size = Budget)
- CBRT-eligible project list with priority scores
- CSV export

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Framework   | Next.js 14 (App Router, TypeScript)  |
| Styling     | Tailwind CSS v3                      |
| Charts      | Recharts v2                          |
| Excel       | SheetJS (xlsx v0.18)                 |
| Icons       | Lucide React                         |
| Deployment  | Vercel                               |

---

## Data Sources

| File | Location | Description |
|------|----------|-------------|
| `PGIM_Transition_Finance_Toolkit.xlsx` | `/PGIM/` | Private portfolio transition finance data |
| `EU_Taxonomy_VMC_Budget_Mapping.xlsx` | `/VMC/` | Vadodara municipal budget EU Taxonomy mapping |
| `VMC_Climate_Resilience_Finance_Framework.xlsx` | `/VMC/` | Climate risk scores by urban zone |
| `VMC_CBRT_Budget_Mapping.xlsx` | `/VMC/` | Climate Bond Readiness Toolkit project data |

> **Note**: If Excel files cannot be parsed (e.g., unexpected column names), the dashboard falls back to realistic sample data. A badge in the top-right of each tab indicates whether you're viewing Excel data or sample data.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Climate-Adaptation-Resillience-finance-Taxonomy

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment on Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"** → Import your GitHub repo
4. Vercel auto-detects Next.js — no configuration needed
5. Click **"Deploy"**
6. Your dashboard is live at `https://<your-project>.vercel.app`

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

> **Note**: No environment variables are required. The Excel files are bundled in the repository and parsed server-side by API routes.

---

## Project Structure

```
/
├── PGIM/
│   └── PGIM_Transition_Finance_Toolkit.xlsx
├── VMC/
│   ├── EU_Taxonomy_VMC_Budget_Mapping.xlsx
│   ├── VMC_Climate_Resilience_Finance_Framework.xlsx
│   └── VMC_CBRT_Budget_Mapping.xlsx
├── app/
│   ├── page.tsx                    # Landing page + tab routing
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + custom styles
│   ├── types/index.ts              # TypeScript interfaces
│   ├── api/
│   │   ├── pgim/route.ts           # PGIM Excel parser API
│   │   └── vmc/route.ts            # VMC Excel parser API
│   └── components/
│       ├── Header.tsx
│       ├── TabNav.tsx
│       ├── KPICard.tsx
│       ├── LoadingSpinner.tsx
│       ├── DownloadCSV.tsx
│       ├── DataSourceBadge.tsx
│       ├── pgim/
│       │   ├── PGIMDashboard.tsx
│       │   ├── PortfolioTable.tsx
│       │   ├── SectorFilter.tsx
│       │   └── charts/
│       │       ├── AlignmentPieChart.tsx
│       │       ├── SectorBarChart.tsx
│       │       └── EmissionsLineChart.tsx
│       └── vmc/
│           ├── VMCDashboard.tsx
│           ├── EUTaxonomySection.tsx
│           ├── ResilienceSection.tsx
│           ├── CBRTSection.tsx
│           └── charts/
│               ├── BudgetBarChart.tsx
│               ├── AlignmentPieChart.tsx
│               ├── RiskRadarChart.tsx
│               └── BubbleChart.tsx
```

---

## Terminology Reference

| Term | Definition |
|------|------------|
| **EU Taxonomy** | EU Regulation 2020/852 classifying sustainable economic activities |
| **DNSH** | Do No Significant Harm — a key EU Taxonomy criterion |
| **SBTi** | Science Based Targets initiative — corporate net-zero alignment |
| **CBI** | Climate Bonds Initiative — green/climate bond certification |
| **CBRT** | Climate Bond Readiness Toolkit — CBI's municipal assessment tool |
| **Transition Finance** | Finance supporting high-emission sectors in their decarbonisation journey |
| **Resilience Finance** | Finance building climate adaptation and disaster risk resilience |

---

## Designed For

- **Asset Managers**: ESG portfolio analytics, taxonomy alignment reporting
- **Municipal Finance Officers**: Budget mapping, climate bond programme preparation
- **ESG Analysts**: Sector-level alignment benchmarking, transition scoring
- **Climate Finance Advisors**: Resilience investment prioritisation, CBRT assessment

---

*Built with Next.js · Tailwind CSS · Recharts · SheetJS · Vercel*
