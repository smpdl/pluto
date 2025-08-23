import React, { useState } from 'react';
import { Home, DollarSign, TrendingDown, PiggyBank, TrendingUp, Settings, User, Bell, Search } from 'lucide-react';
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
import LoginPage from './components/LoginPage';
import AIChatbot from './components/AIChatbot';

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'income', label: 'Income', icon: DollarSign },
  { id: 'spending', label: 'Spending', icon: TrendingDown },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Dashboard />;
      case 'income':
        return <IncomeDashboard />;
      case 'spending':
        return <SpendingDashboard />;
      case 'savings':
        return <SavingsDashboard />;
      case 'investments':
        return <InvestmentsDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">P</span>
            </div>
            <span className="text-xl font-semibold text-sidebar-foreground">Pluto</span>
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
                onClick={() => setActiveView(item.id)}
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
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
              
              {/* Profile */}
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {renderContent()}
        </main>

        {/* AI Chatbot Widget */}
        <AIChatbot />
      </div>
    </div>
  );
}