# Business Website Automater - Back Office

This project is a back-office application for automating business website generation and sales. It uses React, Node.js, Supabase, and Vercel for deployment.

## Prerequisites

- Node.js and npm installed
- A GitHub account
- A Vercel account
- A Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd business_website_automater
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

1. Create a new project in Supabase.
2. Get your Supabase URL and anon key from the project settings.
3. Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Configure Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and create a new project.
3. Import your GitHub repository.
4. Add the following environment variables in the Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Deploy your project.

## Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/`: Contains the source code for the application.
  - `components/`: React components.
  - `pages/`: Next.js pages.
  - `data/`: Dummy data for development.
  - `lib/`: Utility functions and API handlers.
  - `styles/`: CSS styles.

## License

This project is licensed under the MIT License.

```
business_website_automater/
├── backend/
│   ├── src/
│   │   ├── data/         # Dummy data files
│   │   ├── routes/       # Placeholder API routes
│   │   ├── server.ts     # Basic Express server setup
│   │   └── types/        # TypeScript types based on dummy data
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components (optional for now)
│   │   ├── pages/        # Page components for each module
│   │   ├── App.tsx       # Main App component with routing
│   │   ├── index.tsx     # Entry point
│   │   └── styles/       # CSS/styling
│   ├── package.json
│   └── tsconfig.json
└── README.md