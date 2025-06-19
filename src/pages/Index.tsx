import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sample data - will be replaced with Google Sheets integration
  const budgetData = {
    total: 5000,
    remaining: 2350,
    spent: 2650
  };

  const incomeData = {
    total: 6500,
    growth: 8.5
  };

  const expenseData = {
    total: 2650,
    growth: -3.2
  };

  const categoryData = [
    { name: "Debt & Loan", value: 480, color: "#EF4444" },
    { name: "Entertainment", value: 320, color: "#F59E0B" },
    { name: "Family", value: 290, color: "#10B981" },
    { name: "Food", value: 650, color: "#3B82F6" },
    { name: "Health", value: 180, color: "#8B5CF6" },
    { name: "Housing", value: 850, color: "#EC4899" },
    { name: "Investment", value: 400, color: "#14B8A6" },
    { name: "Shopping", value: 380, color: "#F97316" },
    { name: "Subscription", value: 120, color: "#6366F1" },
    { name: "Transport", value: 220, color: "#84CC16" },
    { name: "Work & Education", value: 300, color: "#06B6D4" },
    { name: "Others", value: 150, color: "#64748B" }
  ];

  const barData = categoryData.map(item => ({
    category: item.name.split(' ')[0],
    amount: item.value
  }));

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Your financial overview at a glance</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Overview */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Budget Overview</CardTitle>
              <PieChart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${budgetData.remaining.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">remaining</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(budgetData.remaining / budgetData.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>${budgetData.spent.toLocaleString()} spent</span>
                  <span>${budgetData.total.toLocaleString()} total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">${incomeData.total.toLocaleString()}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+{incomeData.growth}%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">${expenseData.total.toLocaleString()}</div>
                <div className="flex items-center text-sm">
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{Math.abs(expenseData.growth)}%</span>
                  <span className="text-gray-500 ml-1">decrease from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Category Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 z-40"
        size="icon"
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white">
            <h3 className="text-lg font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-blue-700">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Chatbot Integration</h4>
                <p className="text-sm text-gray-600 mb-4">Connect your n8n webhook to enable the AI chatbot here.</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleChat}
        ></div>
      )}
    </div>
  );
};

export default Index;
