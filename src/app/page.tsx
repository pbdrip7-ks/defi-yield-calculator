'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calculator, DollarSign, Percent, Target } from 'lucide-react';
import ExportPortfolio from './components/ExportPortfolio';
import PortfolioOptimizer from './components/PortfolioOptimizer';

const protocols = [
  { name: 'Aave V3', apy: 4.2, risk: 'low', liquidity: 'high', color: '#6366f1', tvl: '12.5B', category: 'Lending' },
  { name: 'Compound V3', apy: 3.8, risk: 'low', liquidity: 'high', color: '#8b5cf6', tvl: '8.2B', category: 'Lending' },
  { name: 'Yearn Finance', apy: 7.2, risk: 'medium', liquidity: 'medium', color: '#ef4444', tvl: '3.1B', category: 'Yield Aggregator' },
  { name: 'Lido Finance', apy: 3.5, risk: 'low', liquidity: 'high', color: '#10b981', tvl: '22.8B', category: 'Staking' },
  { name: 'Curve Finance', apy: 5.8, risk: 'medium', liquidity: 'high', color: '#f59e0b', tvl: '15.3B', category: 'DEX' },
  { name: 'Convex Finance', apy: 6.1, risk: 'medium', liquidity: 'medium', color: '#ec4899', tvl: '7.9B', category: 'Yield Optimizer' },
  { name: 'Uniswap V3', apy: 8.5, risk: 'high', liquidity: 'high', color: '#06b6d4', tvl: '18.7B', category: 'DEX' },
  { name: 'Balancer', apy: 6.8, risk: 'medium', liquidity: 'high', color: '#f97316', tvl: '5.2B', category: 'DEX' },
  { name: 'Synthetix', apy: 9.2, risk: 'high', liquidity: 'medium', color: '#84cc16', tvl: '2.8B', category: 'Synthetic Assets' },
  { name: 'MakerDAO', apy: 2.8, risk: 'low', liquidity: 'high', color: '#a855f7', tvl: '6.4B', category: 'Lending' }
];

export default function DeFiYieldCalculator() {
  const [investment, setInvestment] = useState(10000);
  const [timeframe, setTimeframe] = useState(12);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(['Aave V3', 'Compound V3']);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [reinvestment, setReinvestment] = useState(true);
  const [monthlyContribution, setMonthlyContribution] = useState(0);

  const timeframes = [
    { months: 1, label: '1 Month' },
    { months: 3, label: '3 Months' },
    { months: 6, label: '6 Months' },
    { months: 12, label: '1 Year' },
    { months: 24, label: '2 Years' },
    { months: 36, label: '3 Years' }
  ];

  const calculations = useMemo(() => {
    return selectedProtocols.map(protocolName => {
      const protocol = protocols.find(p => p.name === protocolName);
      if (!protocol) return null;

      const monthlyRate = protocol.apy / 100 / 12;
      const totalMonths = timeframe;
      
      // Calculate with monthly contributions and reinvestment
      let futureValue = investment;
      if (reinvestment && monthlyContribution > 0) {
        for (let month = 1; month <= totalMonths; month++) {
          futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
        }
      } else {
        futureValue = investment * Math.pow(1 + monthlyRate, totalMonths);
        if (monthlyContribution > 0) {
          futureValue += monthlyContribution * totalMonths;
        }
      }
      
      const totalEarnings = futureValue - investment - (monthlyContribution * totalMonths);
      const totalContributed = investment + (monthlyContribution * totalMonths);

      return {
        name: protocol.name,
        apy: protocol.apy,
        risk: protocol.risk,
        liquidity: protocol.liquidity,
        color: protocol.color,
        tvl: protocol.tvl,
        category: protocol.category,
        futureValue,
        totalEarnings,
        totalContributed,
        monthlyEarnings: totalEarnings / totalMonths,
        roi: (totalEarnings / totalContributed) * 100
      };
    }).filter(Boolean);
  }, [investment, timeframe, selectedProtocols, reinvestment, monthlyContribution]);

  const totalFutureValue = calculations.reduce((sum, calc) => sum + (calc?.futureValue || 0), 0);
  const totalEarnings = calculations.reduce((sum, calc) => sum + (calc?.totalEarnings || 0), 0);
  const averageAPY = calculations.reduce((sum, calc) => sum + (calc?.apy || 0), 0) / calculations.length;

  const chartData = timeframes.map(tf => {
    const monthlyRate = averageAPY / 100 / 12;
    const futureValue = investment * Math.pow(1 + monthlyRate, tf.months);
    return {
      month: tf.label,
      value: futureValue,
      earnings: futureValue - investment
    };
  });

  const handleProtocolToggle = (protocolName: string) => {
    setSelectedProtocols(prev => 
      prev.includes(protocolName) 
        ? prev.filter(p => p !== protocolName)
        : [...prev, protocolName]
    );
  };

  // Filter protocols based on risk tolerance
  const filteredProtocols = useMemo(() => {
    if (riskTolerance === 'conservative') {
      return protocols.filter(p => p.risk === 'low' && p.liquidity === 'high');
    } else if (riskTolerance === 'moderate') {
      return protocols.filter(p => p.risk !== 'high');
    } else {
      return protocols; // aggressive - show all protocols
    }
  }, [riskTolerance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">DeFi Yield Calculator</h1>
            </div>
            <div className="text-sm text-gray-300">
              Professional DeFi Yield Analysis
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Investment Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Investment
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeframes.map(tf => (
                  <option key={tf.months} value={tf.months} className="bg-gray-800 text-white">
                    {tf.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selected Protocols
              </label>
              <div className="text-white font-medium">
                {selectedProtocols.length} protocols
              </div>
            </div>
          </div>

          {/* Risk Management Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative" className="bg-gray-800 text-white">Conservative</option>
                <option value="moderate" className="bg-gray-800 text-white">Moderate</option>
                <option value="aggressive" className="bg-gray-800 text-white">Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Contribution
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reinvestment}
                  onChange={(e) => setReinvestment(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Reinvest Earnings</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Risk Profile</p>
                <p className="text-2xl font-bold text-white capitalize">{riskTolerance}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Future Value</p>
                <p className="text-2xl font-bold text-white">${totalFutureValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400">${totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average APY</p>
                <p className="text-2xl font-bold text-blue-400">{averageAPY.toFixed(1)}%</p>
              </div>
              <Percent className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ROI</p>
                <p className="text-2xl font-bold text-purple-400">
                  {((totalEarnings / investment) * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

                 {/* Protocol Selection */}
         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
           <h3 className="text-lg font-semibold text-white mb-6">Select DeFi Protocols</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredProtocols.map((protocol) => (
               <div
                 key={protocol.name}
                 className={`p-6 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                   selectedProtocols.includes(protocol.name)
                     ? 'border-blue-500/50 bg-blue-500/10'
                     : 'border-white/10 bg-white/5 hover:bg-white/10'
                 }`}
                 onClick={() => handleProtocolToggle(protocol.name)}
               >
                 {/* Protocol Header */}
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="text-lg font-semibold text-white">{protocol.name}</h4>
                   <div className="flex items-center space-x-2">
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                       protocol.risk === 'low' ? 'text-green-400 bg-green-400/20' :
                       protocol.risk === 'medium' ? 'text-yellow-400 bg-yellow-400/20' :
                       'text-red-400 bg-red-400/20'
                     }`}>
                       {protocol.risk.toUpperCase()}
                     </span>
                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                       protocol.liquidity === 'high' ? 'text-green-400 bg-green-400/20' :
                       protocol.liquidity === 'medium' ? 'text-yellow-400 bg-yellow-400/20' :
                       'text-red-400 bg-red-400/20'
                     }`}>
                       {protocol.liquidity.toUpperCase()} LIQ
                     </span>
                   </div>
                 </div>
                 
                 {/* APY Display */}
                 <div className="text-3xl font-bold text-green-400 mb-4">{protocol.apy}% APY</div>
                 
                 {/* Protocol Details */}
                 <div className="space-y-3 mb-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">TVL:</span>
                     <span className="text-sm font-medium text-white">{protocol.tvl}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">Category:</span>
                     <span className="text-xs px-3 py-1 bg-white/10 rounded-full text-blue-400 font-medium">{protocol.category}</span>
                   </div>
                 </div>
                 
                 {/* Selection Status */}
                 <div className={`text-sm font-medium text-center py-2 px-4 rounded-lg ${
                   selectedProtocols.includes(protocol.name)
                     ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                     : 'bg-white/10 text-gray-300 border border-white/20'
                 }`}>
                   {selectedProtocols.includes(protocol.name) ? '✓ Selected' : 'Click to select'}
                 </div>
               </div>
             ))}
           </div>
         </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Growth Projection</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-6">Protocol Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="totalEarnings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Portfolio Optimization & Export */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PortfolioOptimizer 
            calculations={calculations}
            investment={investment}
            riskTolerance={riskTolerance}
          />
          <ExportPortfolio 
            calculations={calculations}
            investment={investment}
            timeframe={timeframe}
            riskTolerance={riskTolerance}
          />
        </div>

        {/* Detailed Results */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">Detailed Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Protocol</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">APY</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Risk</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Future Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Total Earnings</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc) => calc && (
                  <tr key={calc.name} className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calc.color }} />
                        <span className="text-white font-medium">{calc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-green-400 font-medium">{calc.apy}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        calc.risk === 'low' ? 'text-green-400 bg-green-400/20' :
                        calc.risk === 'medium' ? 'text-yellow-400 bg-yellow-400/20' :
                        'text-red-400 bg-red-400/20'
                      }`}>
                        {calc.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-400 font-medium">{calc.category}</td>
                    <td className="py-3 px-4 text-white font-medium">${calc.futureValue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">${calc.totalEarnings.toLocaleString()}</td>
                    <td className="py-3 px-4 text-purple-400 font-medium">{calc.roi.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
