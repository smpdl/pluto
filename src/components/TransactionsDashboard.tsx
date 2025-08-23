import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CreditCard, Filter, Download, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

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

export default function TransactionsDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount, dateRange]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/accounts', { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedAccount(data[0].mask);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!selectedAccount) return;
    
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const token = localStorage.getItem('access_token');
      const response = await fetch(`/fake/plaid/transactions?account_id=${selectedAccount}&start_date=${startDate}&end_date=${endDate}&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      'salary': '💰',
      'rent': '🏠',
      'utilities': '⚡',
      'subscriptions': '📱',
      'groceries': '🛒',
      'dining': '🍽️',
      'transport': '🚗',
      'savings': '💾',
      'interest': '📈',
      'investment': '📊',
      'dividend': '💵',
      'deposit': '💳',
      'withdrawal': '🏧'
    };
    return categoryIcons[category] || '💳';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'salary': 'text-green-600',
      'interest': 'text-green-600',
      'dividend': 'text-green-600',
      'savings': 'text-green-600',
      'deposit': 'text-green-600',
      'rent': 'text-red-600',
      'utilities': 'text-red-600',
      'subscriptions': 'text-red-600',
      'groceries': 'text-orange-600',
      'dining': 'text-orange-600',
      'transport': 'text-blue-600',
      'investment': 'text-purple-600',
      'withdrawal': 'text-red-600'
    };
    return categoryColors[category] || 'text-gray-600';
  };

  const filteredTransactions = transactions.filter(t => 
    !filterCategory || t.category === filterCategory
  );

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const categories = [...new Set(transactions.map(t => t.category))] as string[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Account Selection and Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Account & Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Select Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.mask} value={account.mask}>
                      {account.nickname || account.name} (••••{account.mask})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category Filter</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-semibold text-green-600">
                  ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600">
                  ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Flow</p>
                <p className={`text-2xl font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${(totalIncome - totalExpenses).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transactions found
              </CardDescription>
            </div>
            {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Loading transactions...' : 'No transactions found'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.transaction_id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    {transaction.pending && (
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
