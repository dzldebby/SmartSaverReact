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
    
    // First, filter out any items with isHeader or isTotal flags
    const actualItems = breakdown.filter(item => !item.isHeader && !item.isTotal);
    
    actualItems.forEach(item => {
      // Check if item or item.description is undefined
      if (!item || !item.description) {
        console.error("Invalid breakdown item:", item);
        return; // Skip this item
      }
      
      // Determine the category based on the description
      let type = 'Other';
      
      if (item.description.includes('Base Interest')) {
        type = 'Base Interest';
      } else if (item.description.includes('Salary') || 
                item.description.includes('Card Spend') || 
                item.description.includes('Payment') ||
                item.description.includes('Wealth Bonus')) {
        type = 'Bonus Interest';
      } else if (item.description.includes('Extra')) {
        type = 'Extra Interest';
      }
      
      if (!grouped[type]) {
        grouped[type] = {
          items: [],
          subtotal: 0
        };
      }
      
      // Only add the item if it has a valid tierInterest value
      if (item.tierInterest) {
        grouped[type].items.push(item);
        grouped[type].subtotal += item.tierInterest;
        totalInterest += item.tierInterest;
      }
    });
    
    // Add total to the grouped object
    grouped.total = totalInterest;
    
    console.log("Grouped breakdown:", grouped);
    
    return grouped;
  };

  // Generate a manual breakdown for banks without detailed breakdowns
  const generateManualBreakdown = (result) => {
    const bank = getBankById(result.bankId);
    
    if (!bank || !result.annualInterest) return null;
    
    // UOB One Account specific breakdown
    if (bank.id === 'uob-one') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Salary + Spend (First $75K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $75,000.00 at 3.00%
                </span>
              </span>
              <span className="font-medium">
                $2,250.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Salary + Spend (Next $50K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $50,000.00 at 4.50%
                </span>
              </span>
              <span className="font-medium">
                $2,250.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Salary + Spend (Next $25K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $25,000.00 at 6.00%
                </span>
              </span>
              <span className="font-medium">
                $1,500.00
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // OCBC 360 Account
    if (bank.id === 'ocbc-360') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Base Interest:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'} at 0.05%
                </span>
              </span>
              <span className="font-medium">
                ${(result.depositAmount * 0.0005).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Salary Bonus (First $75K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $75,000.00 at 1.20%
                </span>
              </span>
              <span className="font-medium">
                $900.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Spend Bonus (First $75K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $75,000.00 at 0.30%
                </span>
              </span>
              <span className="font-medium">
                $225.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Increase Bonus (First $75K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $75,000.00 at 0.60%
                </span>
              </span>
              <span className="font-medium">
                $450.00
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // DBS Multiplier
    if (bank.id === 'dbs-multiplier') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Base Interest:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'} at 0.05%
                </span>
              </span>
              <span className="font-medium">
                ${(result.depositAmount * 0.0005).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Multiplier Bonus (First $100K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $100,000.00 at {((result.interestRate * 100) - 0.05).toFixed(2)}%
                </span>
              </span>
              <span className="font-medium">
                ${(100000 * (result.interestRate - 0.0005)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // SC BonusSaver
    if (bank.id === 'sc-bonussaver') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Base Interest:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'} at 0.05%
                </span>
              </span>
              <span className="font-medium">
                ${(result.depositAmount * 0.0005).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Salary Credit Bonus:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $100,000.00 at 0.75%
                </span>
              </span>
              <span className="font-medium">
                $750.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Card Spend Bonus:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $100,000.00 at 0.50%
                </span>
              </span>
              <span className="font-medium">
                $500.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Insurance Bonus:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $100,000.00 at 0.80%
                </span>
              </span>
              <span className="font-medium">
                $800.00
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // Chocolate
    if (bank.id === 'chocolate') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>First $20,000:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $20,000.00 at 3.30%
                </span>
              </span>
              <span className="font-medium">
                $660.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Next $30,000:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $30,000.00 at 3.00%
                </span>
              </span>
              <span className="font-medium">
                $900.00
              </span>
            </li>
            {result.depositAmount > 50000 && (
              <li className="flex justify-between items-center text-sm">
                <span>Amount beyond $50,000:
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    ${(result.depositAmount - 50000).toLocaleString('en-US')} at 0.00%
                  </span>
                </span>
                <span className="font-medium">
                  $0.00
                </span>
              </li>
            )}
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // CIMB FastSaver
    if (bank.id === 'cimb-fastsaver') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>First $50,000:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $50,000.00 at 2.00%
                </span>
              </span>
              <span className="font-medium">
                $1,000.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Next $25,000:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $25,000.00 at 1.50%
                </span>
              </span>
              <span className="font-medium">
                $375.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Next $25,000:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $25,000.00 at 1.00%
                </span>
              </span>
              <span className="font-medium">
                $250.00
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // Maybank SaveUp
    if (bank.id === 'maybank-saveup') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Base Interest:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'} at 0.25%
                </span>
              </span>
              <span className="font-medium">
                ${(result.depositAmount * 0.0025).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Product Bonus (First $50K):
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $50,000.00 at {((result.interestRate * 100) - 0.25).toFixed(2)}%
                </span>
              </span>
              <span className="font-medium">
                ${(50000 * (result.interestRate - 0.0025)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // HSBC Everyday
    if (bank.id === 'hsbc-everyday') {
      return (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Interest Breakdown:</p>
          <ul className="space-y-1 pl-2">
            <li className="flex justify-between items-center text-sm">
              <span>Base Interest:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'} at 0.10%
                </span>
              </span>
              <span className="font-medium">
                ${(result.depositAmount * 0.001).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Salary Credit Bonus:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $50,000.00 at 1.50%
                </span>
              </span>
              <span className="font-medium">
                $750.00
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Card Spend Bonus:
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  $50,000.00 at 1.00%
                </span>
              </span>
              <span className="font-medium">
                $500.00
              </span>
            </li>
          </ul>
          <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
            <span>Total Annual Interest:</span>
            <span className="text-primary">
              ${result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Monthly Interest:</span>
            <span>
              ${result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      );
    }
    
    // For any other bank or if we don't have a specific breakdown
    return null;
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
                const manualBreakdown = generateManualBreakdown(result);
                
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
                          {result.interestRate ? (result.interestRate * 100).toFixed(2) : '0.00'}%
                        </span>
                      </td>
                      <td className="text-right font-medium">
                        ${result.monthlyInterest ? result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                      </td>
                      <td className="text-right font-medium">
                        <span className="text-lg">${result.annualInterest ? result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</span>
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
                            {/* Check if we have a manual breakdown first */}
                            {manualBreakdown ? (
                              manualBreakdown
                            ) : (!result.breakdown || !Array.isArray(result.breakdown) || result.breakdown.length === 0 || 
                              !Object.keys(groupedBreakdown).some(key => key !== 'total' && groupedBreakdown[key]?.items?.length > 0)) ? (
                              <div className="text-center py-3">
                                <p className="text-gray-500 dark:text-gray-400">Detailed breakdown not available for this bank.</p>
                                <div className="mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                  <p className="font-medium">Total Annual Interest: <span className="text-primary font-bold">
                                    ${result.annualInterest ? result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                  </span></p>
                                  <p className="text-sm">Monthly Interest: 
                                    ${result.monthlyInterest ? result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                  </p>
                                </div>
                                
                                {/* Add a simplified breakdown for banks without detailed items */}
                                {result.annualInterest > 0 && (
                                  <div className="mt-4 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                    <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Simplified Interest Breakdown:</p>
                                    <div className="flex justify-between items-center text-sm">
                                      <span>Base Interest Rate:</span>
                                      <span className="font-medium">
                                        {result.interestRate ? (result.interestRate * 100).toFixed(2) : '0.00'}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                      <span>Deposit Amount:</span>
                                      <span className="font-medium">
                                        ${result.depositAmount ? result.depositAmount.toLocaleString('en-US') : '0'}
                                      </span>
                                    </div>
                                  </div>
                                )}
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
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">
                                              ${item.amountInTier ? item.amountInTier.toLocaleString() : '0'} at {item.tierRate ? (item.tierRate * 100).toFixed(2) : '0.00'}%
                                            </span>
                                          </span>
                                          <span className="font-medium">
                                            ${item.tierInterest ? item.tierInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Base Interest:</span>
                                      <span className="text-primary">
                                        ${(() => {
                                          // Calculate the total directly from the items
                                          if (groupedBreakdown['Base Interest'] && groupedBreakdown['Base Interest'].items) {
                                            const total = groupedBreakdown['Base Interest'].items.reduce((sum, item) => sum + (item.tierInterest || 0), 0);
                                            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                          }
                                          return '0.00';
                                        })()}
                                      </span>
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
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">
                                              ${item.amountInTier ? item.amountInTier.toLocaleString() : '0'} at {item.tierRate ? (item.tierRate * 100).toFixed(2) : '0.00'}%
                                            </span>
                                          </span>
                                          <span className="font-medium">
                                            ${item.tierInterest ? item.tierInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Bonus Interest:</span>
                                      <span className="text-secondary">
                                        ${(() => {
                                          // Calculate the total directly from the items
                                          if (groupedBreakdown['Bonus Interest'] && groupedBreakdown['Bonus Interest'].items) {
                                            const total = groupedBreakdown['Bonus Interest'].items.reduce((sum, item) => sum + (item.tierInterest || 0), 0);
                                            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                          }
                                          return '0.00';
                                        })()}
                                      </span>
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
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">
                                              ${item.amountInTier ? item.amountInTier.toLocaleString() : '0'} at {item.tierRate ? (item.tierRate * 100).toFixed(2) : '0.00'}%
                                            </span>
                                          </span>
                                          <span className="font-medium">
                                            ${item.tierInterest ? item.tierInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Extra Interest:</span>
                                      <span className="text-accent">
                                        ${(() => {
                                          // Calculate the total directly from the items
                                          if (groupedBreakdown['Extra Interest'] && groupedBreakdown['Extra Interest'].items) {
                                            const total = groupedBreakdown['Extra Interest'].items.reduce((sum, item) => sum + (item.tierInterest || 0), 0);
                                            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                          }
                                          return '0.00';
                                        })()}
                                      </span>
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
                                            <span className="ml-1 text-gray-600 dark:text-gray-400">
                                              ${item.amountInTier ? item.amountInTier.toLocaleString() : '0'} at {item.tierRate ? (item.tierRate * 100).toFixed(2) : '0.00'}%
                                            </span>
                                          </span>
                                          <span className="font-medium">
                                            ${item.tierInterest ? item.tierInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="flex justify-between font-medium mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                                      <span>Total Other Interest:</span>
                                      <span className="text-gray-700 dark:text-gray-300">
                                        ${(() => {
                                          // Calculate the total directly from the items
                                          if (groupedBreakdown['Other'] && groupedBreakdown['Other'].items) {
                                            const total = groupedBreakdown['Other'].items.reduce((sum, item) => sum + (item.tierInterest || 0), 0);
                                            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                          }
                                          return '0.00';
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Total Section */}
                                <div className="fancy-border p-[1px] mt-2">
                                  <div className="fancy-border-content p-3">
                                    <div className="flex justify-between font-bold">
                                      <span>Total Annual Interest:</span>
                                      <span className="text-primary">
                                        ${(() => {
                                          // Calculate the total directly from all categories
                                          let calculatedTotal = 0;
                                          if (groupedBreakdown['Base Interest'] && groupedBreakdown['Base Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Base Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Bonus Interest'] && groupedBreakdown['Bonus Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Bonus Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Extra Interest'] && groupedBreakdown['Extra Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Extra Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Other'] && groupedBreakdown['Other'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Other'].subtotal;
                                          }
                                          
                                          return calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                        })()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm mt-1">
                                      <span>Monthly Interest:</span>
                                      <span>
                                        ${(() => {
                                          // Calculate the total directly from all categories
                                          let calculatedTotal = 0;
                                          if (groupedBreakdown['Base Interest'] && groupedBreakdown['Base Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Base Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Bonus Interest'] && groupedBreakdown['Bonus Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Bonus Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Extra Interest'] && groupedBreakdown['Extra Interest'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Extra Interest'].subtotal;
                                          }
                                          if (groupedBreakdown['Other'] && groupedBreakdown['Other'].subtotal) {
                                            calculatedTotal += groupedBreakdown['Other'].subtotal;
                                          }
                                          
                                          return (calculatedTotal / 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                        })()}
                                      </span>
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