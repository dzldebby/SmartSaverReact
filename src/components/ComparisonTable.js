import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';

const ComparisonTable = ({ results, getBankById }) => {
  const [expandedBreakdowns, setExpandedBreakdowns] = useState({});

  const toggleBreakdown = (bankId) => {
    setExpandedBreakdowns(prev => ({
      ...prev,
      [bankId]: !prev[bankId]
    }));
  };

  // Group breakdown items by type
  const getGroupedBreakdown = (breakdown) => {
    if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
      return { total: 0 };
    }
    
    const grouped = {};
    let totalInterest = 0;
    
    breakdown.forEach(item => {
      const type = item.description.includes('Base Interest') ? 'Base Interest' :
                  item.description.includes('Salary') ? 'Bonus Interest' :
                  item.description.includes('Card Spend') ? 'Bonus Interest' :
                  item.description.includes('Payment') ? 'Bonus Interest' :
                  item.description.includes('Extra') ? 'Extra Interest' : 'Other';
      
      if (!grouped[type]) {
        grouped[type] = {
          items: [],
          subtotal: 0
        };
      }
      
      grouped[type].items.push(item);
      grouped[type].subtotal += item.tierInterest;
      totalInterest += item.tierInterest;
    });
    
    // Add total to the grouped object
    grouped.total = totalInterest;
    
    return grouped;
  };

  return (
    <Card className="glass-card shimmer">
      <CardHeader className="bg-purple-700 text-white py-2">
        <CardTitle className="text-center text-white">Bank Comparison Table</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="overflow-x-auto">
          <table className="fancy-table">
            <thead>
              <tr>
                <th className="text-left">Bank</th>
                <th className="text-right">Interest Rate</th>
                <th className="text-right">Monthly Interest</th>
                <th className="text-right">Annual Interest</th>
                <th className="text-left">Interest Breakdown</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const bank = getBankById(result.bankId);
                const isExpanded = expandedBreakdowns[result.bankId] || false;
                const groupedBreakdown = getGroupedBreakdown(result.breakdown);
                
                return (
                  <React.Fragment key={result.bankId}>
                    <tr className={isExpanded ? "bg-primary/5 dark:bg-primary/10" : ""}>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                            style={{ 
                              background: `linear-gradient(135deg, ${bank?.color || '#888888'}, ${bank?.color ? bank.color + '99' : '#666666'})` 
                            }}
                          >
                            {bank?.name.charAt(0)}
                          </div>
                          <span className="font-medium">{bank?.name}</span>
                        </div>
                      </td>
                      <td className="text-right font-medium">
                        <span className="text-primary font-bold">
                          {(result.interestRate * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right font-medium">
                        ${result.monthlyInterest.toFixed(2)}
                      </td>
                      <td className="text-right font-medium">
                        <span className="text-lg">${result.annualInterest.toFixed(2)}</span>
                      </td>
                      <td>
                        <button 
                          className="interactive-button flex items-center"
                          onClick={() => toggleBreakdown(result.bankId)}
                        >
                          <span>View Breakdown</span>
                          {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-primary/5 dark:bg-primary/10">
                        <td colSpan={5}>
                          <div className="glossy-surface m-2 p-3 space-y-3 animate-in fade-in">
                            {(!result.breakdown || !Array.isArray(result.breakdown) || result.breakdown.length === 0) ? (
                              <div className="text-center py-3">
                                <p className="text-gray-500 dark:text-gray-400">Detailed breakdown not available for this bank.</p>
                                <div className="mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <p className="font-medium">Total Annual Interest: <span className="text-primary font-bold">${result.annualInterest.toFixed(2)}</span></p>
                                  <p className="text-sm">Monthly Interest: ${result.monthlyInterest.toFixed(2)}</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Base Interest Section */}
                                {groupedBreakdown['Base Interest'] && (
                                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Base Interest:</p>
                                    <ul className="space-y-1 pl-2">
                                      {groupedBreakdown['Base Interest'].items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                          <span>{item.description.replace('Base Interest', '').trim() || 'Base'}: 
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                          </span>
                                          <span className="font-medium">${item.tierInterest.toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Base Interest:</span>
                                      <span className="text-primary">${groupedBreakdown['Base Interest'].subtotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Bonus Interest Section */}
                                {groupedBreakdown['Bonus Interest'] && (
                                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Bonus Interest (on first $100,000):</p>
                                    <ul className="space-y-1 pl-2">
                                      {groupedBreakdown['Bonus Interest'].items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                          <span>{item.description}: 
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                          </span>
                                          <span className="font-medium">${item.tierInterest.toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Bonus Interest:</span>
                                      <span className="text-secondary">${groupedBreakdown['Bonus Interest'].subtotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Extra Interest Section */}
                                {groupedBreakdown['Extra Interest'] && (
                                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Extra Interest (above $100,000):</p>
                                    <ul className="space-y-1 pl-2">
                                      {groupedBreakdown['Extra Interest'].items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                          <span>{item.description}: 
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                          </span>
                                          <span className="font-medium">${item.tierInterest.toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Extra Interest:</span>
                                      <span className="text-accent">${groupedBreakdown['Extra Interest'].subtotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Other Interest Section */}
                                {groupedBreakdown['Other'] && (
                                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Other Interest:</p>
                                    <ul className="space-y-1 pl-2">
                                      {groupedBreakdown['Other'].items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                          <span>{item.description}: 
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                          </span>
                                          <span className="font-medium">${item.tierInterest.toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Other Interest:</span>
                                      <span className="text-gray-700 dark:text-gray-300">${groupedBreakdown['Other'].subtotal.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Total Section */}
                                <div className="fancy-border p-[1px] mt-2">
                                  <div className="fancy-border-content p-3">
                                    <div className="flex justify-between font-bold">
                                      <span>Total Annual Interest:</span>
                                      <span className="text-primary">${groupedBreakdown.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                      <span>Monthly Interest:</span>
                                      <span>${(groupedBreakdown.total / 12).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable; 