import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { DollarSign, TrendingUp, ArrowUpRight, Calendar, Plus, Brain, Lightbulb, Target, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

// Mock data
const incomeSourcesData = [
  { name: 'Salary', value: 4200, color: '#1e40af' },
  { name: 'Freelance', value: 800, color: '#059669' },
  { name: 'Investments', value: 200, color: '#7c3aed' },
];

const incomeHistoryData = [
  { month: 'Jan', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'Feb', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'Mar', income: 5400, salary: 4200, freelance: 1000, investments: 200 },
  { month: 'Apr', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'May', income: 5600, salary: 4200, freelance: 1200, investments: 200 },
  { month: 'Jun', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'Jul', income: 5300, salary: 4200, freelance: 900, investments: 200 },
  { month: 'Aug', income: 5500, salary: 4200, freelance: 1100, investments: 200 },
  { month: 'Sep', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'Oct', income: 5400, salary: 4200, freelance: 1000, investments: 200 },
  { month: 'Nov', income: 5200, salary: 4200, freelance: 800, investments: 200 },
  { month: 'Dec', income: 5200, salary: 4200, freelance: 800, investments: 200 },
];

const upcomingIncome = [
  { source: 'Salary', amount: 4200, date: 'Dec 31', status: 'confirmed' },
  { source: 'Freelance Project', amount: 1200, date: 'Jan 5', status: 'pending' },
  { source: 'Investment Dividends', amount: 150, date: 'Jan 10', status: 'estimated' },
];

const aiInsights = [
  {
    type: 'pattern',
    title: 'Freelance Income Trending Up',
    description: 'Your freelance income has increased 35% over the last 6 months. Consider raising your rates for new clients.',
    confidence: 94,
    action: 'View Analysis'
  },
  {
    type: 'opportunity',
    title: 'Diversification Opportunity',
    description: 'Based on your skills and income patterns, you could explore consulting work which typically pays 40% more than freelance.',
    confidence: 78,
    action: 'Get Recommendations'
  },
  {
    type: 'prediction',
    title: 'Q1 Income Forecast',
    description: 'AI predicts your Q1 income will be $16,200 (+8% vs Q4) based on current trends and seasonal patterns.',
    confidence: 87,
    action: 'See Forecast'
  }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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
  name: string;
  nickname: string | null;
  type: string;
  mask: string;
  balance: number;
}

export default function IncomeDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

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

  // Helper function for category colors
  const getCategoryColor = (category: string) => {
    const colors = ['#1e40af', '#059669', '#7c3aed', '#dc2626', '#ea580c', '#65a30d', '#0891b2'];
    return colors[category.length % colors.length];
  };

  // Calculate real income data from transactions
  const incomeTransactions = transactions.filter(t => t.amount > 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthIncome = incomeTransactions
    .filter(t => {
      const txnDate = new Date(t.date);
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeSourcesData = Object.entries(incomeByCategory)
    .map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: getCategoryColor(category)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const monthlyIncomeData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short' });
    const monthIncome = incomeTransactions
      .filter(t => {
        const txnDate = new Date(t.date);
        return txnDate.getMonth() === i && txnDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      month: monthName,
      income: monthIncome,
      salary: incomeByCategory['salary'] || 0,
      freelance: incomeByCategory['freelance'] || 0,
      investments: incomeByCategory['investment'] || 0
    };
  });

  const upcomingIncome = [
    { source: 'Salary', amount: incomeByCategory['salary'] || 0, date: 'Next Payday', status: 'confirmed' },
    { source: 'Investments', amount: incomeByCategory['investment'] || 0, date: 'Monthly', status: 'estimated' },
    { source: 'Other Income', amount: (currentMonthIncome - (incomeByCategory['salary'] || 0) - (incomeByCategory['investment'] || 0)), date: 'Ongoing', status: 'estimated' },
  ].filter(item => item.amount > 0);

  const totalIncome = currentMonthIncome;

  // Check authentication
  const token = localStorage.getItem('access_token');
  if (!token) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Income Dashboard</h1>
        <p className="text-muted-foreground mb-4">Please log in to view your income data</p>
      </div>
    );
  }

  // Show loading state
  if (loading && accounts.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Income Dashboard</h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading income data...</span>
        </div>
      </div>
    );
  }

  // Show no accounts state
  if (accounts.length === 0 && !loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Income Dashboard</h1>
        <p className="text-muted-foreground mb-4">No accounts found. Link your first account to view income data.</p>
        <Button onClick={() => window.location.hash = '#settings'} className="bg-primary text-primary-foreground">
          <DollarSign className="h-4 w-4 mr-2" />
          Link Account
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Income Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income sources and trends from linked accounts
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-success/5 to-primary/5">
          <CardHeader>
            <CardTitle>Current Month Income</CardTitle>
            <CardDescription>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-success/10 rounded-full">
                <DollarSign className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="text-4xl font-bold">${totalIncome.toLocaleString()}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  3.8% increase from last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Avg Monthly Income Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Avg Monthly</p>
                <p className="text-2xl font-semibold">$5,283</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4.2% vs previous period
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Stability score:</span>
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                      Excellent
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Projected annual:</span>
                    <span className="font-medium">$63,400</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced YTD Income Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">YTD Income</p>
                <p className="text-2xl font-semibold">$63,400</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  7.8% vs last year
                </div>
                <div className="mt-3 space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Annual target:</span>
                      <span className="font-medium">$66,000</span>
                    </div>
                    <Progress value={96.1} className="h-1.5" />
                    <div className="text-xs text-muted-foreground text-center">96% complete</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Income Insights</span>
          </CardTitle>
          <CardDescription>
            Intelligent analysis of your income patterns and opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {insight.type === 'pattern' && <TrendingUp className="h-4 w-4 text-success" />}
                    {insight.type === 'opportunity' && <Lightbulb className="h-4 w-4 text-primary" />}
                    {insight.type === 'prediction' && <Target className="h-4 w-4 text-success" />}
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {insight.type}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" className="text-xs h-8 text-primary hover:text-primary/80 p-0 justify-start">
                  {insight.action} →
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Distribution Pie Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 mt-4">
              {incomeSourcesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Trend Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Income Trend</CardTitle>
            <CardDescription>Monthly income over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={incomeHistoryData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Income */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Income</CardTitle>
                <CardDescription>Expected payments in the next 30 days</CardDescription>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingIncome.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{item.source}</p>
                      <p className="text-sm text-muted-foreground">Due {item.date}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.amount.toLocaleString()}</p>
                  <Badge 
                    variant={item.status === 'confirmed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Expected</span>
                <span className="text-lg font-bold text-success">
                  ${upcomingIncome.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Goals */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Income Goals</CardTitle>
            <CardDescription>Track your progress towards income targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Goal</span>
                <span className="text-sm text-muted-foreground">$5,500</span>
              </div>
              <Progress value={94.5} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-success">$5,200 achieved</span>
                <span className="text-muted-foreground">$300 remaining</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Annual Goal</span>
                <span className="text-sm text-muted-foreground">$66,000</span>
              </div>
              <Progress value={96.1} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-success">$63,400 achieved</span>
                <span className="text-muted-foreground">$2,600 remaining</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span className="text-sm text-success font-medium">Freelance Goal</span>
                <Badge className="bg-success text-success-foreground">Exceeded</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                You've exceeded your freelance income goal by 12% this year!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}