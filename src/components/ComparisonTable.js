import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import InterestBreakdown from './InterestBreakdown';

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
    // Test 1: Check if result object has required data
    console.log("Test 1 - Result Object:", {
      hasResult: !!result,
      depositAmount: result?.depositAmount,
      interestRate: result?.interestRate,
      bankId: result?.bankId,
      hasBreakdown: !!result?.breakdown,
      breakdownLength: result?.breakdown?.length
    });

    // If we have a breakdown array from the calculation, use it
    if (result?.breakdown && Array.isArray(result.breakdown) && result.breakdown.length > 0) {
      return result.breakdown;
    }

    // If no breakdown available, generate a simple one
    if (!result || !result.depositAmount) {
      return [
        {
          isHeader: true,
          description: "Interest Breakdown:"
        },
        {
          isTotal: true,
          description: "Total Annual Interest:",
          tierInterest: 0,
          monthlyInterest: 0
        }
      ];
    }

    const bank = getBankById(result.bankId);
    
    // Test 2: Check if bank object is found and has tiers
    console.log("Test 2 - Bank Object:", {
      bankFound: !!bank,
      bankId: result?.bankId,
      hasTiers: !!bank?.tiers,
      tiersLength: bank?.tiers?.length
    });

    const interestRate = result.interestRate || 0;
    const annualInterest = result.depositAmount * interestRate;
    const monthlyInterest = annualInterest / 12;

    // Test 3: Check interest rate calculations
    console.log("Test 3 - Interest Calculations:", {
      interestRate,
      annualInterest,
      monthlyInterest,
      depositAmount: result?.depositAmount
    });

    // Get the bank's tier information
    const tiers = bank?.tiers || [];
    const baseTier = tiers.find(t => t.tierType === 'base');
    const salaryTier = tiers.find(t => t.tierType === 'salary');
    const spendTier = tiers.find(t => t.tierType === 'spend');
    const investTier = tiers.find(t => t.tierType === 'invest');
    const insureTier = tiers.find(t => t.tierType === 'insure');

    const breakdown = [
      {
        isHeader: true,
        description: "Interest Breakdown:"
      }
    ];

    // Add base interest tier if applicable
    if (baseTier) {
      const baseRate = parseFloat(baseTier.interestRate) || 0;
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: baseRate,
        tierInterest: result.depositAmount * baseRate,
        monthlyInterest: (result.depositAmount * baseRate) / 12,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(baseRate * 100).toFixed(2)}% - Base Interest`
      });
    }

    // Add salary bonus tier if applicable
    if (salaryTier && result.hasSalary && (result.salaryAmount || 0) >= (parseFloat(salaryTier.minSalary) || 0)) {
      const salaryRate = parseFloat(salaryTier.interestRate) || 0;
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: salaryRate,
        tierInterest: result.depositAmount * salaryRate,
        monthlyInterest: (result.depositAmount * salaryRate) / 12,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(salaryRate * 100).toFixed(2)}% - Salary Bonus (>= $${(parseFloat(salaryTier.minSalary) || 0).toLocaleString()})`
      });
    }

    // Add spend bonus tier if applicable
    if (spendTier && (result.spendAmount || 0) >= (parseFloat(spendTier.minSpend) || 0)) {
      const spendRate = parseFloat(spendTier.interestRate) || 0;
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: spendRate,
        tierInterest: result.depositAmount * spendRate,
        monthlyInterest: (result.depositAmount * spendRate) / 12,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(spendRate * 100).toFixed(2)}% - Card Spend Bonus (>= $${(parseFloat(spendTier.minSpend) || 0).toLocaleString()})`
      });
    }

    // Add investment bonus tier if applicable
    if (investTier && result.hasInvestments) {
      const investRate = parseFloat(investTier.interestRate) || 0;
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: investRate,
        tierInterest: result.depositAmount * investRate,
        monthlyInterest: (result.depositAmount * investRate) / 12,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(investRate * 100).toFixed(2)}% - Investment Bonus`
      });
    }

    // Add insurance bonus tier if applicable
    if (insureTier && result.hasInsurance) {
      const insureRate = parseFloat(insureTier.interestRate) || 0;
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: insureRate,
        tierInterest: result.depositAmount * insureRate,
        monthlyInterest: (result.depositAmount * insureRate) / 12,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(insureRate * 100).toFixed(2)}% - Insurance Bonus`
      });
    }

    // If no tiers are applicable, show a simple breakdown
    if (breakdown.length === 1) {
      breakdown.push({
        amountInTier: result.depositAmount,
        tierRate: interestRate,
        tierInterest: annualInterest,
        monthlyInterest: monthlyInterest,
        description: `$${result.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} at ${(interestRate * 100).toFixed(2)}%`
      });
    }

    // Add total
    breakdown.push({
      isTotal: true,
      description: "Total Annual Interest:",
      tierInterest: annualInterest,
      monthlyInterest: monthlyInterest
    });

    // Test 4: Check breakdown array structure
    console.log("Test 4 - Breakdown Array:", {
      breakdownLength: breakdown.length,
      hasHeader: breakdown.some(item => item.isHeader),
      hasTotal: breakdown.some(item => item.isTotal),
      items: breakdown.map(item => ({
        type: item.isHeader ? 'header' : item.isTotal ? 'total' : 'tier',
        description: item.description,
        tierInterest: item.tierInterest
      }))
    });

    return breakdown;
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
                const manualBreakdown = generateManualBreakdown(result);
                
                // Test 5: Check what InterestBreakdown receives
                console.log("Test 5 - InterestBreakdown Props:", {
                  breakdown: manualBreakdown,
                  groupedBreakdown: getGroupedBreakdown(manualBreakdown)
                });
                
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
                            <InterestBreakdown breakdown={manualBreakdown || []} />
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