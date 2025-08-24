import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SimpleBarChart, SimplePieChart } from './ui/chart';
import { 
  CreditCard, 
  Filter, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Search,
  RefreshCw,
  PieChart,
  BarChart3,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface TransactionWithAccount extends Transaction {
  accountName: string;
  accountType: string;
  accountMask: string;
}

export default function TransactionsDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allTransactions, setAllTransactions] = useState<TransactionWithAccount[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Function to navigate to settings for account linking
  const navigateToSettings = () => {
    console.log('Navigating to settings...');
    // This will be handled by the parent component
    window.location.hash = '#settings';
    console.log('Hash set to:', window.location.hash);
  };

  useEffect(() => {
    console.log('Accounts changed - setting selectedAccounts:', accounts);
    if (accounts.length > 0) {
      const masks = accounts.map(acc => acc.mask);
      console.log('Setting selectedAccounts to:', masks);
      setSelectedAccounts(masks);
    } else {
      console.log('No accounts, clearing selectedAccounts');
      setSelectedAccounts([]);
    }
  }, [accounts]);

  useEffect(() => {
    console.log('useEffect triggered - selectedAccounts:', selectedAccounts, 'accounts:', accounts);
    if (selectedAccounts.length > 0 && accounts.length > 0) {
      console.log('Calling fetchAllTransactions...');
      fetchAllTransactions();
    } else {
      console.log('Not calling fetchAllTransactions - missing data:', {
        selectedAccountsLength: selectedAccounts.length,
        accountsLength: accounts.length
      });
    }
  }, [selectedAccounts, dateRange, accounts]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching accounts with token:', token);
      
      if (!token) {
        console.log('No authentication token found - user needs to log in');
        return;
      }
      
      const response = await fetch('/accounts', { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Accounts response status:', response.status);
      
      if (response.status === 401) {
        console.log('Token expired or invalid - user needs to log in again');
        localStorage.removeItem('access_token');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Accounts data:', data);
      setAccounts(data);
      
      // No accounts found - user needs to link accounts through settings
      if (data.length === 0) {
        console.log('No accounts found - user needs to link accounts through settings');
      } else {
        console.log(`Found ${data.length} linked account(s)`);
        console.log('Account masks:', data.map(acc => acc.mask));
        // Fetch mathematical insights from backend
        fetchFinancialSummary();
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const token = localStorage.getItem('access_token');
      console.log('Fetching transactions with token:', token);
      console.log('Selected accounts:', selectedAccounts);
      console.log('Date range:', startDate, 'to', endDate);
      
      if (!token) {
        console.log('No authentication token found - user needs to log in');
        setLoading(false);
        return;
      }
      
      const allTxns: TransactionWithAccount[] = [];

      for (const accountMask of selectedAccounts) {
        try {
          const url = `/fake/plaid/transactions?account_id=${accountMask}&start_date=${startDate}&end_date=${endDate}&limit=100`;
          console.log('Fetching from URL:', url);
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`Response for account ${accountMask}:`, response.status);
          
          if (response.status === 401) {
            console.log('Token expired or invalid - user needs to log in again');
            localStorage.removeItem('access_token');
            setLoading(false);
            return;
          }
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Data for account ${accountMask}:`, data);
            const account = accounts.find(acc => acc.mask === accountMask);
            const transactionsWithAccount = (data.transactions || []).map((txn: Transaction) => ({
              ...txn,
              accountName: account?.name || 'Unknown Account',
              accountType: account?.type || 'unknown',
              accountMask: accountMask
            }));
            allTxns.push(...transactionsWithAccount);
          } else {
            console.error(`HTTP error for account ${accountMask}:`, response.status, response.statusText);
          }
        } catch (error) {
          console.error(`Error fetching transactions for account ${accountMask}:`, error);
        }
      }
      
      console.log('All transactions:', allTxns);
      setAllTransactions(allTxns);
      
      if (allTxns.length > 0) {
        console.log(`Successfully loaded ${allTxns.length} transactions from ${selectedAccounts.length} account(s)`);
        // Fetch updated mathematical insights after loading transactions
        fetchFinancialSummary();
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
      'salary': 'text-green-600 bg-green-50',
      'interest': 'text-green-600 bg-green-50',
      'dividend': 'text-green-600 bg-green-50',
      'savings': 'text-green-600 bg-green-50',
      'deposit': 'text-green-600 bg-green-50',
      'rent': 'text-red-600 bg-red-50',
      'utilities': 'text-red-600 bg-red-50',
      'subscriptions': 'text-red-600 bg-red-50',
      'groceries': 'text-orange-600 bg-orange-50',
      'dining': 'text-orange-600 bg-orange-50',
      'transport': 'text-blue-600 bg-blue-50',
      'investment': 'text-purple-600 bg-purple-50',
      'withdrawal': 'text-red-600 bg-red-50'
    };
    return categoryColors[category] || 'text-gray-600 bg-gray-50';
  };

  const getAccountTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'checking': 'bg-blue-100 text-blue-700',
      'savings': 'bg-green-100 text-green-700',
      'trading': 'bg-purple-100 text-purple-700'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-700';
  };

  // Get categories from transactions (filter out undefined/null values)
  const rawCategories = allTransactions.map(t => t.category);
  console.log('Raw categories from transactions:', rawCategories);
  const categories = [...new Set(rawCategories.filter(Boolean))] as string[];
  console.log('Filtered categories:', categories);

  // Filter and sort transactions
  const filteredTransactions = allTransactions
    .filter(t => {
      const matchesCategory = filterCategory === 'all' || !filterCategory || t.category === filterCategory;
      const matchesSearch = !searchQuery || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.merchant_name && t.merchant_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Also check global search from URL hash
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const globalSearch = urlParams.get('search');
      const matchesGlobalSearch = !globalSearch || 
        t.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (t.merchant_name && t.merchant_name.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(globalSearch.toLowerCase()));
      
      return matchesCategory && matchesSearch && matchesGlobalSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  console.log('Filtered transactions:', {
    total: allTransactions.length,
    filtered: filteredTransactions.length,
    filterCategory: filterCategory,
    searchQuery: searchQuery,
    categories: categories
  });

  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [loadingMath, setLoadingMath] = useState(false);

  // Fetch financial summary from backend (mathematical calculations)
  const fetchFinancialSummary = async () => {
    if (!localStorage.getItem('access_token')) return;
    
    setLoadingMath(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/insights/financial-summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFinancialSummary(data);
        console.log('Financial summary loaded:', data);
      }
    } catch (error) {
      console.error('Error fetching financial summary:', error);
    } finally {
      setLoadingMath(false);
    }
  };

  // Export transactions to CSV
  const exportTransactions = () => {
    if (allTransactions.length === 0) return;
    
    // Create CSV content
    const headers = ['Date', 'Name', 'Merchant', 'Category', 'Amount', 'Account', 'Status'];
    const csvContent = [
      headers.join(','),
      ...allTransactions.map(txn => [
        new Date(txn.date).toLocaleDateString('en-US'),
        `"${txn.name}"`,
        `"${txn.merchant_name || ''}"`,
        txn.category,
        txn.amount.toFixed(2),
        txn.accountName,
        txn.pending ? 'Pending' : 'Completed'
      ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use backend calculations or fallback to frontend
  const totalIncome = financialSummary?.mathematical_summary?.income_total || 
    filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = financialSummary?.mathematical_summary?.expense_total || 
    filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netFlow = financialSummary?.mathematical_summary?.net_flow || (totalIncome - totalExpenses);

  const pendingTransactions = filteredTransactions.filter(t => t.pending);
  const completedTransactions = filteredTransactions.filter(t => !t.pending);

      console.log('Rendering TransactionsDashboard with:', { 
    accounts: accounts.length, 
    transactions: allTransactions.length,
    selectedAccounts: selectedAccounts.length,
    loading: loading,
    filterCategory: filterCategory,
    dateRange: dateRange
  });
  
  // Check authentication first
  const token = localStorage.getItem('access_token');
  console.log('Auth check - Token exists:', !!token, 'Token value:', token);
  
  // Demo login function
  const demoLogin = async () => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'demo@example.com',
          password: 'demo123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        console.log('Demo login successful!');
        window.location.reload(); // Refresh to show dashboard
      } else {
        console.error('Demo login failed:', response.status);
      }
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };
  
  if (!token) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Transactions Dashboard</h1>
        <p className="text-muted-foreground mb-4">Please log in to view your transactions</p>
        <div className="space-y-4">
          <Button onClick={demoLogin} className="bg-green-600 text-white mr-2">
            Demo Login
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Go to Login
          </Button>
          <div className="text-sm text-muted-foreground">
            <p>Debug: No access token found in localStorage</p>
            <p>Click "Demo Login" to use demo@example.com / demo123</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Checking render conditions:', { loading, accountsLength: accounts.length, hasToken: !!token });
  
  // Show loading state while fetching accounts
  if (loading && accounts.length === 0) {
    console.log('Showing loading state');
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Transactions Dashboard</h1>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading accounts...</span>
        </div>
      </div>
    );
  }

  // Show no accounts state
  if (accounts.length === 0 && !loading) {
    console.log('Showing no accounts state');
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Transactions Dashboard</h1>
        <p className="text-muted-foreground mb-4">No accounts found. Link your first account to get started.</p>
        <Button onClick={navigateToSettings} className="bg-primary text-primary-foreground">
          <CreditCard className="h-4 w-4 mr-2" />
          Link Account
        </Button>
      </div>
    );
  }

  console.log('Rendering main dashboard content');

  console.log('About to render main dashboard JSX');
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transactions
          </h1>
                      <p className="text-muted-foreground mt-1">
              Monitor and analyze your financial activity across all accounts
              {searchQuery && (
                <span className="ml-2 text-sm text-primary">
                  • {filteredTransactions.length} results for "{searchQuery}"
                </span>
              )}
            </p>
        </div>
        <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAllTransactions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={navigateToSettings}
              disabled={loading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Link Account
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportTransactions()}
              disabled={allTransactions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500 rounded-xl">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-700">
                  ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-500 rounded-xl">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">
                  ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Flow</p>
                <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accounts</p>
                <p className="text-2xl font-bold text-purple-700">
                  {accounts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Accounts State */}
      {accounts.length === 0 && !loading && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {!localStorage.getItem('access_token') ? 'Please log in first' : 'No linked accounts found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {!localStorage.getItem('access_token') 
                    ? 'You need to log in to view your transactions'
                    : 'Link your bank accounts to view transactions and financial insights'
                  }
                </p>
                <div className="flex flex-col space-y-2">
                  {!localStorage.getItem('access_token') ? (
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="bg-primary text-primary-foreground"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Go to Login
                    </Button>
                  ) : (
                    <Button 
                      onClick={navigateToSettings} 
                      className="bg-primary text-primary-foreground"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Link Account
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {!localStorage.getItem('access_token') 
                      ? 'Please log in with your credentials'
                      : 'Go to Settings → Link Account to connect your bank accounts'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Filters */}
      {accounts.length > 0 && (
        <>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search Transactions</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                    placeholder="Search by name, merchant, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {/* Show global search indicator */}
                  {(() => {
                    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
                    const globalSearch = urlParams.get('search');
                    return globalSearch && globalSearch !== searchQuery ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Global search: "{globalSearch}" • <button 
                          onClick={() => setSearchQuery(globalSearch)}
                          className="text-primary hover:underline"
                        >
                          Use this search
                        </button>
                      </p>
                    ) : null;
                  })()}
                  </div>
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
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                                        {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category && category.charAt ? category.charAt(0).toUpperCase() + category.slice(1) : category}
                    </SelectItem>
                  ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account Selection */}
              <div className="space-y-2">
                <Label>Select Accounts</Label>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((account) => (
                    <Button
                      key={account.mask}
                      variant={selectedAccounts.includes(account.mask) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedAccounts.includes(account.mask)) {
                          setSelectedAccounts(selectedAccounts.filter(acc => acc !== account.mask));
                        } else {
                          setSelectedAccounts([...selectedAccounts, account.mask]);
                        }
                      }}
                      className="flex items-center space-x-2"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>{account.nickname || account.name}</span>
                      <Badge variant="secondary" className={getAccountTypeColor(account.type)}>
                        {account.type}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Transactions Display */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>All ({filteredTransactions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Completed ({completedTransactions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Pending ({pendingTransactions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                <TransactionsList transactions={filteredTransactions} searchQuery={searchQuery} />
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                <TransactionsList transactions={completedTransactions} searchQuery={searchQuery} />
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                <TransactionsList transactions={pendingTransactions} searchQuery={searchQuery} />
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading insights...</p>
                  </div>
                </div>
              ) : (
                <TransactionsInsights transactions={filteredTransactions} financialSummary={financialSummary} loadingMath={loadingMath} />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

// Enhanced Transaction List Component
function TransactionsList({ transactions, searchQuery }: { transactions: TransactionWithAccount[], searchQuery: string }) {
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
      'salary': 'text-green-600 bg-green-50',
      'interest': 'text-green-600 bg-green-50',
      'dividend': 'text-green-600 bg-green-50',
      'savings': 'text-green-600 bg-green-50',
      'deposit': 'text-green-600 bg-green-50',
      'rent': 'text-red-600 bg-red-50',
      'utilities': 'text-red-600 bg-red-50',
      'subscriptions': 'text-red-600 bg-red-50',
      'groceries': 'text-orange-600 bg-orange-50',
      'dining': 'text-orange-600 bg-orange-50',
      'transport': 'text-blue-600 bg-blue-50',
      'investment': 'text-purple-600 bg-purple-50',
      'withdrawal': 'text-red-600 bg-red-50'
    };
    return categoryColors[category] || 'text-gray-600 bg-gray-50';
  };

  const getAccountTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      'checking': 'bg-blue-100 text-blue-700',
      'savings': 'bg-green-100 text-green-700',
      'trading': 'bg-purple-100 text-purple-700'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-700';
  };

  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {searchQuery ? 'No search results found' : 'No transactions found'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No transactions match "${searchQuery}". Try different keywords or clear the search.`
                  : 'Try adjusting your filters or search criteria'
                }
              </p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Use the search bar above to clear this search
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <div 
              key={transaction.transaction_id} 
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="p-3 bg-muted rounded-xl">
                  <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm truncate">{transaction.name}</p>
                    {transaction.pending && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getAccountTypeColor(transaction.accountType)}`}>
                      {transaction.accountName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {transaction.amount >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <p className={`font-bold text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Transactions Insights Component
function TransactionsInsights({ transactions, financialSummary, loadingMath }: { transactions: TransactionWithAccount[], financialSummary: any, loadingMath: boolean }) {
  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'salary': 'text-green-600 bg-green-50',
      'interest': 'text-green-600 bg-green-50',
      'dividend': 'text-green-600 bg-green-50',
      'savings': 'text-green-600 bg-green-50',
      'deposit': 'text-green-600 bg-green-50',
      'rent': 'text-red-600 bg-red-50',
      'utilities': 'text-red-600 bg-red-50',
      'subscriptions': 'text-red-600 bg-red-50',
      'groceries': 'text-orange-600 bg-orange-50',
      'dining': 'text-orange-600 bg-orange-50',
      'transport': 'text-blue-600 bg-blue-50',
      'investment': 'text-purple-600 bg-purple-50',
      'withdrawal': 'text-red-600 bg-red-50'
    };
    return categoryColors[category] || 'text-gray-600 bg-gray-50';
  };

  const categoryTotals = transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + Math.abs(txn.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, amount], index) => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: getCategoryColor(category).includes('green') ? '#10b981' : 
             getCategoryColor(category).includes('red') ? '#ef4444' :
             getCategoryColor(category).includes('orange') ? '#f97316' :
             getCategoryColor(category).includes('blue') ? '#3b82f6' :
             getCategoryColor(category).includes('purple') ? '#8b5cf6' : '#6b7280',
      key: `${category}-${index}` // Ensure unique key
    }));

  console.log('Top categories for chart:', topCategories);

  const accountTotals = Object.entries(
    transactions.reduce((acc, txn) => {
      acc[txn.accountName] = (acc[txn.accountName] || 0) + Math.abs(txn.amount);
      return acc;
    }, {} as Record<string, number>)
  ).map(([account, amount], index) => ({
    label: account,
    value: amount,
    color: '#3b82f6',
    key: `${account}-${index}` // Ensure unique key
  }));

  console.log('Account totals for chart:', accountTotals);

  const monthlyData = transactions.reduce((acc, txn) => {
    const month = new Date(txn.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + Math.abs(txn.amount);
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-6)
    .map(([month, amount], index) => ({
      label: month,
      value: amount,
      color: '#10b981',
      key: `${month}-${index}` // Ensure unique key
    }));

  console.log('Monthly chart data:', monthlyChartData);
  
  // Check for duplicate labels
  const categoryLabels = topCategories.map(item => item.label);
  const accountLabels = accountTotals.map(item => item.label);
  const monthLabels = monthlyChartData.map(item => item.label);
  
  console.log('Category labels:', categoryLabels);
  console.log('Account labels:', accountLabels);
  console.log('Month labels:', monthLabels);
  
  // Check for duplicates
  const duplicateCategories = categoryLabels.filter((label, index) => categoryLabels.indexOf(label) !== index);
  const duplicateAccounts = accountLabels.filter((label, index) => accountLabels.indexOf(label) !== index);
  const duplicateMonths = monthLabels.filter((label, index) => monthLabels.indexOf(label) !== index);
  
  if (duplicateCategories.length > 0) console.warn('Duplicate category labels:', duplicateCategories);
  if (duplicateAccounts.length > 0) console.warn('Duplicate account labels:', duplicateAccounts);
  if (duplicateMonths.length > 0) console.warn('Duplicate month labels:', duplicateMonths);

  return (
    <div className="space-y-6">
      {/* Mathematical Insights from Backend */}
      {loadingMath ? (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
              <span className="text-indigo-700">Calculating mathematical insights...</span>
            </div>
          </CardContent>
        </Card>
      ) : financialSummary ? (
        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-700">
              <BarChart3 className="h-5 w-5" />
              <span>Mathematical Analysis (Backend)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Mean Transaction</p>
                <p className="text-lg font-bold text-indigo-700">
                  ${financialSummary.mathematical_summary?.mean?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Median Transaction</p>
                <p className="text-lg font-bold text-indigo-700">
                  ${financialSummary.mathematical_summary?.median?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Std Deviation</p>
                <p className="text-lg font-bold text-indigo-700">
                  ${financialSummary.mathematical_summary?.standard_deviation?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Variance</p>
                <p className="text-lg font-bold text-indigo-700">
                  ${financialSummary.mathematical_summary?.variance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Min Transaction</p>
                  <p className="text-sm font-semibold text-indigo-700">
                    ${financialSummary.mathematical_summary?.min_value?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Max Transaction</p>
                  <p className="text-sm font-semibold text-indigo-700">
                    ${financialSummary.mathematical_summary?.max_value?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                  <p className="text-sm font-semibold text-indigo-700">
                    {financialSummary.mathematical_summary?.total_transactions || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="text-lg font-bold text-blue-700">{financialSummary.mathematical_summary?.total_transactions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Transaction</p>
                <p className="text-lg font-bold text-green-700">
                  ${financialSummary.mathematical_summary?.avg_value?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-lg font-bold text-purple-700">
                  {financialSummary.mathematical_summary?.unique_categories || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimplePieChart 
          data={topCategories} 
          title="Top Spending Categories" 
        />
        <SimpleBarChart 
          data={accountTotals} 
          title="Account Activity" 
        />
      </div>
      
      <SimpleBarChart 
        data={monthlyChartData} 
        title="Monthly Transaction Volume" 
        height={150}
      />
    </div>
  );
}

function getCategoryIcon(category: string) {
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
}
