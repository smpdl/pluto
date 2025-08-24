import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, CreditCard, Bell, Shield, Globe, Trash2, Plus, Link as LinkIcon } from 'lucide-react';


const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'trading', label: 'Trading' },
  { value: 'credit', label: 'Credit' },
];

const notificationSettings = [
  { id: 'spending', label: 'Spending Alerts', description: 'Get notified when you exceed budget limits', enabled: true },
  { id: 'goals', label: 'Goal Updates', description: 'Progress updates on your savings goals', enabled: true },
  { id: 'investments', label: 'Investment Alerts', description: 'Portfolio performance and market updates', enabled: false },
  { id: 'bills', label: 'Bill Reminders', description: 'Upcoming bill due dates and payments', enabled: true },
  { id: 'monthly', label: 'Monthly Reports', description: 'Monthly financial summary and insights', enabled: true },
];

export default function SettingsDashboard() {
  const [notifications, setNotifications] = useState(notificationSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [linkType, setLinkType] = useState('checking');
  const [linkUsername, setLinkUsername] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkNickname, setLinkNickname] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  const fetchAccounts = () => {
    const token = localStorage.getItem('access_token');
    fetch('/accounts', { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(setAccounts);
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const handleLinkAccount = async () => {
    setLinkLoading(true);
    try {
          const token = localStorage.getItem('access_token');
    const response = await fetch('/accounts/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: linkUsername,
        password: linkPassword,
        account_type: linkType,
        nickname: linkNickname || null
      })
    });
      
      if (!response.ok) {
        throw new Error('Failed to link account');
      }
      
      setShowModal(false);
      setLinkUsername('');
      setLinkPassword('');
      setLinkNickname('');
      setLinkType('checking');
      fetchAccounts();
    } catch (error) {
      console.error('Error linking account:', error);
      alert('Failed to link account. Please try again.');
    } finally {
      setLinkLoading(false);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const deleteAccount = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Account deleted successfully');
        fetchAccounts(); // Refresh the accounts list
      } else {
        console.error('Failed to delete account:', response.status);
        alert('Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Manage your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                defaultValue="John" 
                disabled={!isEditing}
                className={isEditing ? 'bg-input-background' : 'bg-muted'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                defaultValue="Doe" 
                disabled={!isEditing}
                className={isEditing ? 'bg-input-background' : 'bg-muted'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="john@example.com" 
                disabled={!isEditing}
                className={isEditing ? 'bg-input-background' : 'bg-muted'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                defaultValue="+1 (555) 123-4567" 
                disabled={!isEditing}
                className={isEditing ? 'bg-input-background' : 'bg-muted'}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Connected Accounts</span>
              </CardTitle>
              <CardDescription>
                Manage your linked bank accounts and credit cards
              </CardDescription>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Link Account
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{account.nickname || account.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ••••{account.mask}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    ${parseFloat(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <Badge 
                    variant={account.type === 'checking' ? 'default' : account.type === 'savings' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {account.type}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => deleteAccount(account.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <div className="bg-card p-6 rounded-xl shadow-lg min-w-[300px]">
                <h3 className="mb-4 font-semibold">Connect with Plaid (Fake)</h3>
                <div className="mb-3">
                  <Label>Account Type</Label>
                  <select value={linkType} onChange={e => setLinkType(e.target.value)} className="w-full mt-1 p-2 rounded-md border">
                    {ACCOUNT_TYPES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <Label>Username</Label>
                  <Input
                    type="text"
                    value={linkUsername}
                    onChange={e => setLinkUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div className="mb-3">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={linkPassword}
                    onChange={e => setLinkPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="mb-3">
                  <Label>Nickname (Optional)</Label>
                  <Input
                    type="text"
                    value={linkNickname}
                    onChange={e => setLinkNickname(e.target.value)}
                    placeholder="e.g., My Checking"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={handleLinkAccount} disabled={linkLoading || !linkUsername || !linkPassword} className="bg-primary hover:bg-primary/90">
                    {linkLoading ? "Connecting..." : "Connect"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Preferences */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Preferences</span>
            </CardTitle>
            <CardDescription>
              Customize your app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select defaultValue="mm-dd-yyyy">
                <SelectTrigger className="bg-input-background">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Categorization</p>
                  <p className="text-sm text-muted-foreground">Automatically categorize transactions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Control what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{notification.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
                <Switch 
                  checked={notification.enabled}
                  onCheckedChange={() => toggleNotification(notification.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security & Privacy</span>
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Badge className="bg-success/10 text-success">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Biometric Login</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32 bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive/80">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Recent Activity</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Last login: Today at 9:34 AM from Chrome on MacOS</p>
              <p>• Password changed: November 15, 2024</p>
              <p>• Account created: October 1, 2023</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}