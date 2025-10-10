import React from 'react';
import { Card } from 'flowbite-react';
import { AlertTriangle, Shield, TrendingDown, Users, DollarSign, Clock } from 'lucide-react';

const RiskAssessmentWidget = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data?.data) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Shield className="w-8 h-8 mx-auto mb-2" />
          <p>No risk assessment data available</p>
        </div>
      </Card>
    );
  }

  // Calculate risk metrics from available data
  const calculateRiskMetrics = (repaymentData, agentData, vendorData, revenueData) => {
    const metrics = {
      overdueRisk: 0,
      concentrationRisk: 0,
      completionRisk: 0,
      growthRisk: 0,
      overallRisk: 0
    };

    // Overdue Risk (from repayment data)
    if (repaymentData?.repayment_summary) {
      const { total_schedules, overdue_installments, total_overdue_amount } = repaymentData.repayment_summary;
      if (total_schedules > 0) {
        metrics.overdueRisk = Math.round((overdue_installments / total_schedules) * 100);
      }
    }

    // Concentration Risk (from agent data)
    if (agentData?.leaderboard && agentData.leaderboard.length > 0) {
      const topAgentValue = agentData.leaderboard[0]?.total_approved_value || 0;
      const totalValue = agentData.summary?.total_approved_value || 1;
      metrics.concentrationRisk = Math.round((topAgentValue / totalValue) * 100);
    }

    // Completion Risk (from revenue data)
    if (revenueData?.current_revenue) {
      const { approved_revenue, completed_revenue } = revenueData.current_revenue;
      if (approved_revenue > 0) {
        metrics.completionRisk = Math.round(((approved_revenue - completed_revenue) / approved_revenue) * 100);
      }
    }

    // Growth Risk (from revenue projections)
    if (revenueData?.projections) {
      const growthRate = revenueData.projections.growth_rate || 0;
      metrics.growthRisk = growthRate < 0 ? Math.abs(growthRate) : 0;
    }

    // Overall Risk Score
    metrics.overallRisk = Math.round((metrics.overdueRisk + metrics.concentrationRisk + metrics.completionRisk + metrics.growthRisk) / 4);

    return metrics;
  };

  const riskMetrics = calculateRiskMetrics(
    data.repaymentData?.data,
    data.agentData?.data,
    data.vendorData?.data,
    data.revenueData?.data
  );

  const getRiskLevel = (score) => {
    if (score >= 70) return { level: 'High', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' };
    if (score >= 40) return { level: 'Medium', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' };
    return { level: 'Low', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700' };
  };

  const getRiskIcon = (score) => {
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (score >= 40) return <TrendingDown className="w-5 h-5 text-yellow-500" />;
    return <Shield className="w-5 h-5 text-green-500" />;
  };

  const overallRisk = getRiskLevel(riskMetrics.overallRisk);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
        <div className="flex items-center space-x-2">
          {getRiskIcon(riskMetrics.overallRisk)}
          <span className={`text-sm font-medium ${overallRisk.textColor}`}>
            {overallRisk.level} Risk
          </span>
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className={`${overallRisk.bgColor} rounded-lg p-4 mb-6 border border-${overallRisk.color}-200`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${overallRisk.textColor}`}>Overall Risk Score</p>
            <p className={`text-3xl font-bold ${overallRisk.textColor}`}>{riskMetrics.overallRisk}%</p>
            <p className={`text-xs ${overallRisk.textColor}`}>Based on multiple factors</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`text-${overallRisk.color}-500`}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${riskMetrics.overallRisk}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${overallRisk.textColor}`}>{riskMetrics.overallRisk}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Risk Factors</h4>
        
        {/* Overdue Risk */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-gray-900">Overdue Payments</p>
              <p className="text-sm text-gray-500">Risk from unpaid installments</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getRiskLevel(riskMetrics.overdueRisk).textColor}`}>
              {riskMetrics.overdueRisk}%
            </span>
            <p className="text-xs text-gray-500">Risk Level</p>
          </div>
        </div>

        {/* Concentration Risk */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium text-gray-900">Agent Concentration</p>
              <p className="text-sm text-gray-500">Risk from top agent dependency</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getRiskLevel(riskMetrics.concentrationRisk).textColor}`}>
              {riskMetrics.concentrationRisk}%
            </span>
            <p className="text-xs text-gray-500">Risk Level</p>
          </div>
        </div>

        {/* Completion Risk */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-medium text-gray-900">Completion Risk</p>
              <p className="text-sm text-gray-500">Risk from incomplete deals</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getRiskLevel(riskMetrics.completionRisk).textColor}`}>
              {riskMetrics.completionRisk}%
            </span>
            <p className="text-xs text-gray-500">Risk Level</p>
          </div>
        </div>

        {/* Growth Risk */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingDown className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-medium text-gray-900">Growth Risk</p>
              <p className="text-sm text-gray-500">Risk from declining growth</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold ${getRiskLevel(riskMetrics.growthRisk).textColor}`}>
              {riskMetrics.growthRisk}%
            </span>
            <p className="text-xs text-gray-500">Risk Level</p>
          </div>
        </div>
      </div>

      {/* Risk Recommendations */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Mitigation Recommendations</h4>
        <div className="space-y-2">
          {riskMetrics.overdueRisk > 50 && (
            <div className="flex items-start space-x-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Implement automated payment reminders and consider payment plan restructuring for overdue accounts.</span>
            </div>
          )}
          {riskMetrics.concentrationRisk > 60 && (
            <div className="flex items-start space-x-2 text-sm">
              <Users className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Diversify agent portfolio to reduce dependency on top performers.</span>
            </div>
          )}
          {riskMetrics.completionRisk > 40 && (
            <div className="flex items-start space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Review approval criteria and improve customer onboarding process.</span>
            </div>
          )}
          {riskMetrics.growthRisk > 30 && (
            <div className="flex items-start space-x-2 text-sm">
              <TrendingDown className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Analyze market trends and consider expanding product offerings.</span>
            </div>
          )}
          {riskMetrics.overallRisk < 30 && (
            <div className="flex items-start space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Excellent risk management! Continue monitoring key metrics.</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RiskAssessmentWidget;
