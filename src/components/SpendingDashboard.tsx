import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CreditCard, TrendingDown, ArrowDownRight, ArrowUpRight, ShoppingCart, Car, Home, Coffee, MoreHorizontal, X, Brain, Calendar, Settings, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data
const categorySpending = [
  { category: 'Food & Dining', amount: 1200, budget: 1000, color: '#1e40af', icon: Coffee },
  { category: 'Transportation', amount: 650, budget: 800, color: '#059669', icon: Car },
  { category: 'Housing', amount: 1800, budget: 2000, color: '#7c3aed', icon: Home },
  { category: 'Shopping', amount: 450, budget: 600, color: '#dc2626', icon: ShoppingCart },
  { category: 'Entertainment', amount: 300, budget: 400, color: '#ea580c', icon: Coffee },
];

const budgetTemplates = [
  { name: '50/30/20 Rule', description: 'Needs, Wants, Savings', categories: { needs: 50, wants: 30, savings: 20 } },
  { name: 'Conservative', description: 'Lower risk spending', categories: { housing: 30, food: 15, transportation: 10, entertainment: 5, savings: 40 } },
  { name: 'Aggressive Saver', description: 'Maximize savings', categories: { housing: 25, food: 10, transportation: 8, entertainment: 3, savings: 54 } },
];

const budgetSuggestions = [
  { category: 'Food & Dining', current: 1000, suggested: 900, reasoning: 'Based on your cooking habits, you could save by meal planning' },
  { category: 'Transportation', current: 800, suggested: 650, reasoning: 'Consider carpooling or public transport for 2 days/week' },
  { category: 'Entertainment', current: 400, suggested: 450, reasoning: 'You can afford slightly more for entertainment based on your savings rate' },
];

const monthlyTrend = [
  { month: 'Jun', amount: 4800 },
  { month: 'Jul', amount: 4200 },
  { month: 'Aug', amount: 4600 },
  { month: 'Sep', amount: 4300 },
  { month: 'Oct', amount: 4900 },
  { month: 'Nov', amount: 4400 },
  { month: 'Dec', amount: 4400 },
];

const activeSubscriptions = [
  { id: 1, name: 'Netflix', category: 'Entertainment', amount: 15.99, nextBilling: '2025-01-05', status: 'active' },
  { id: 2, name: 'Spotify Premium', category: 'Entertainment', amount: 9.99, nextBilling: '2025-01-12', status: 'active' },
  { id: 3, name: 'Adobe Creative', category: 'Software', amount: 52.99, nextBilling: '2025-01-08', status: 'active' },
  { id: 4, name: 'Gym Membership', category: 'Health', amount: 29.99, nextBilling: '2025-01-01', status: 'active' },
  { id: 5, name: 'Cloud Storage', category: 'Software', amount: 9.99, nextBilling: '2025-01-15', status: 'paused' },
  { id: 6, name: 'News Subscription', category: 'News', amount: 12.99, nextBilling: '2025-01-20', status: 'active' },
];

const historicalAnalysis = [
  {
    category: 'Food & Dining',
    currentMonth: 1200,
    historicalAvg: 1350,
    change: -11.1,
    trend: 'improving',
    insight: 'Great progress! You\'ve reduced dining expenses by cooking more at home.'
  },
  {
    category: 'Transportation',
    currentMonth: 650,
    historicalAvg: 580,
    change: 12.1,
    trend: 'concerning',
    insight: 'Gas prices and ride-share usage have increased. Consider carpooling options.'
  },
  {
    category: 'Shopping',
    currentMonth: 450,
    historicalAvg: 520,
    change: -13.5,
    trend: 'improving',
    insight: 'You\'re making more conscious purchase decisions. Keep it up!'
  },
  {
    category: 'Entertainment',
    currentMonth: 300,
    historicalAvg: 380,
    change: -21.1,
    trend: 'improving',
    insight: 'Finding more free entertainment options has saved you money.'
  }
];

const recentTransactions = [
  { id: 1, merchant: 'Starbucks', category: 'Food & Dining', amount: -4.95, date: '2024-12-22', type: 'card' },
  { id: 2, merchant: 'Uber', category: 'Transportation', amount: -12.40, date: '2024-12-22', type: 'card' },
  { id: 3, merchant: 'Amazon', category: 'Shopping', amount: -89.99, date: '2024-12-21', type: 'card' },
  { id: 4, merchant: 'Whole Foods', category: 'Food & Dining', amount: -67.23, date: '2024-12-21', type: 'card' },
  { id: 5, merchant: 'Shell', category: 'Transportation', amount: -45.80, date: '2024-12-20', type: 'card' },
];

export default function SpendingDashboard() {
  const totalSpending = categorySpending.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = categorySpending.reduce((sum, item) => sum + item.budget, 0);
  const totalSubscriptions = activeSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount, 0);
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-destructive/5">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>December 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-4xl font-bold">${totalSpending.toLocaleString()}</p>
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-success mr-4">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    8.3% vs last month
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Under Budget
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Avg Daily Spending Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Avg Daily</p>
                <p className="text-2xl font-semibold">$147</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  $12 less than usual
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily target:</span>
                    <span className="font-medium">$150</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Best day:</span>
                    <span className="font-medium text-success">$89 (Dec 20)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Velocity:</span>
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                      Slowing
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Budget Remaining Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Budget Left</p>
                <p className="text-2xl font-semibold">${(totalBudget - totalSpending).toLocaleString()}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>{Math.round(((totalBudget - totalSpending) / totalBudget) * 100)}% remaining</span>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Days left:</span>
                    <span className="font-medium">9 days</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Daily budget:</span>
                    <span className="font-medium">$89</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Burn rate:</span>
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                      Normal
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Sections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Subscriptions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage your recurring payments</CardDescription>
              </div>
              <Badge variant="secondary">
                ${totalSubscriptions.toFixed(2)}/month
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSubscriptions.slice(0, 4).map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{subscription.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Next: {subscription.nextBilling}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold text-sm">${subscription.amount}</p>
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Potential Savings</span>
                <div className="text-right">
                  <span className="text-sm text-success font-medium">$23/month</span>
                  <p className="text-xs text-muted-foreground">Cancel unused services</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending vs Historical Average */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>AI Spending Analysis</span>
            </CardTitle>
            <CardDescription>
              Compare current spending to your historical patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {historicalAnalysis.map((analysis, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{analysis.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">${analysis.currentMonth}</span>
                    <Badge 
                      variant={analysis.trend === 'improving' ? 'default' : 'destructive'}
                      className={`text-xs ${
                        analysis.trend === 'improving' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : ''
                      }`}
                    >
                      {analysis.change > 0 ? '+' : ''}{analysis.change.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>vs avg: ${analysis.historicalAvg}</span>
                  <span className={analysis.trend === 'improving' ? 'text-success' : 'text-destructive'}>
                    {analysis.trend === 'improving' ? '↓' : '↑'} {analysis.trend}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                  💡 {analysis.insight}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Budget Management Feature */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Budget Management</span>
              </CardTitle>
              <CardDescription>Manage your spending budgets and get AI suggestions</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Budgets
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Budget Management Center</DialogTitle>
                  <DialogDescription>
                    Set and adjust your spending budgets for each category
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="edit">Edit Budgets</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Category Budget Allocation</h3>
                        {categorySpending.map((category, index) => {
                          const Icon = category.icon;
                          const percentage = (category.amount / category.budget) * 100;
                          
                          return (
                            <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Icon className="h-5 w-5 text-primary" />
                                  <span className="font-medium">{category.category}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold">${category.budget}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ${category.amount} spent ({Math.round(percentage)}%)
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Slider
                                  value={[category.budget]}
                                  max={3000}
                                  step={50}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>$0</span>
                                  <span>Current: ${category.budget}</span>
                                  <span>$3,000</span>
                                </div>
                              </div>
                              
                              <Progress value={Math.min(percentage, 100)} className="h-2" />
                              
                              {percentage > 100 && (
                                <div className="flex items-center space-x-2 text-destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-sm">Over budget by ${category.amount - category.budget}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                          <span className="font-semibold">Total Monthly Budget</span>
                          <span className="text-xl font-bold">${totalBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="templates" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Budget Templates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {budgetTemplates.map((template, index) => (
                          <Card key={index} className="border border-border">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="space-y-2">
                                {Object.entries(template.categories).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="capitalize">{key}:</span>
                                    <span className="font-medium">{value}%</span>
                                  </div>
                                ))}
                              </div>
                              <Button variant="outline" size="sm" className="w-full">
                                Apply Template
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="suggestions" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">AI Budget Suggestions</h3>
                      <div className="space-y-4">
                        {budgetSuggestions.map((suggestion, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{suggestion.category}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                  {suggestion.suggested > suggestion.current ? '+' : ''}
                                  ${suggestion.suggested - suggestion.current}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Current: </span>
                                <span className="font-medium">${suggestion.current}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Suggested: </span>
                                <span className="font-medium">${suggestion.suggested}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                              💡 {suggestion.reasoning}
                            </p>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Apply</Button>
                              <Button variant="ghost" size="sm">Dismiss</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Budget vs Actual Analysis</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border border-border">
                          <CardHeader>
                            <CardTitle className="text-base">Budget Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={categorySpending}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="category" className="text-xs" angle={-45} textAnchor="end" height={60} />
                                <YAxis className="text-xs" />
                                <Tooltip />
                                <Bar dataKey="budget" fill="hsl(var(--muted))" name="Budget" opacity={0.5} />
                                <Bar dataKey="amount" fill="hsl(var(--primary))" name="Actual" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-success/10 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="h-5 w-5 text-success" />
                              <span className="font-medium text-success">Budget Summary</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Total Budget:</span>
                                <span className="font-medium">${totalBudget.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Spent:</span>
                                <span className="font-medium">${totalSpending.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Remaining:</span>
                                <span className="font-medium text-success">${(totalBudget - totalSpending).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Budget Utilization:</span>
                                <span className="font-medium">{Math.round((totalSpending / totalBudget) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {categorySpending.map((category, index) => {
                              const percentage = (category.amount / category.budget) * 100;
                              const isOverBudget = percentage > 100;
                              
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                                  <span className="text-sm">{category.category}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-sm font-medium ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                                      {Math.round(percentage)}%
                                    </span>
                                    {isOverBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Budget Adherence</span>
              </div>
              <Badge className="bg-success text-success-foreground">
                {Math.round((totalSpending / totalBudget) * 100)}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Categories On Track</span>
              </div>
              <span className="text-sm font-medium">
                {categorySpending.filter(cat => (cat.amount / cat.budget) <= 1).length}/{categorySpending.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <Badge variant="secondary">
                {budgetSuggestions.length} available
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Quick Budget Overview</h4>
            {categorySpending.slice(0, 3).map((category, index) => {
              const percentage = (category.amount / category.budget) * 100;
              const Icon = category.icon;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${percentage > 100 ? 'bg-destructive' : 'bg-primary'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest spending activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.merchant}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${Math.abs(transaction.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}