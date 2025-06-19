import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, DollarSign, TrendingUp, TrendingDown, PieChart, RefreshCw } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useSheetData } from "../hooks/useSheetData";
import { ThemeToggle } from "../components/ThemeToggle";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { categoryData, financialData, loading, error, refreshData } = useSheetData();

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);
  const budgetRemaining = financialData.totalBudget - totalExpenses;

  const barData = categoryData.map(item => ({
    category: item.name.split(' ')[0],
    amount: item.value
  }));

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 bg-background p-4 md:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              Web3 Financial Dashboard
            </h1>
            <p className="text-gray-300 dark:text-gray-300 text-muted-foreground animate-fade-in delay-200">Decentralized financial overview powered by blockchain</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={refreshData} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Sync Chain Data
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm animate-fade-in">
            <p className="text-red-300">
              <strong>Connection Error:</strong> {error}
            </p>
            <p className="text-sm text-red-400 mt-1">
              Using fallback data. Check your sheet configuration.
            </p>
          </div>
        )}

        {/* Configuration Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-lg backdrop-blur-sm animate-fade-in delay-300">
          <h3 className="font-semibold text-blue-300 mb-2">🔗 Sheet Configuration</h3>
          <p className="text-sm text-blue-200 mb-2">
            Configure your Google Sheets connection in <code className="bg-slate-800/50 px-2 py-1 rounded text-cyan-300">src/services/googleSheetsService.ts</code>:
          </p>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Categories: A2:B13 (Debt & Loan through Others)</li>
            <li>• Total Budget: A14:B14</li>
            <li>• Total Income: A15:B15</li>
            <li>• Income Growth: A16:B16</li>
          </ul>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Overview */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in delay-500 border border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Budget Pool</CardTitle>
              <PieChart className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ${budgetRemaining.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400">available</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden" 
                    style={{ width: `${(budgetRemaining / financialData.totalBudget) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${totalExpenses.toLocaleString()} spent</span>
                  <span>${financialData.totalBudget.toLocaleString()} total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in delay-700 border border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Token Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  ${financialData.totalIncome.toLocaleString()}
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{financialData.incomeGrowth}%</span>
                  <span className="text-gray-400 ml-1">yield this month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in delay-900 border border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Burned</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  ${totalExpenses.toLocaleString()}
                </div>
                <div className="flex items-center text-sm">
                  <TrendingDown className="h-3 w-3 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">-12.3%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in delay-1100 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Portfolio Distribution
                {loading && <span className="text-sm font-normal text-gray-400 ml-2 animate-pulse">(Syncing...)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie 
                      data={categoryData} 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      dataKey="value"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']} 
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 animate-fade-in delay-1300 border border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-200">
                Gas Usage by Category
                {loading && <span className="text-sm font-normal text-gray-400 ml-2 animate-pulse">(Syncing...)</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#94a3b8' }} 
                      axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']} 
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#e2e8f0'
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="url(#barGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 z-40 border border-cyan-400/30"
        size="icon"
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-30 border-l border-cyan-500/20 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
            <h3 className="text-lg font-semibold text-cyan-300">AI Oracle</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-cyan-300 hover:bg-cyan-500/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-cyan-400/30">
                <MessageCircle className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-2">AI Oracle Integration</h4>
                <p className="text-sm text-gray-400 mb-4">Connect your n8n webhook to enable the AI chatbot here.</p>
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-3">
                  <p className="text-xs text-yellow-300">
                    <strong>Note:</strong> To implement live n8n webhook integration, connect your Lovable project to Supabase first for backend functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleChat}
        ></div>
      )}
    </div>
  );
};

export default Index;
