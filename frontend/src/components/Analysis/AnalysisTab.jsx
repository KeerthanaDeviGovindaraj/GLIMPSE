// components/Analysis/AnalysisTab.jsx
import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target,
  Activity,
  Users,
  Clock,
  Award
} from 'lucide-react';
import AnalysisCard, { StatsAnalysisCard, PerformanceCard, ComparisonCard } from './AnalysisCard';
import MetricsChart from './MetricsChart';

const AnalysisTab = ({ match }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!match) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Select a match to view analysis</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'statistics', label: 'Statistics', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'comparison', label: 'Comparison', icon: Target }
  ];

  // Generate mock statistics based on match
  const generateStats = () => {
    const total = match.score1 + match.score2;
    return [
      {
        label: 'Shots',
        team1Value: Math.floor(Math.random() * 20) + 10,
        team2Value: Math.floor(Math.random() * 20) + 10
      },
      {
        label: 'Possession',
        team1Value: Math.floor(Math.random() * 30) + 40,
        team2Value: Math.floor(Math.random() * 30) + 40
      },
      {
        label: 'Passes',
        team1Value: Math.floor(Math.random() * 200) + 300,
        team2Value: Math.floor(Math.random() * 200) + 300
      },
      {
        label: 'Attacks',
        team1Value: Math.floor(Math.random() * 50) + 50,
        team2Value: Math.floor(Math.random() * 50) + 50
      }
    ];
  };

  const stats = generateStats();

  // Overview Tab Content
  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalysisCard
          title="Total Score"
          value={match.score1 + match.score2}
          icon={Target}
          color="blue"
          change={15}
          trend="up"
          subtitle="Combined score"
        />
        <AnalysisCard
          title="Match Time"
          value={match.time || '0:00'}
          icon={Clock}
          color="green"
          subtitle="Current time"
        />
        <AnalysisCard
          title={match.team1}
          value={match.score1}
          icon={Award}
          color="red"
          change={match.score1 > match.score2 ? 10 : -5}
          trend={match.score1 > match.score2 ? 'up' : 'down'}
        />
        <AnalysisCard
          title={match.team2}
          value={match.score2}
          icon={Award}
          color="purple"
          change={match.score2 > match.score1 ? 10 : -5}
          trend={match.score2 > match.score1 ? 'up' : 'down'}
        />
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsAnalysisCard stats={stats} />
        <MetricsChart 
          data={[
            { name: match.team1, value: match.score1 },
            { name: match.team2, value: match.score2 }
          ]}
          title="Score Distribution"
        />
      </div>
    </div>
  );

  // Statistics Tab Content
  const StatisticsContent = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-500" />
          Detailed Statistics
        </h3>
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 font-medium">{stat.label}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-red-500 font-bold">{stat.team1Value}</div>
                    <div className="text-xs text-gray-500">{match.team1}</div>
                  </div>
                  <div className="text-gray-600">vs</div>
                  <div className="text-left">
                    <div className="text-blue-500 font-bold">{stat.team2Value}</div>
                    <div className="text-xs text-gray-500">{match.team2}</div>
                  </div>
                </div>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                  style={{ width: `${(stat.team1Value / (stat.team1Value + stat.team2Value)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{((stat.team1Value / (stat.team1Value + stat.team2Value)) * 100).toFixed(1)}%</span>
                <span>{((stat.team2Value / (stat.team1Value + stat.team2Value)) * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsChart 
          data={stats.map(s => ({ name: s.label, team1: s.team1Value, team2: s.team2Value }))}
          title="Stats Comparison"
          type="bar"
        />
        <MetricsChart 
          data={[
            { name: match.team1, value: match.score1 },
            { name: match.team2, value: match.score2 }
          ]}
          title="Score Share"
          type="pie"
        />
      </div>
    </div>
  );

  // Performance Tab Content
  const PerformanceContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PerformanceCard 
        team={match.team1}
        color="red"
        stats={[
          { label: 'Goals', value: match.score1 },
          { label: 'Shots', value: stats[0].team1Value },
          { label: 'Possession', value: `${stats[1].team1Value}%` },
          { label: 'Passes', value: stats[2].team1Value }
        ]}
      />
      <PerformanceCard 
        team={match.team2}
        color="blue"
        stats={[
          { label: 'Goals', value: match.score2 },
          { label: 'Shots', value: stats[0].team2Value },
          { label: 'Possession', value: `${stats[1].team2Value}%` },
          { label: 'Passes', value: stats[2].team2Value }
        ]}
      />
      <div className="lg:col-span-2">
        <MetricsChart 
          data={stats.map(s => ({ 
            name: s.label, 
            [match.team1]: s.team1Value, 
            [match.team2]: s.team2Value 
          }))}
          title="Performance Comparison"
          type="bar"
        />
      </div>
    </div>
  );

  // Comparison Tab Content
  const ComparisonContent = () => (
    <div className="space-y-6">
      <ComparisonCard 
        team1={match.team1}
        team2={match.team2}
        metrics={[
          { label: 'Goals', team1Value: match.score1, team2Value: match.score2 },
          ...stats
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center">
          <div className="text-red-500 text-4xl font-bold mb-2">{match.score1}</div>
          <div className="text-gray-400 text-sm mb-4">{match.team1}</div>
          <div className="text-xs text-gray-500">Total Goals</div>
        </div>
        <div className="bg-gray-800/50 border border-yellow-500/30 rounded-xl p-6 text-center flex flex-col items-center justify-center">
          <div className="text-yellow-500 text-2xl font-bold mb-2">VS</div>
          <div className="text-gray-400 text-sm">{match.league}</div>
          <div className="text-xs text-gray-500 mt-2">{match.time}</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center">
          <div className="text-blue-500 text-4xl font-bold mb-2">{match.score2}</div>
          <div className="text-gray-400 text-sm mb-4">{match.team2}</div>
          <div className="text-xs text-gray-500">Total Goals</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'statistics':
        return <StatisticsContent />;
      case 'performance':
        return <PerformanceContent />;
      case 'comparison':
        return <ComparisonContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-700/50">
        <div className="flex gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisTab;