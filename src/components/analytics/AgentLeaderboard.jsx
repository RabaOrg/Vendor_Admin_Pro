import React from 'react';
import { Card } from 'flowbite-react';
import { Trophy, Medal, Award, Users, TrendingUp, DollarSign } from 'lucide-react';

const AgentLeaderboard = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data?.data) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2" />
          <p>No agent data available</p>
        </div>
      </Card>
    );
  }

  const { leaderboard, summary } = data.data;
  const { total_agents, total_applications, total_approved_value, average_performance_score } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{index + 1}</span>;
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Agent Performance Leaderboard</h3>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">{total_agents} Agents</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-blue-700">{total_applications}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(total_approved_value)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Performance</p>
              <p className="text-2xl font-bold text-purple-700">{average_performance_score}%</p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Performing Agents</h4>
        {leaderboard.slice(0, 10).map((agent, index) => (
          <div key={agent.agent_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{agent.name}</p>
                <p className="text-sm text-gray-500 truncate">{agent.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
              <div className="text-center min-w-0">
                <p className="font-medium text-gray-900">{agent.total_applications}</p>
                <p className="text-xs text-gray-500 truncate">Apps</p>
              </div>
              <div className="text-center min-w-0">
                <p className="font-medium text-gray-900">{agent.approved_applications}</p>
                <p className="text-xs text-gray-500 truncate">Approved</p>
              </div>
              <div className="text-center min-w-0">
                <p className="font-medium text-gray-900">{agent.vendors_managed}</p>
                <p className="text-xs text-gray-500 truncate">Vendors</p>
              </div>
              <div className="text-center min-w-0">
                <p className="font-medium text-gray-900 text-xs sm:text-sm">{formatCurrency(agent.total_approved_value)}</p>
                <p className="text-xs text-gray-500 truncate">Value</p>
              </div>
              <div className="text-center min-w-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(agent.performance_score)}`}>
                  {agent.performance_score}%
                </span>
                <p className="text-xs text-gray-500 truncate">Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Approval Rate</span>
              <span className="font-medium text-gray-900">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((sum, agent) => sum + agent.approval_rate, 0) / leaderboard.length)
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Completion Rate</span>
              <span className="font-medium text-gray-900">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((sum, agent) => sum + agent.completion_rate, 0) / leaderboard.length)
                  : 0}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Agent Value</span>
              <span className="font-medium text-gray-900">
                {leaderboard.length > 0 ? formatCurrency(leaderboard[0].total_approved_value) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Deal Size</span>
              <span className="font-medium text-gray-900">
                {leaderboard.length > 0 
                  ? formatCurrency(leaderboard.reduce((sum, agent) => sum + agent.total_approved_value, 0) / leaderboard.reduce((sum, agent) => sum + agent.approved_applications, 0))
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgentLeaderboard;
