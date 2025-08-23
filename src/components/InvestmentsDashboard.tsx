import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Brain, BarChart3, Newspaper, DollarSign, PieChart, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock data for market ticker
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

// Mock data
const portfolioOverview = {
  totalValue: 8920,
  totalGain: 756,
  totalGainPercent: 9.3,
  dayChange: 34.52,
  dayChangePercent: 0.39
};

const assetAllocation = [
  { name: 'Stocks', value: 5420, allocation: 61, color: '#1e40af', target: 60 },
  { name: 'Bonds', value: 1780, allocation: 20, color: '#059669', target: 25 },
  { name: 'ETFs', value: 1120, allocation: 12, color: '#7c3aed', target: 10 },
  { name: 'Crypto', value: 600, allocation: 7, color: '#dc2626', target: 5 },
];

const performanceData = {
  '1M': [
    { date: 'Nov 23', value: 8650 },
    { date: 'Nov 30', value: 8720 },
    { date: 'Dec 7', value: 8890 },
    { date: 'Dec 14', value: 8750 },
    { date: 'Dec 21', value: 8920 },
  ],
  '3M': [
    { date: 'Oct', value: 8200 },
    { date: 'Nov', value: 8650 },
    { date: 'Dec', value: 8920 },
  ],
  '6M': [
    { date: 'Jul', value: 7800 },
    { date: 'Aug', value: 8100 },
    { date: 'Sep', value: 8350 },
    { date: 'Oct', value: 8200 },
    { date: 'Nov', value: 8650 },
    { date: 'Dec', value: 8920 },
  ],
  '1Y': [
    { date: 'Dec 23', value: 7200 },
    { date: 'Mar', value: 7500 },
    { date: 'Jun', value: 7800 },
    { date: 'Sep', value: 8350 },
    { date: 'Dec 24', value: 8920 },
  ]
};

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 15, price: 195.89, value: 2938, gain: 234, gainPercent: 8.7 },
  { symbol: 'VTSAX', name: 'Vanguard Total Stock', shares: 25, price: 98.45, value: 2461, gain: 156, gainPercent: 6.8 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, price: 248.50, value: 1988, gain: 312, gainPercent: 18.6 },
  { symbol: 'BTC', name: 'Bitcoin', shares: 0.014, price: 42850, value: 600, gain: -45, gainPercent: -7.0 },
];

const marketNews = [
  {
    id: 1,
    title: 'Tech Stocks Rally on AI Optimism',
    summary: 'Major technology companies see gains as artificial intelligence adoption accelerates across industries.',
    source: 'MarketWatch',
    time: '2 hours ago',
    relevance: 'high'
  },
  {
    id: 2,
    title: 'Federal Reserve Hints at Rate Stability',
    summary: 'Fed officials suggest interest rates may remain steady through Q1 2025, boosting market confidence.',
    source: 'Reuters',
    time: '4 hours ago',
    relevance: 'medium'
  },
  {
    id: 3,
    title: 'Electric Vehicle Sector Outlook',
    summary: 'Analysts remain bullish on EV adoption despite recent market volatility in the sector.',
    source: 'Bloomberg',
    time: '6 hours ago',
    relevance: 'high'
  },
  {
    id: 4,
    title: 'Bond Market Shows Resilience',
    summary: 'Treasury bonds maintain stability as investors seek diversification amid market uncertainty.',
    source: 'Financial Times',
    time: '8 hours ago',
    relevance: 'medium'
  }
];

const generalAdvisorInsights = [
  {
    type: 'opportunity',
    title: 'Market Timing Alert',
    description: 'Historical data suggests Q1 is typically strong for tech stocks. Consider dollar-cost averaging into your positions.',
    confidence: 78,
    action: 'View Strategy'
  },
  {
    type: 'risk',
    title: 'Volatility Warning',
    description: 'Your crypto allocation is experiencing high volatility. Consider taking some profits if you\'re risk-averse.',
    confidence: 85,
    action: 'Review Holdings'
  },
  {
    type: 'growth',
    title: 'Growth Opportunity',
    description: 'Your portfolio is underexposed to international markets. Consider adding emerging market ETFs.',
    confidence: 72,
    action: 'Explore Options'
  }
];

const diversificationInsights = [
  {
    asset: 'Stocks',
    current: 61,
    target: 60,
    status: 'optimal',
    recommendation: 'Your stock allocation is well-balanced. Maintain current position.'
  },
  {
    asset: 'Bonds',
    current: 20,
    target: 25,
    status: 'underweight',
    recommendation: 'Consider increasing bond allocation by 5% for better stability.'
  },
  {
    asset: 'ETFs',
    current: 12,
    target: 10,
    status: 'overweight',
    recommendation: 'ETF allocation is slightly high. Consider rebalancing to bonds.'
  },
  {
    asset: 'Crypto',
    current: 7,
    target: 5,
    status: 'overweight',
    recommendation: 'Crypto allocation exceeds target. Consider taking profits.'
  }
];

export default function InvestmentsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  
  return (
    <div className="space-y-6">
      {/* Market Overview Ticker - Moved from Home Dashboard */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-success/5 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Market Overview</span>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee space-x-8 whitespace-nowrap">
              {[...tickerData, ...tickerData].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">{item.symbol}</span>
                  <span>{item.value}</span>
                  <span className={`flex items-center ${item.positive ? 'text-success' : 'text-destructive'}`}>
                    {item.positive ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-success/5">
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>Total investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-4xl font-bold">${portfolioOverview.totalValue.toLocaleString()}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-success">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    ${portfolioOverview.totalGain} (+{portfolioOverview.totalGainPercent}%)
                  </div>
                  <div className="flex items-center text-xs text-success">
                    <span>Today: +${portfolioOverview.dayChange}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Total Gains Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Gains</p>
                <p className="text-2xl font-semibold text-success">+${portfolioOverview.totalGain}</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {portfolioOverview.totalGainPercent}% return
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Best Performer Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Best Performer</p>
                <p className="text-2xl font-semibold">TSLA</p>
                <div className="flex items-center text-xs text-success mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +18.6% return
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Advisors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Investment Advisor */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>General Investment Advisor</span>
            </CardTitle>
            <CardDescription>Broad market insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generalAdvisorInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-success" />}
                    {insight.type === 'risk' && <TrendingDown className="h-4 w-4 text-destructive" />}
                    {insight.type === 'growth' && <ArrowUpRight className="h-4 w-4 text-primary" />}
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
          </CardContent>
        </Card>

        {/* Optimized Diversification Specialist Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-success" />
              <span>Diversification Specialist</span>
            </CardTitle>
            <CardDescription>Portfolio balance and risk analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {diversificationInsights.map((insight, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{insight.asset}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{insight.current}%</span>
                    <Badge 
                      variant={insight.status === 'optimal' ? 'default' : insight.status === 'underweight' ? 'secondary' : 'destructive'}
                      className={`text-xs ${
                        insight.status === 'optimal' ? 'bg-success/10 text-success border-success/20' : ''
                      }`}
                    >
                      {insight.status}
                    </Badge>
                  </div>
                </div>
                <div className="bg-muted/30 p-2 rounded text-xs text-muted-foreground">
                  💡 {insight.recommendation}
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full">
                Get Rebalancing Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Optimized Asset Allocation Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current portfolio distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ allocation }) => `${allocation}%`}
                  >
                    {assetAllocation.map((entry, index) => (
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {assetAllocation.map((item, index) => (
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

        {/* Performance Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Historical value over time</CardDescription>
              </div>
              <div className="flex space-x-1">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className="text-xs h-8"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData[selectedPeriod as keyof typeof performanceData]}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-xs" />
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
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Holdings & Market News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimized Top Holdings Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
            <CardDescription>Your largest investment positions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{holding.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {holding.shares} shares @ ${holding.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${holding.value.toLocaleString()}</p>
                  <div className={`flex items-center text-xs ${holding.gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {holding.gain >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {holding.gainPercent > 0 ? '+' : ''}{holding.gainPercent}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market News */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Newspaper className="h-5 w-5 text-primary" />
              <span>Market News</span>
            </CardTitle>
            <CardDescription>Recent updates relevant to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketNews.map((news) => (
              <div key={news.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium leading-tight">{news.title}</h4>
                  <Badge 
                    variant={news.relevance === 'high' ? 'default' : 'secondary'}
                    className={`text-xs ml-2 ${
                      news.relevance === 'high' ? 'bg-primary/10 text-primary border-primary/20' : ''
                    }`}
                  >
                    {news.relevance}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {news.summary}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}