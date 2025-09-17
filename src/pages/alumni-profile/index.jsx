import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import AboutTab from './components/AboutTab';
import EducationTab from './components/EducationTab';
import CareerTab from './components/CareerTab';
import AchievementsTab from './components/AchievementsTab';
import SharedContentTab from './components/SharedContentTab';
import ProfileEditModal from './components/ProfileEditModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { connectionsService } from '../../utils/supabaseService';

const AlumniProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const [dbProfile, setDbProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock profile data (used as visual fallback when fields are missing)
  const profileData = {
    id: id || 'john-doe-2018',
    name: "John Doe",
    currentPosition: "Senior Software Engineer",
    company: "Google Inc.",
    location: "San Francisco, CA",
    graduationYear: "Class of 2018",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    isOnline: true,
    isVerified: true,
    connectionStatus: 'not_connected', // 'connected', 'pending', 'not_connected'
    connections: 1247,
    posts: 89,
    events: 23,
    recommendations: 45,
    about: `Passionate software engineer with 6+ years of experience in full-stack development. Currently working at Google on cloud infrastructure projects. I love mentoring junior developers and contributing to open-source projects.\n\nAlways excited to connect with fellow alumni and share experiences about the tech industry. Feel free to reach out if you're looking for career advice or just want to catch up!`,
    contactInfo: {
      email: "john.doe@gmail.com",
      phone: "+1 (555) 123-4567",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev"
    },
    skills: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "Kubernetes", "Machine Learning"],
    interests: ["Open Source", "AI/ML", "Photography", "Hiking", "Mentoring", "Tech Talks"],
    mentorshipAvailable: true,
    communicationPreference: "email and LinkedIn messages"
  };

  const educationData = [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "Punjab Technical University",
      field: "Computer Science & Engineering",
      startYear: "2014",
      endYear: "2018",
      location: "Punjab, India",
      gpa: "8.7/10.0",
      isVerified: true,
      description: "Specialized in software engineering and data structures. Active member of the coding club and participated in various hackathons.",
      achievements: [
        "Dean\'s List for 3 consecutive semesters",
        "Winner of Inter-College Programming Contest 2017",
        "President of Computer Science Society (2017-2018)",
        "Published research paper on Machine Learning algorithms"
      ]
    },
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      field: "Artificial Intelligence",
      startYear: "2018",
      endYear: "2020",
      location: "California, USA",
      gpa: "3.8/4.0",
      isVerified: true,
      description: "Focused on machine learning and artificial intelligence with thesis on neural network optimization.",
      achievements: [
        "Graduate Research Assistant",
        "Teaching Assistant for CS229 Machine Learning",
        "Published 2 papers in top-tier AI conferences"
      ]
    }
  ];

  const careerData = [
    {
      position: "Senior Software Engineer",
      company: "Google Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: null,
      duration: "2 years 8 months",
      isCurrent: true,
      description: "Leading development of cloud infrastructure services used by millions of users worldwide. Managing a team of 5 engineers and driving technical decisions for critical systems.",
      responsibilities: [
        "Design and implement scalable microservices architecture",
        "Lead technical discussions and code reviews",
        "Mentor junior engineers and interns",
        "Collaborate with product managers on feature planning"
      ],
      achievements: [
        "Reduced system latency by 40% through optimization",
        "Led migration of legacy systems to cloud-native architecture",
        "Received \'Outstanding Performance\' rating for 2 consecutive years"
      ],
      skills: ["Go", "Kubernetes", "GCP", "Microservices", "System Design"]
    },
    {
      position: "Software Engineer",
      company: "Microsoft",
      location: "Seattle, WA",
      startDate: "Jul 2020",
      endDate: "Dec 2021",
      duration: "1 year 6 months",
      isCurrent: false,
      description: "Developed features for Azure cloud platform, focusing on developer tools and APIs.",
      responsibilities: [
        "Built REST APIs for Azure services",
        "Implemented automated testing frameworks",
        "Participated in on-call rotation for production systems"
      ],
      achievements: [
        "Shipped 3 major features to production",
        "Improved API response time by 25%",
        "Mentored 2 new graduate hires"
      ],
      skills: ["C#", ".NET", "Azure", "SQL Server", "Docker"]
    },
    {
      position: "Software Engineering Intern",
      company: "Facebook (Meta)",
      location: "Menlo Park, CA",
      startDate: "Jun 2019",
      endDate: "Aug 2019",
      duration: "3 months",
      isCurrent: false,
      description: "Summer internship working on Instagram\'s backend infrastructure team.",
      responsibilities: [
        "Developed internal tools for performance monitoring",
        "Optimized database queries for better performance",
        "Collaborated with cross-functional teams"
      ],
      achievements: [
        "Intern project adopted by the team",
        "Received return offer for full-time position"
      ],
      skills: ["Python", "Django", "MySQL", "Redis", "React"]
    }
  ];

  const achievementsData = [
    {
      type: "award",
      title: "Outstanding Alumni Award 2023",
      organization: "Punjab Technical University",
      date: "March 2023",
      location: "Punjab, India",
      description: "Recognized for exceptional contributions to the field of technology and for mentoring current students.",
      details: [
        "Selected from over 500 nominations",
        "Recognized for professional achievements and community service",
        "Delivered keynote speech at graduation ceremony"
      ],
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop",
      links: [
        { label: "News Article", url: "#" }
      ]
    },
    {
      type: "publication",
      title: "Optimizing Neural Networks for Edge Computing",
      organization: "IEEE Transactions on Neural Networks",
      date: "September 2022",
      description: "Co-authored research paper on improving neural network efficiency for mobile and edge devices.",
      details: [
        "First author on the publication",
        "Cited by 45+ research papers",
        "Presented at ICML 2022 conference"
      ],
      skills: ["Machine Learning", "Neural Networks", "Edge Computing"],
      links: [
        { label: "Read Paper", url: "#" },
        { label: "Conference Presentation", url: "#" }
      ]
    },
    {
      type: "patent",
      title: "Method for Distributed Cache Optimization",
      organization: "US Patent Office",
      date: "January 2023",
      description: "Patent for a novel approach to optimize distributed caching systems in cloud environments.",
      details: [
        "Patent #US11,234,567",
        "Co-inventor with 2 colleagues",
        "Licensed to Google for commercial use"
      ],
      skills: ["Distributed Systems", "Caching", "Cloud Computing"]
    },
    {
      type: "recognition",
      title: "Top 30 Under 30 in Technology",
      organization: "Tech Magazine",
      date: "June 2023",
      description: "Featured in annual list recognizing young professionals making significant impact in technology.",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      links: [
        { label: "Magazine Feature", url: "#" }
      ]
    },
    {
      type: "project",
      title: "Open Source ML Framework",
      organization: "GitHub",
      date: "Ongoing since 2021",
      description: "Created and maintain an open-source machine learning framework with 10K+ stars on GitHub.",
      details: [
        "10,000+ GitHub stars",
        "500+ contributors worldwide",
        "Used by 50+ companies in production",
        "Featured in Google\'s Open Source Spotlight"
      ],
      skills: ["Python", "Machine Learning", "Open Source", "Community Management"],
      links: [
        { label: "GitHub Repository", url: "#" },
        { label: "Documentation", url: "#" }
      ]
    }
  ];

  const sharedContentData = [
    {
      id: 1,
      type: "post",
      title: "My Journey from Punjab to Silicon Valley",
      description: `Reflecting on my journey from a small town in Punjab to working at Google. It's been an incredible ride filled with challenges, learning, and amazing people.\n\nKey lessons I've learned:\n• Never stop learning and adapting\n• Build genuine relationships\n• Give back to the community\n• Stay humble and curious`,
      date: "2024-01-15",
      visibility: "Public",
      likes: 234,
      comments: 45,
      shares: 23,
      views: 1250,
      isLiked: false,
      tags: ["career", "motivation", "journey"]
    },
    {
      id: 2,
      type: "article",
      title: "Building Scalable Systems at Google",
      description: "Sharing insights from my experience building large-scale distributed systems. This article covers key architectural patterns and lessons learned.",
      date: "2024-01-10",
      visibility: "Public",
      likes: 189,
      comments: 32,
      shares: 67,
      views: 2100,
      isLiked: true,
      media: {
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
        title: "Building Scalable Systems at Google",
        excerpt: "Learn about the architectural patterns and best practices used at Google for building systems that serve billions of users.",
        url: "#"
      },
      tags: ["technology", "systems", "architecture", "google"]
    },
    {
      id: 3,
      type: "photo",
      title: "Alumni Meetup in San Francisco",
      description: "Great evening catching up with fellow PTU alumni in the Bay Area. Amazing to see how everyone is thriving in their careers!",
      date: "2024-01-05",
      visibility: "Alumni Only",
      likes: 156,
      comments: 28,
      shares: 12,
      views: 890,
      isLiked: true,
      media: {
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
        alt: "Group photo of alumni at meetup"
      },
      tags: ["alumni", "networking", "meetup", "sanfrancisco"]
    },
    {
      id: 4,
      type: "video",
      title: "Tech Talk: Introduction to Machine Learning",
      description: "Recording of my recent tech talk at the university about getting started with machine learning. Hope this helps current students!",
      date: "2023-12-20",
      visibility: "Public",
      likes: 312,
      comments: 89,
      shares: 145,
      views: 4200,
      isLiked: false,
      media: {
        url: "#",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop"
      },
      tags: ["education", "machinelearning", "techtalk", "students"]
    },
    {
      id: 5,
      type: "post",
      title: "Mentorship Opportunities Available",
      description: `I'm opening up a few mentorship slots for current students and recent graduates interested in tech careers.\n\nWhat I can help with:\n• Career guidance and planning\n• Technical interview preparation\n• Resume and LinkedIn optimization\n• Industry insights and networking\n\nDM me if you're interested!`,
      date: "2023-12-15",
      visibility: "Public",
      likes: 98,
      comments: 67,
      shares: 34,
      views: 1800,
      isLiked: false,
      tags: ["mentorship", "career", "students", "guidance"]
    }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        // If viewing another user's profile via id param
        if (id && id !== user?.id) {
          const { data } = await supabase
            ?.from('user_profiles')
            ?.select('*')
            ?.eq('id', id)
            ?.single();
          setDbProfile(data || null);
        } else {
          // Own profile from context
          setDbProfile(userProfile || null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, user?.id, userProfile]);

  const mergedProfile = {
    ...profileData,
    id: dbProfile?.id || profileData?.id,
    name: dbProfile?.full_name || profileData?.name,
    currentPosition: dbProfile?.current_position || profileData?.currentPosition,
    company: dbProfile?.company || profileData?.company,
    location: dbProfile?.location || profileData?.location,
    graduationYear: dbProfile?.graduation_year ? `Class of ${dbProfile?.graduation_year}` : profileData?.graduationYear,
    profilePhoto: dbProfile?.avatar_url || profileData?.profilePhoto,
    isOnline: true,
    contactInfo: {
      ...profileData?.contactInfo,
      email: dbProfile?.email || profileData?.contactInfo?.email
    }
  };

  const isOwnProfile = !id || id === user?.id;

  const handleProfileUpdate = (updatedProfile) => {
    setDbProfile(updatedProfile);
  };

  const handleConnect = async () => {
    if (!user) {
      alert('Please sign in to connect with alumni');
      return;
    }

    try {
      const { error: connectionError } = await connectionsService?.sendConnectionRequest(
        dbProfile?.id, 
        'Hi! I would like to connect with you through AlumniConnect.'
      );

      if (connectionError) {
        alert('Failed to send connection request. Please try again.');
        return;
      }

      alert('Connection request sent successfully!');
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleMessage = () => {
    navigate(`/messages?recipient=${dbProfile?.id}`);
  };

  const handleRecommend = () => {
    // TODO: Implement recommendation functionality
    alert('Recommendation functionality will be available soon!');
  };

  const handleLike = (contentId) => {
    console.log('Liked content:', contentId);
  };

  const handleComment = (contentId) => {
    console.log('Comment on content:', contentId);
  };

  const handleShare = (contentId) => {
    console.log('Share content:', contentId);
  };

  const tabs = [
    {
      id: 'about',
      label: 'About',
      icon: 'User',
      content: <AboutTab profile={profileData} />
    },
    {
      id: 'education',
      label: 'Education',
      icon: 'GraduationCap',
      count: educationData?.length,
      content: <EducationTab education={educationData} />
    },
    {
      id: 'career',
      label: 'Career',
      icon: 'Briefcase',
      count: careerData?.length,
      content: <CareerTab career={careerData} />
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: 'Award',
      count: achievementsData?.length,
      content: <AchievementsTab achievements={achievementsData} />
    },
    {
      id: 'content',
      label: 'Shared Content',
      icon: 'FileText',
      count: sharedContentData?.length,
      content: (
        <SharedContentTab
          sharedContent={sharedContentData}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/alumni-directory')}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Directory
          </Button>
          <div className="text-sm text-muted-foreground">
            Profile • {mergedProfile?.name}
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          profile={mergedProfile}
          isOwnProfile={isOwnProfile}
          onConnect={handleConnect}
          onMessage={handleMessage}
          onRecommend={handleRecommend}
          onEdit={() => setShowEditModal(true)}
        />

        {/* Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Quick Actions (Mobile) */}
        <div className="md:hidden fixed bottom-4 right-4 space-y-2">
          <Button
            variant="default"
            size="icon"
            className="w-12 h-12 rounded-full shadow-elevation-2"
            onClick={handleMessage}
          >
            <Icon name="MessageCircle" size={20} />
          </Button>
        </div>
        {/* Modals */}
        {showEditModal && isOwnProfile && (
          <ProfileEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;