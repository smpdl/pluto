import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, PiggyBank, CreditCard, Bell, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data
const spendingData = [
  { month: 'Jan', income: 5200, spending: 4800 },
  { month: 'Feb', income: 5200, spending: 4200 },
  { month: 'Mar', income: 5400, spending: 4600 },
  { month: 'Apr', income: 5200, spending: 4300 },
  { month: 'May', income: 5600, spending: 4900 },
  { month: 'Jun', income: 5200, spending: 4400 },
];

const recommendations = [
  {
    id: 1,
    title: "You're spending 23% less on dining this month",
    description: "Keep up the great work! You've saved $127 compared to last month.",
    type: "positive",
    action: "View Details"
  },
  {
    id: 2,
    title: "Consider increasing your emergency fund",
    description: "Aim for 6 months of expenses. You're currently at 3.2 months.",
    type: "suggestion",
    action: "Set Goal"
  },
  {
    id: 3,
    title: "Your investment portfolio is up 8.4%",
    description: "Great performance this quarter! Consider rebalancing.",
    type: "positive",
    action: "Review Portfolio"
  }
];

// Marquee ticker data - only shown on home dashboard
const tickerData = [
  { symbol: 'S&P 500', value: '4,783.45', change: '+0.8%', positive: true },
  { symbol: 'NASDAQ', value: '15,089.90', change: '+1.2%', positive: true },
  { symbol: 'DOW', value: '37,428.45', change: '+0.3%', positive: true },
  { symbol: 'BTC', value: '$42,850', change: '-2.1%', positive: false },
  { symbol: 'ETH', value: '$2,456', change: '+1.8%', positive: true },
  { symbol: 'AAPL', value: '$195.89', change: '+2.4%', positive: true },
  { symbol: 'TSLA', value: '$248.50', change: '+5.2%', positive: true },
  { symbol: 'MSFT', value: '$384.30', change: '+1.1%', positive: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Pluto Score */}
        <Card className="md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pluto Score</CardTitle>
                <CardDescription>Your financial health rating</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Excellent
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-muted flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent border-b-transparent rotate-45"></div>
                  <span className="text-2xl font-bold text-primary">87</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Income Stability</span>
                      <span className="text-success">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spending Control</span>
                      <span className="text-success">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Savings Rate</span>
                      <span className="text-primary">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Monthly Income Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-semibold">$5,200</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-success">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    2.1% vs last month
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Next payment:</span>
                    <span className="font-medium">Dec 31</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Primary source:</span>
                    <span className="font-medium">Salary (81%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Monthly Spending Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Monthly Spending</p>
                <p className="text-2xl font-semibold">$4,400</p>
                <div className="flex items-center text-xs text-success mt-2">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  8.3% vs last month
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Top category:</span>
                    <span className="font-medium">Housing (41%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Days left:</span>
                    <span className="font-medium">9 days</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending vs Income Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Income vs Spending</CardTitle>
            <CardDescription>
              Monthly comparison over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingData}>
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
                  stackId="1" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="spending" 
                  stackId="2" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Insights & Tips</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Personalized recommendations for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium leading-tight">{rec.title}</h4>
                  {rec.type === 'positive' && (
                    <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-8 text-primary hover:text-primary/80 p-0 justify-start"
                >
                  {rec.action}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-semibold">$12,450</p>
              </div>
              <PiggyBank className="h-8 w-8 text-success" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Goal Progress</span>
                <span>62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-2xl font-semibold">$8,920</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-success">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.4% this quarter
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit Score</p>
                <p className="text-2xl font-semibold">742</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Good
              </Badge>
            </div>
            <div className="mt-4 flex items-center text-xs text-success">
              <span>Improved by 12 points</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-semibold">$21,370</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-success">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +15.2% this year
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}