import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { PiggyBank, TrendingUp, Target, ArrowUpRight, Plus, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const savingsGoals = [
  {
    id: 1,
    name: 'Emergency Fund',
    target: 15000,
    current: 12450,
    deadline: '2024-12-31',
    color: '#059669',
    priority: 'high'
  },
  {
    id: 2,
    name: 'Vacation Fund',
    target: 5000,
    current: 2800,
    deadline: '2025-06-01',
    color: '#1e40af',
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Car Down Payment',
    target: 8000,
    current: 4200,
    deadline: '2025-09-01',
    color: '#7c3aed',
    priority: 'medium'
  }
];

const investmentPortfolio = [
  { name: 'Stocks', value: 5420, color: '#1e40af', allocation: 61 },
  { name: 'Bonds', value: 1780, color: '#059669', allocation: 20 },
  { name: 'ETFs', value: 1120, color: '#7c3aed', allocation: 12 },
  { name: 'Crypto', value: 600, color: '#dc2626', allocation: 7 },
];

const portfolioGrowth = [
  { month: 'Jun', value: 7800 },
  { month: 'Jul', value: 8100 },
  { month: 'Aug', value: 8350 },
  { month: 'Sep', value: 8200 },
  { month: 'Oct', value: 8600 },
  { month: 'Nov', value: 8920 },
  { month: 'Dec', value: 8920 },
];

const recentInvestments = [
  { id: 1, name: 'VTSAX', type: 'ETF', amount: 500, date: '2024-12-20', return: '+2.4%' },
  { id: 2, name: 'Tesla Inc.', type: 'Stock', amount: 300, date: '2024-12-18', return: '+8.7%' },
  { id: 3, name: 'S&P 500 ETF', type: 'ETF', amount: 400, date: '2024-12-15', return: '+3.2%' },
];

const savingsTips = [
  {
    title: "Automate your savings",
    description: "Set up automatic transfers to reach your emergency fund goal faster.",
    action: "Set Up Transfer"
  },
  {
    title: "Increase vacation savings",
    description: "Add $120/month to stay on track for your June vacation.",
    action: "Update Goal"
  },
  {
    title: "Rebalance portfolio",
    description: "Your stock allocation is higher than recommended 60%.",
    action: "Rebalance"
  }
];

export default function SavingsInvestmentsDashboard() {
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalInvestments = investmentPortfolio.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-success/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <PiggyBank className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-semibold">${totalSavings.toLocaleString()}</p>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.4% this month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-2xl font-semibold">${totalInvestments.toLocaleString()}</p>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.4% this quarter
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals Progress</p>
                <p className="text-2xl font-semibold">67%</p>
                <p className="text-xs text-muted-foreground">Average completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-semibold">$21,370</p>
                <div className="flex items-center text-xs text-success">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15.2% YTD
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track progress towards your financial goals</CardDescription>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savingsGoals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              const remaining = goal.target - goal.current;
              
              return (
                <div key={goal.id} className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{goal.name}</h4>
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
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Target date: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investment Portfolio */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>Asset allocation breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentPortfolio}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ allocation }) => `${allocation}%`}
                  >
                    {investmentPortfolio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {investmentPortfolio.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${item.value.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.allocation}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Growth Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Investment growth over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioGrowth}>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Investments */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Investments</CardTitle>
                <CardDescription>Latest portfolio activity</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInvestments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{investment.name}</p>
                    <p className="text-xs text-muted-foreground">{investment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${investment.amount}</p>
                  <Badge className="text-xs bg-success/10 text-success">
                    {investment.return}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tips & Insights */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Smart Savings Tips</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsTips.map((tip, index) => (
              <div key={index} className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium">{tip.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip.description}
                </p>
                <Button variant="ghost" size="sm" className="text-xs h-8 text-primary hover:text-primary/80 p-0 justify-start">
                  {tip.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}