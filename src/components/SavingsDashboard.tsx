import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PiggyBank, Target, Trophy, Calendar, Plus, Clock, TrendingUp, Zap, Gift, Star, RefreshCw } from 'lucide-react';

// Mock data
const savingsGoals = [
  {
    id: 1,
    name: 'Emergency Fund',
    target: 15000,
    current: 12450,
    deadline: '2024-12-31',
    color: '#059669',
    priority: 'high',
    monthlyContribution: 800,
    category: 'safety'
  },
  {
    id: 2,
    name: 'Vacation Fund',
    target: 5000,
    current: 2800,
    deadline: '2025-06-01',
    color: '#1e40af',
    priority: 'medium',
    monthlyContribution: 400,
    category: 'lifestyle'
  },
  {
    id: 3,
    name: 'Car Down Payment',
    target: 8000,
    current: 4200,
    deadline: '2025-09-01',
    color: '#7c3aed',
    priority: 'medium',
    monthlyContribution: 350,
    category: 'transport'
  },
  {
    id: 4,
    name: 'Home Renovation',
    target: 12000,
    current: 1500,
    deadline: '2026-03-01',
    color: '#dc2626',
    priority: 'low',
    monthlyContribution: 500,
    category: 'home'
  }
];

const spendingGoals = [
  {
    id: 1,
    name: 'Dining Out Budget',
    target: 800,
    current: 650,
    category: 'Food & Dining',
    type: 'monthly',
    status: 'on-track'
  },
  {
    id: 2,
    name: 'Entertainment Budget',
    target: 400,
    current: 300,
    category: 'Entertainment',
    type: 'monthly',
    status: 'under-budget'
  },
  {
    id: 3,
    name: 'Shopping Limit',
    target: 600,
    current: 750,
    category: 'Shopping',
    type: 'monthly',
    status: 'over-budget'
  }
];

const achievements = [
  { id: 1, title: 'First $1,000', description: 'Saved your first $1,000!', earned: true, icon: Trophy },
  { id: 2, title: 'Consistent Saver', description: '6 months of consistent saving', earned: true, icon: Star },
  { id: 3, title: 'Budget Master', description: 'Stayed under budget for 3 months', earned: true, icon: Target },
  { id: 4, title: 'Emergency Ready', description: 'Build a 3-month emergency fund', earned: false, icon: PiggyBank },
  { id: 5, title: 'Investment Starter', description: 'Start your first investment', earned: false, icon: TrendingUp },
];

const savingsChallenges = [
  {
    id: 1,
    title: '52-Week Challenge',
    description: 'Save $1 more each week throughout the year',
    progress: 45,
    total: 52,
    reward: 'Complete and earn $1,378!',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'No-Spend Weekend',
    description: 'Skip unnecessary spending this weekend',
    progress: 0,
    total: 1,
    reward: 'Save ~$50-100',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Coffee Shop Alternative',
    description: 'Make coffee at home for 30 days',
    progress: 18,
    total: 30,
    reward: 'Save ~$150',
    difficulty: 'Hard'
  }
];

const aiMotivation = [
  {
    type: 'encouragement',
    message: "Amazing progress! You're 83% towards your emergency fund goal. Just $2,550 more to go! 🎉",
    action: "See how to reach it faster"
  },
  {
    type: 'insight',
    message: "Your vacation fund is growing steadily. At this rate, you'll reach your goal 2 weeks early! ✈️",
    action: "Optimize savings plan"
  },
  {
    type: 'challenge',
    message: "You saved $127 more than expected last month. Ready for a bigger challenge? 💪",
    action: "View challenges"
  }
];

interface Transaction {
  account_id: string;
  transaction_id: string;
  name: string;
  merchant_name: string | null;
  amount: number;
  date: string;
  category: string;
  pending: boolean;
}

interface Account {
  id: number;
  name: number;
  nickname: string | null;
  type: string;
  mask: string;
  balance: number;
}

export default function SavingsDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    monthlyContribution: '',
    priority: 'medium',
    category: 'general'
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccounts.length > 0 && accounts.length > 0) {
      fetchTransactions();
    }
  }, [selectedAccounts, accounts]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const response = await fetch('/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccounts(data.map(acc => acc.mask));
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const allTxns: Transaction[] = [];
      
      for (const accountMask of selectedAccounts) {
        try {
          const url = `/fake/plaid/transactions?account_id=${accountMask}&start_date=${startDate}&end_date=${endDate}&limit=100`;
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            allTxns.push(...(data.transactions || []));
          }
        } catch (error) {
          console.error(`Error fetching transactions for account ${accountMask}:`, error);
        }
      }
      
      setTransactions(allTxns);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline || !newGoal.monthlyContribution) {
      alert('Please fill in all required fields');
      return;
    }

    const goal = {
      id: Date.now() + Math.random(), // Ensure unique ID generation
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0, // Start with 0 progress
      deadline: newGoal.deadline,
      color: getGoalColor(newGoal.category),
      priority: newGoal.priority,
      monthlyContribution: parseFloat(newGoal.monthlyContribution),
      category: newGoal.category
    };

    // Add to savings goals (in a real app, this would save to backend)
    savingsGoals.push(goal);
    
    // Reset form
    setNewGoal({
      name: '',
      target: '',
      deadline: '',
      monthlyContribution: '',
      priority: 'medium',
      category: 'general'
    });
    
    setShowNewGoal(false);
    
    // Force re-render (in a real app, you'd update state properly)
    window.location.reload();
  };

  const getGoalColor = (category: string) => {
    const colors = ['#059669', '#1e40af', '#7c3aed', '#dc2626', '#ea580c', '#65a30d', '#0891b2'];
    return colors[category.length % colors.length];
  };

  // Calculate real savings data from transactions
  const savingsTransactions = transactions.filter(t => t.amount > 0 && ['savings', 'deposit', 'interest', 'dividend'].includes(t.category));
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthSavings = savingsTransactions
    .filter(t => {
      const txnDate = new Date(t.date);
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0;
      return sum + amount;
    }, 0);

  // Calculate total savings from account balances
  console.log('Accounts data:', accounts);
  console.log('Account balances:', accounts.map(acc => ({ name: acc.name, balance: acc.balance, type: typeof acc.balance })));
  
  const totalSavings = accounts.reduce((sum, acc) => {
    const balance = parseFloat(acc.balance) || 0;
    console.log(`Processing account ${acc.name}: balance=${acc.balance}, parsed=${balance}, running sum=${sum}`);
    return sum + balance;
  }, 0);
  
  console.log('Final totalSavings:', totalSavings);
  
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = totalTargets > 0 ? (totalSavings / totalTargets) * 100 : 0;
  
  // Check authentication
  const token = localStorage.getItem('access_token');
  if (!token) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Savings Dashboard</h1>
        <p className="text-muted-foreground mb-4">Please log in to view your savings data</p>
      </div>
    );
  }

  // Show loading state
  if (loading && accounts.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Savings Dashboard</h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading savings data...</span>
        </div>
      </div>
    );
  }

  // Show no accounts state
  if (accounts.length === 0 && !loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Savings Dashboard</h1>
        <p className="text-muted-foreground mb-4">No accounts found. Link your first account to view savings data.</p>
        <Button onClick={() => window.location.hash = '#settings'} className="bg-primary text-primary-foreground">
          <PiggyBank className="h-4 w-4 mr-2" />
          Link Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Savings Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your savings goals and progress from linked accounts
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTransactions}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-success/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <PiggyBank className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-semibold">${totalSavings.toLocaleString()}</p>
                <p className="text-xs text-success">{overallProgress.toFixed(1)}% of goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-semibold">{savingsGoals.length}</p>
                <p className="text-xs text-muted-foreground">${(totalTargets - totalSavings).toLocaleString()} to go</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-semibold">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
                <p className="text-xs text-success">Level: Saver Pro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-semibold">${currentMonthSavings.toLocaleString()}</p>
                <p className="text-xs text-success">Savings from transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Motivation Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-success/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-success" />
            <span>AI Coach</span>
          </CardTitle>
          <CardDescription>Personalized motivation and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiMotivation.map((motivation, index) => (
              <div key={`${motivation.type}-${index}`} className="p-4 bg-card rounded-lg space-y-3">
                <div className="flex items-start space-x-2">
                  {motivation.type === 'encouragement' && <Trophy className="h-5 w-5 text-success mt-0.5" />}
                  {motivation.type === 'insight' && <TrendingUp className="h-5 w-5 text-primary mt-0.5" />}
                  {motivation.type === 'challenge' && <Zap className="h-5 w-5 text-success mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{motivation.message}</p>
                    <Button variant="ghost" size="sm" className="text-xs h-8 text-primary hover:text-primary/80 p-0 justify-start mt-2">
                      {motivation.action} →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track progress towards your financial goals</CardDescription>
            </div>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowNewGoal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsGoals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              const remaining = goal.target - goal.current;
              const monthsToGoal = Math.ceil(remaining / goal.monthlyContribution);
              
              return (
                <div key={goal.id} className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: goal.color }}
                      />
                      <h4 className="font-medium">{goal.name}</h4>
                    </div>
                    <Badge 
                      variant={goal.priority === 'high' ? 'default' : 'secondary'}
                      className={goal.priority === 'high' ? 'bg-success/10 text-success' : ''}
                    >
                      {goal.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${goal.current.toLocaleString()}</span>
                      <span className="text-muted-foreground">${goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round(percentage)}% complete</span>
                      <span>${remaining.toLocaleString()} to go</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Time to goal:</span>
                      </span>
                      <span className="font-medium">{monthsToGoal} months</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Monthly: ${goal.monthlyContribution}</span>
                      <span className="text-muted-foreground">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* New Goal Dialog */}
      <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Savings Goal</DialogTitle>
            <DialogDescription>
              Set a new financial goal and track your progress towards it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Goal Name
              </Label>
              <Input
                id="name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                placeholder="e.g., Emergency Fund"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Target Amount
              </Label>
              <Input
                id="target"
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyContribution" className="text-right">
                Monthly Contribution
              </Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={newGoal.monthlyContribution}
                onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
                placeholder="0.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retirement">Retirement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spending Goals (Budgets) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Spending Goals</CardTitle>
            <CardDescription>Monthly budget tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spendingGoals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              const remaining = goal.target - goal.current;
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">${goal.current}</span>
                      <Badge 
                        variant={goal.status === 'under-budget' ? 'default' : goal.status === 'on-track' ? 'secondary' : 'destructive'}
                        className={`text-xs ${
                          goal.status === 'under-budget' ? 'bg-success/10 text-success border-success/20' : ''
                        }`}
                      >
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}% of budget</span>
                    <span>
                      {remaining > 0 ? `$${remaining} left` : `$${Math.abs(remaining)} over`}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Savings Challenges */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>Savings Challenges</span>
            </CardTitle>
            <CardDescription>Gamify your savings journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsChallenges.map((challenge) => {
              const percentage = (challenge.progress / challenge.total) * 100;
              
              return (
                <div key={challenge.id} className="space-y-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>{challenge.progress}/{challenge.total} complete</span>
                      <span className="text-success">{challenge.reward}</span>
                    </div>
                  </div>
                  
                  {percentage < 100 && (
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Continue Challenge
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-success" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Your savings milestones and badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`text-center p-4 rounded-lg ${
                    achievement.earned 
                      ? 'bg-success/10 border border-success/20' 
                      : 'bg-muted/30 border border-border'
                  }`}
                >
                  <Icon 
                    className={`h-8 w-8 mx-auto mb-2 ${
                      achievement.earned ? 'text-success' : 'text-muted-foreground'
                    }`} 
                  />
                  <h4 className={`text-sm font-medium ${
                    achievement.earned ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-success text-success-foreground text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}