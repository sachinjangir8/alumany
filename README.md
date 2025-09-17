# AlumniConnect - Government of Punjab

A comprehensive alumni management platform designed to connect graduates, faculty, and current students from educational institutions in Punjab. Built with React, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Functionality
- **User Authentication & Profiles**: Secure login/signup with comprehensive profile management
- **Alumni Directory**: Search and filter alumni by department, graduation year, location, and industry
- **Messaging System**: Real-time communication between alumni members
- **Events Management**: Create, manage, and register for alumni events
- **Career Board**: Job postings, applications, and career opportunities
- **Dashboard**: Personalized activity feed and quick actions

### Key Capabilities
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🔐 **Role-Based Access**: Different permissions for administrators, alumni, faculty, and students
- 🔍 **Advanced Search**: Powerful filtering and search capabilities
- 💬 **Real-time Communication**: Instant messaging and notifications
- 📊 **Analytics Dashboard**: Track engagement and activity metrics
- 🎯 **Personalized Experience**: Customized content based on user preferences

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time subscriptions)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd alumniconnect
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
The `.env` file is already configured with demo Supabase credentials:
```env
VITE_SUPABASE_URL=https://fnsypjqncpktohuiwsix.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Database Setup**
The database is already set up with demo data. If you need to set up your own:
```bash
# Copy the contents of supabase/migrations/*.sql to your Supabase SQL editor and execute
```

5. **Start Development Server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── AppIcon.jsx      # Icon component
│   ├── ProtectedRoute.jsx # Route protection
│   └── SplashScreen.jsx # Loading screen
├── contexts/            # React context providers
│   └── AuthContext.jsx # Authentication context
├── hooks/               # Custom React hooks
│   └── useSupabaseData.js # Data fetching hooks
├── lib/                 # External library configurations
│   └── supabase.js     # Supabase client
├── pages/               # Page components
│   ├── alumni-dashboard/
│   ├── alumni-directory/
│   ├── alumni-profile/
│   ├── career-board/
│   ├── events-management/
│   ├── login/
│   └── messages/
├── styles/              # Global styles
├── utils/               # Utility functions
│   ├── cn.js           # Class name utility
│   └── supabaseService.js # Database service layer
├── App.jsx             # Root component
├── Routes.jsx          # Application routes
└── index.jsx           # Application entry point
```

## 🔑 Demo Credentials

For testing purposes, use these demo accounts:

- **Administrator**: admin@punjab.gov.in / Admin@123
- **Alumni**: alumni@example.com / Alumni@123
- **Student**: student@college.edu / Student@123
- **Faculty**: faculty@college.edu / Faculty@123
- **Manager**: manager@punjab.gov.in / Manager@123

## 🎨 Design System

The application uses a comprehensive design system with:
- **Colors**: Primary (blue), secondary (teal), success (emerald), warning (amber), error (red)
- **Typography**: Inter font family with consistent sizing scale
- **Spacing**: 8px grid system
- **Components**: Consistent button styles, form inputs, cards, and modals
- **Responsive**: Mobile-first approach with breakpoints for tablet and desktop

## 📱 Mobile Optimization

- Touch-friendly interface with appropriate tap targets
- Responsive grid layouts that stack on mobile
- Optimized navigation with collapsible mobile menu
- Progressive Web App (PWA) ready
- Safe area handling for modern mobile devices

## 🔐 Security Features

- **Authentication**: Secure login with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row-level security (RLS) policies
- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Built-in protection against cross-site requests

## 📊 Database Schema

Key tables:
- `user_profiles`: Extended user information
- `user_connections`: Alumni network connections
- `events`: Event management
- `job_postings`: Career opportunities
- `messages`: Internal messaging system
- `achievements`: User accomplishments

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## ✨ Application Features

### Dashboard
- Personalized activity feed with posts, job opportunities, and events
- Quick action cards for common tasks
- Metrics overview with engagement statistics
- Real-time notifications

### Alumni Directory
- Advanced search and filtering capabilities
- Bulk connection requests and messaging
- Export functionality for alumni data
- Connection status tracking

### Profile Management
- Comprehensive profile editing
- Education and career history
- Achievements and recognitions
- Shared content and posts

### Events Management
- Event creation and management
- Registration and attendee tracking
- Calendar view and filtering
- RSVP management

### Career Board
- Job posting and application system
- Application tracking dashboard
- Mentorship program integration
- Company and role filtering

### Messaging System
- Direct messaging between alumni
- Conversation management
- File sharing capabilities
- Real-time message delivery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government of Punjab for the initiative
- Supabase for the backend infrastructure
- Tailwind CSS for the design system
- Lucide for the beautiful icons
- The React community for excellent tooling

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ for the Alumni Community of Punjab**