import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PiggyBank, Target, Trophy, Calendar, Plus, Clock, TrendingUp, Zap, Gift, Star } from 'lucide-react';

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

export default function SavingsDashboard() {
  const [showNewGoal, setShowNewGoal] = useState(false);
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = (totalSavings / totalTargets) * 100;
  
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
                <p className="text-2xl font-semibold">$1,250</p>
                <p className="text-xs text-success">+15% vs target</p>
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
              <div key={index} className="p-4 bg-card rounded-lg space-y-3">
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