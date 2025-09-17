import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'New connection request', message: 'John Doe wants to connect', time: '2 min ago', unread: true },
    { id: 2, title: 'Event reminder', message: 'Alumni meetup tomorrow at 6 PM', time: '1 hour ago', unread: true },
    { id: 3, title: 'Job opportunity', message: 'Software Engineer position at TechCorp', time: '3 hours ago', unread: false },
  ]);

  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/alumni-dashboard', icon: 'Home' },
    { label: 'Directory', path: '/alumni-directory', icon: 'Users' },
    { label: 'Events', path: '/events-management', icon: 'Calendar' },
    { label: 'Careers', path: '/career-board', icon: 'Briefcase' },
    { label: 'Messages', path: '/messages', icon: 'MessageCircle' },
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef?.current && !userDropdownRef?.current?.contains(event?.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/alumni-directory?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification?.title?.includes('connection')) {
      navigate('/alumni-directory');
    } else if (notification?.title?.includes('Event')) {
      navigate('/events-management');
    } else if (notification?.title?.includes('Job')) {
      navigate('/career-board');
    }
    setIsNotificationOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  const displayName = userProfile?.full_name || user?.email || 'Guest'
  const displayEmail = userProfile?.email || user?.email || ''
  const initials = (userProfile?.full_name || user?.email || 'G')
    .split(' ')
    .map((p) => p?.[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-nav bg-card border-b border-border h-nav">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                <path d="M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AlumniConnect</h1>
              <p className="text-xs text-muted-foreground">Government of Punjab</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div ref={searchRef} className="relative hidden md:block">
            {isSearchExpanded ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  placeholder="Search alumni..."
                  className="w-64 px-3 py-2 text-sm border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Icon name="Search" size={16} />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Icon name="Search" size={18} />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
            >
              <Icon name="Bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <button
                      key={notification?.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full p-4 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification?.unread ? 'bg-accent' : 'bg-muted'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-popover-foreground">{notification?.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{notification?.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div ref={userDropdownRef} className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">{initials}</span>
              </div>
              <span className="hidden lg:block text-sm font-medium">{displayName}</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm text-popover-foreground">{displayName}</p>
                  {displayEmail && (
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/alumni-profile');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help</span>
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-muted transition-colors flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-mobile-backdrop bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-nav right-0 z-mobile-menu w-64 h-full bg-card border-l border-border shadow-elevation-3 md:hidden animate-slide-down">
            <div className="p-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    placeholder="Search alumni..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navigationItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;