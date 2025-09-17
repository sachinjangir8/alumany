import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import { useAuth } from "../../contexts/AuthContext";
import ActivityCard from "./components/ActivityCard";
import QuickActionCard from "./components/QuickActionCard";
import PersonalizedWidget from "./components/PersonalizedWidget";
import MetricsCard from "./components/MetricsCard";
import NotificationToast from "./components/NotificationToast";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for activities
  const mockActivities = [
    {
      id: 1,
      type: "job",
      author: {
        name: "Sarah Johnson",
        title: "Senior Software Engineer",
        company: "Google",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      },
      title: "New Job Opening: Full Stack Developer",
      content: `We're looking for a talented Full Stack Developer to join our team at Google. This role involves working on cutting-edge web applications using React, Node.js, and cloud technologies.\n\nKey Requirements:\n• 3+ years of experience in web development\n• Strong knowledge of JavaScript, React, and Node.js\n• Experience with cloud platforms (GCP preferred)\n• Bachelor's degree in Computer Science or related field\n\nWe offer competitive salary, excellent benefits, and the opportunity to work on products used by billions of people worldwide.`,
      timestamp: new Date(Date.now() - 1800000),
      likes: 24,
      comments: 8,
      isLiked: false,
      tags: ["JavaScript", "React", "NodeJS", "FullStack"],
    },
    {
      id: 2,
      type: "event",
      author: {
        name: "Michael Rodriguez",
        title: "Alumni Relations Manager",
        company: "Punjab University",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      title: "Annual Alumni Meetup 2024",
      content: `Join us for our biggest alumni gathering of the year! Connect with fellow graduates, share experiences, and build lasting professional relationships.\n\nEvent Details:\n📅 Date: December 15, 2024\n🕕 Time: 6:00 PM - 10:00 PM\n📍 Location: Punjab University Main Campus\n🎯 Theme: "Innovation & Leadership in the Digital Age"\n\nFeaturing keynote speeches from successful alumni, networking sessions, cultural performances, and a gala dinner. Don't miss this opportunity to reconnect with your alma mater!`,
      timestamp: new Date(Date.now() - 3600000),
      likes: 156,
      comments: 42,
      isLiked: true,
      tags: ["Networking", "Alumni", "University", "Event"],
    },
    {
      id: 3,
      type: "mentorship",
      author: {
        name: "Dr. Priya Sharma",
        title: "Chief Technology Officer",
        company: "TechCorp India",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
      title: "Mentorship Program: Guiding the Next Generation",
      content: `I'm excited to announce my participation in the Alumni Mentorship Program! As someone who has navigated the tech industry for over 15 years, I'm passionate about helping recent graduates and young professionals.\n\nWhat I can help with:\n• Career planning and goal setting\n• Technical skill development\n• Leadership and management transition\n• Work-life balance strategies\n• Industry insights and networking\n\nI'm particularly interested in mentoring women in tech and first-generation professionals. Let's build a stronger, more inclusive tech community together!`,
      timestamp: new Date(Date.now() - 7200000),
      likes: 89,
      comments: 23,
      isLiked: false,
      tags: ["Mentorship", "WomenInTech", "Leadership", "Career"],
    },
    {
      id: 4,
      type: "achievement",
      author: {
        name: "Rajesh Kumar",
        title: "Entrepreneur",
        company: "Kumar Innovations",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      title: "Startup Success: ₹50 Crore Funding Raised!",
      content: `Thrilled to share that Kumar Innovations has successfully raised ₹50 crores in Series A funding! This milestone wouldn't have been possible without the incredible support from our alumni network.\n\nOur Journey:\n🚀 Started 3 years ago with just an idea\n💡 Developed AI-powered solutions for agriculture\n🌱 Now serving 10,000+ farmers across Punjab\n💰 Achieved 300% year-over-year growth\n\nSpecial thanks to our angel investors from the alumni community who believed in our vision from day one. This funding will help us expand to 5 more states and impact 100,000 farmers by 2025!`,
      timestamp: new Date(Date.now() - 10800000),
      likes: 234,
      comments: 67,
      isLiked: true,
      tags: ["Startup", "Funding", "Agriculture", "AI", "Success"],
    },
    {
      id: 5,
      type: "update",
      author: {
        name: "Anita Patel",
        title: "Product Manager",
        company: "Microsoft",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      },
      title: "Career Transition: From Engineer to Product Manager",
      content: `After 8 years as a software engineer, I've successfully transitioned to Product Management at Microsoft! Sharing my journey and lessons learned for anyone considering a similar path.\n\nKey Steps I Took:\n📚 Completed PM certification courses\n🤝 Built relationships with existing PMs\n💼 Took on PM responsibilities in my engineering role\n📊 Developed business and analytical skills\n🎯 Focused on user experience and market research\n\nThe transition wasn't easy, but the alumni network provided incredible support through informational interviews, referrals, and mentorship. Happy to pay it forward!`,
      timestamp: new Date(Date.now() - 14400000),
      likes: 78,
      comments: 19,
      isLiked: false,
      tags: ["CareerChange", "ProductManagement", "Microsoft", "Growth"],
    },
  ];

  // Mock data for personalized widgets
  const connectionSuggestions = [
    {
      id: 1,
      name: "Amit Singh",
      title: "Data Scientist",
      company: "Amazon",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 12,
    },
    {
      id: 2,
      name: "Neha Gupta",
      title: "UX Designer",
      company: "Adobe",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 8,
    },
    {
      id: 3,
      name: "Vikram Joshi",
      title: "Marketing Manager",
      company: "Flipkart",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      mutualConnections: 15,
    },
  ];

  const nearbyAlumni = [
    {
      id: 1,
      name: "Ravi Sharma",
      title: "Software Engineer at Infosys",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      distance: "2.5 km",
    },
    {
      id: 2,
      name: "Pooja Mehta",
      title: "Business Analyst at TCS",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      distance: "4.1 km",
    },
    {
      id: 3,
      name: "Karan Verma",
      title: "DevOps Engineer at Wipro",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      distance: "6.8 km",
    },
  ];

  const jobMatches = [
    {
      id: 1,
      title: "Senior React Developer",
      company: "Zomato",
      location: "Chandigarh",
      match: 95,
      postedTime: "2 hours ago",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Paytm",
      location: "Noida",
      match: 87,
      postedTime: "1 day ago",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Ola",
      location: "Bangalore",
      match: 82,
      postedTime: "3 days ago",
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time notifications
    const notificationTimer = setTimeout(() => {
      const newNotification = {
        id: Date.now(),
        type: "message",
        title: "New Message",
        message: "Sarah Johnson sent you a message about the job opening.",
        actions: [
          { type: "view", label: "View", primary: true },
          { type: "dismiss", label: "Dismiss", primary: false },
        ],
      };
      setNotifications((prev) => [...prev, newNotification]);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(notificationTimer);
    };
  }, []);

  const handleActivityAction = (action, activityId, data) => {
    switch (action) {
      case "like":
        setActivities((prev) =>
          prev?.map((activity) =>
            activity?.id === activityId
              ? {
                  ...activity,
                  isLiked: !activity?.isLiked,
                  likes: activity?.isLiked
                    ? activity?.likes - 1
                    : activity?.likes + 1,
                }
              : activity
          )
        );
        break;
      case "reply":
        setActivities((prev) =>
          prev?.map((activity) =>
            activity?.id === activityId
              ? { ...activity, comments: activity?.comments + 1 }
              : activity
          )
        );
        break;
      case "share":
        // Handle share functionality
        break;
      default:
        break;
    }
  };

  const handleWidgetAction = (action, itemId) => {
    switch (action) {
      case "connect":
        // Handle connection request
        break;
      case "message":
        // Handle messaging
        break;
      default:
        break;
    }
  };

  const handleNotificationAction = (notificationId, actionType) => {
    if (actionType === "view") {
      navigate("/alumni-directory");
    }
    setNotifications((prev) => prev?.filter((n) => n?.id !== notificationId));
  };

  const closeNotification = (notificationId) => {
    setNotifications((prev) => prev?.filter((n) => n?.id !== notificationId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-muted-foreground">
              Loading your dashboard...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Notifications */}
      {notifications?.map((notification) => (
        <NotificationToast
          key={notification?.id}
          notification={notification}
          onClose={closeNotification}
          onAction={handleNotificationAction}
        />
      ))}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{`Welcome back${
            userProfile?.full_name ? `, ${userProfile.full_name}` : ""
          }!`}</h1>
          <p className="text-muted-foreground">
            Stay connected with your alumni network and discover new
            opportunities.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Profile Views"
            value="247"
            change="+12%"
            changeType="positive"
            icon="Eye"
            color="primary"
          />
          <MetricsCard
            title="Network Connections"
            value="1,234"
            change="+8%"
            changeType="positive"
            icon="Users"
            color="success"
          />
          <MetricsCard
            title="Event Registrations"
            value="12"
            change="+3"
            changeType="positive"
            icon="Calendar"
            color="warning"
          />
          <MetricsCard
            title="Job Applications"
            value="8"
            change="+2"
            changeType="positive"
            icon="Briefcase"
            color="secondary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Activity Feed
              </h2>
              <Button variant="outline" size="sm">
                <Icon name="Filter" size={16} className="mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-6">
              {activities?.map((activity) => (
                <ActivityCard
                  key={activity?.id}
                  activity={activity}
                  onReply={(id, text) =>
                    handleActivityAction("reply", id, text)
                  }
                  onLike={(id) => handleActivityAction("like", id)}
                  onShare={(id) => handleActivityAction("share", id)}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline">Load More Activities</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <QuickActionCard
                  title="Update Profile"
                  description="Keep your information current and visible to other alumni"
                  icon="User"
                  route="/alumni-profile"
                  color="primary"
                />
                <QuickActionCard
                  title="Browse Directory"
                  description="Find and connect with fellow alumni in your field"
                  icon="Users"
                  route="/alumni-directory"
                  badge="12"
                  color="secondary"
                />
                <QuickActionCard
                  title="Upcoming Events"
                  description="Register for alumni meetups and networking events"
                  icon="Calendar"
                  route="/events-management"
                  badge="3"
                  color="success"
                />
                <QuickActionCard
                  title="Career Board"
                  description="Explore job opportunities shared by alumni"
                  icon="Briefcase"
                  route="/career-board"
                  badge="8"
                  color="warning"
                />
              </div>
            </div>

            {/* Personalized Widgets */}
            <PersonalizedWidget
              type="connections"
              title="People You May Know"
              data={connectionSuggestions}
              onAction={handleWidgetAction}
            />

            <PersonalizedWidget
              type="nearby"
              title="Alumni Near You"
              data={nearbyAlumni}
              onAction={handleWidgetAction}
            />

            <PersonalizedWidget
              type="jobs"
              title="Recommended Jobs"
              data={jobMatches}
              onAction={handleWidgetAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
