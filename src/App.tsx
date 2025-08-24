import React, { useState, useEffect } from 'react';
import { Home, DollarSign, TrendingDown, PiggyBank, TrendingUp, Settings, User, Bell, Search, CreditCard, X } from 'lucide-react';
import PlutoLogo from './components/PlutoLogo';
import PlutoLogoImage from './components/PlutoLogoImage';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';

// Import dashboard components
import Dashboard from './components/Dashboard';
import IncomeDashboard from './components/IncomeDashboard';
import SpendingDashboard from './components/SpendingDashboard';
import SavingsDashboard from './components/SavingsDashboard';
import InvestmentsDashboard from './components/InvestmentsDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import TransactionsDashboard from './components/TransactionsDashboard';
import LoginPage from './components/LoginPage';
import AIChatbot from './components/AIChatbot';

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'income', label: 'Income', icon: DollarSign },
  { id: 'spending', label: 'Spending', icon: TrendingDown },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New transaction detected', time: '2 min ago', read: false },
    { id: 2, message: 'Account balance updated', time: '1 hour ago', read: false },
    { id: 3, message: 'Monthly spending alert', time: '3 hours ago', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Handle navigation from hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      console.log('Hash changed to:', hash);
      console.log('Current activeView:', activeView);
      if (hash && navigationItems.some(item => item.id === hash)) {
        console.log('Setting active view to:', hash);
        setActiveView(hash);
      } else if (!hash) {
        console.log('No hash, setting to home');
        setActiveView('home');
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeView]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('access_token');
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    // Navigate to transactions if searching
    if (query.trim()) {
      setActiveView('transactions');
      window.location.hash = `#transactions?search=${encodeURIComponent(query)}`;
    } else {
      setActiveView('transactions');
      window.location.hash = '#transactions';
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-hide dropdowns after 3 seconds
  const showNotificationsDropdown = () => {
    setShowNotifications(true);
    setTimeout(() => setShowNotifications(false), 3000);
  };

  const showProfileDropdown = () => {
    setShowProfile(true);
    setTimeout(() => setShowProfile(false), 3000);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    console.log('Rendering content for activeView:', activeView);
    switch (activeView) {
      case 'home':
        return <Dashboard />;
      case 'income':
        return <IncomeDashboard />;
      case 'spending':
        return <SpendingDashboard />;
      case 'transactions':
        console.log('Rendering TransactionsDashboard component');
        return <TransactionsDashboard />;
      case 'savings':
        return <SavingsDashboard />;
      case 'investments':
        return <InvestmentsDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      default:
        console.log('Default case, rendering Dashboard');
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-yellow-50/80 via-white to-blue-50/80 border-r border-sidebar-border/50 flex flex-col backdrop-blur-sm">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            <PlutoLogoImage size="lg" className="text-sidebar-foreground" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start h-10 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
                onClick={() => {
                  setActiveView(item.id);
                  window.location.hash = `#${item.id}`;
                }}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-yellow-50/30 to-blue-50/30 border-b border-border/50 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PlutoLogoImage size="md" className="mr-2" />
              <h1 className="text-2xl font-semibold text-foreground">
                {navigationItems.find(item => item.id === activeView)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10 w-80 bg-input-background border-border"
                  value={globalSearchQuery}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                />
                {globalSearchQuery && (
                  <button
                    onClick={() => handleGlobalSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Logout Button */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={showNotificationsDropdown}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearAllNotifications}
                          className="text-xs"
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              notif.read ? 'bg-muted/30' : 'bg-blue-50'
                            } hover:bg-muted/50 mb-2`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notif.time}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile */}
              <div className="relative">
                <Avatar 
                  className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                  onClick={showProfileDropdown}
                >
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                
                {/* Profile Tooltip */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/api/placeholder/32/32" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">John Doe</p>
                          <p className="text-xs text-muted-foreground">john@example.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setActiveView('settings')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-yellow-50/50 via-white to-blue-50/30 p-6 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #f59e0b 1px, transparent 1px)',
                backgroundSize: '50px 50px, 30px 30px'
              }}
            ></div>
          </div>
          
          {/* Watermark Logo */}
          <div className="absolute bottom-4 right-4 opacity-10">
            <PlutoLogoImage size="lg" className="h-20 w-auto" />
          </div>
          
          {/* Content with relative positioning */}
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>

        {/* AI Chatbot Widget */}
        <AIChatbot />
      </div>
    </div>
  );
}