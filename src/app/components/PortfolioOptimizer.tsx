'use client';

import { TrendingUp, Target, Shield, Zap } from 'lucide-react';

interface PortfolioOptimizerProps {
  calculations: any[];
  investment: number;
  riskTolerance: string;
}

export default function PortfolioOptimizer({ calculations, investment, riskTolerance }: PortfolioOptimizerProps) {
  const getOptimizationRecommendations = () => {
    if (!calculations.length) return [];

    let recommendations = [];

    // Risk-based recommendations
    if (riskTolerance === 'conservative') {
      recommendations.push({
        type: 'Risk Management',
        icon: Shield,
        color: 'text-green-400',
        bgColor: 'bg-green-400/20',
        title: 'Increase Low-Risk Protocols',
        description: 'Consider allocating more to Aave V3 and Compound V3 for stability',
        action: 'Target 70% in low-risk protocols'
      });
    } else if (riskTolerance === 'aggressive') {
      recommendations.push({
        type: 'Yield Optimization',
        icon: Zap,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/20',
        title: 'High-Yield Opportunities',
        description: 'Consider Synthetix and Uniswap V3 for maximum returns',
        action: 'Allocate up to 40% in high-yield protocols'
      });
    }

    // Diversification recommendations
    const categories = [...new Set(calculations.map(c => c.category))];
    if (categories.length < 3) {
      recommendations.push({
        type: 'Diversification',
        icon: Target,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/20',
        title: 'Increase Category Diversity',
        description: 'Spread investments across different DeFi categories',
        action: 'Add protocols from missing categories'
      });
    }

    // APY optimization
    const avgAPY = calculations.reduce((sum, calc) => sum + calc.apy, 0) / calculations.length;
    if (avgAPY < 5) {
      recommendations.push({
        type: 'Yield Enhancement',
        icon: TrendingUp,
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/20',
        title: 'Optimize for Higher Yields',
        description: 'Current portfolio APY is below market average',
        action: 'Consider higher-yield protocols within risk tolerance'
      });
    }

    return recommendations;
  };

  const getOptimalAllocation = () => {
    if (!calculations.length) return [];

    const totalValue = calculations.reduce((sum, calc) => sum + calc.futureValue, 0);
    
    return calculations.map(calc => {
      const currentAllocation = (calc.futureValue / totalValue) * 100;
      let optimalAllocation = currentAllocation;

      // Adjust based on risk tolerance
      if (riskTolerance === 'conservative') {
        if (calc.risk === 'low') optimalAllocation *= 1.2;
        if (calc.risk === 'high') optimalAllocation *= 0.7;
      } else if (riskTolerance === 'aggressive') {
        if (calc.risk === 'high') optimalAllocation *= 1.3;
        if (calc.risk === 'low') optimalAllocation *= 0.9;
      }

      // Adjust based on APY performance
      const avgAPY = calculations.reduce((sum, c) => sum + c.apy, 0) / calculations.length;
      if (calc.apy > avgAPY) optimalAllocation *= 1.1;
      if (calc.apy < avgAPY) optimalAllocation *= 0.9;

      // Normalize to 100%
      return {
        ...calc,
        currentAllocation: currentAllocation,
        optimalAllocation: Math.max(0, Math.min(100, optimalAllocation))
      };
    });
  };

  const recommendations = getOptimizationRecommendations();
  const optimalAllocation = getOptimalAllocation();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-6">Portfolio Optimization</h3>
      
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-300 mb-4">Smart Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg ${rec.bgColor} border border-white/10`}>
                <div className="flex items-start space-x-3">
                  <rec.icon className={`w-5 h-5 mt-0.5 ${rec.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {rec.type}
                      </span>
                    </div>
                    <h5 className={`font-medium ${rec.color} mb-1`}>{rec.title}</h5>
                    <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
                    <p className="text-xs text-gray-400 font-medium">{rec.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {optimalAllocation.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4">Optimal Allocation</h4>
          <div className="space-y-3">
            {optimalAllocation.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-sm text-gray-400">{item.apy}% APY</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Current: {item.currentAllocation.toFixed(1)}%</span>
                      <span>Optimal: {item.optimalAllocation.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.currentAllocation}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Risk</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.risk === 'low' ? 'text-green-400 bg-green-400/20' :
                      item.risk === 'medium' ? 'text-yellow-400 bg-yellow-400/20' :
                      'text-red-400 bg-red-400/20'
                    }`}>
                      {item.risk.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-white font-medium">Portfolio Health Score</h5>
            <p className="text-sm text-gray-400">Based on diversification and risk management</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {Math.min(100, Math.max(60, 
                60 + 
                (calculations.length * 5) + 
                (riskTolerance === 'conservative' ? 15 : riskTolerance === 'moderate' ? 10 : 5) +
                (calculations.filter(c => c.risk === 'low').length * 3)
              ))}%
            </div>
            <div className="text-xs text-gray-400">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
