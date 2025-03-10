import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, ReportCalculationDialog } from './ui';
import InterestBreakdown from './InterestBreakdown';
import { motion, AnimatePresence } from 'framer-motion';

const ComparisonTable = ({ results, getBankById }) => {
  const [expandedBreakdowns, setExpandedBreakdowns] = useState({});
  const [expandedMobileDetails, setExpandedMobileDetails] = useState({});
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [shouldShimmer, setShouldShimmer] = useState(true);
  const tableRef = useRef(null);

  const toggleBreakdown = (bankId) => {
    setExpandedBreakdowns(prev => ({
      ...prev,
      [bankId]: !prev[bankId]
    }));
  };

  const toggleMobileDetails = (bankId) => {
    setExpandedMobileDetails(prev => ({
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

  useEffect(() => {
    // Show scroll indicator for 2 seconds when results change
    setShowScrollIndicator(true);
    setShouldShimmer(true);
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
      setShouldShimmer(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [results]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`glass-card ${shouldShimmer ? 'shimmer' : ''}`}>
        <CardHeader className="bg-purple-700 text-white py-2">
          <div className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-white text-sm sm:text-base md:text-lg">Bank Comparison</CardTitle>
            <ReportCalculationDialog 
              trigger={
                <button className="flex items-center gap-1 text-xs px-2 py-0.5 sm:px-3 sm:py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors">
                  <AlertTriangle size={12} className="sm:w-4 sm:h-4" />
                  <span className="sm:hidden">Report</span>
                  <span className="hidden sm:inline">Report Issue</span>
                </button>
              } 
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="relative">
            <div className="overflow-x-auto" ref={tableRef}>
              {/* Desktop Table - Hidden on Mobile */}
              <table className="fancy-table hidden md:table">
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
                    
                    return (
                      <React.Fragment key={result.bankId}>
                        <tr className={isExpanded ? "bg-primary/5" : ""}>
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
                              className="breakdown-button flex items-center"
                              onClick={() => toggleBreakdown(result.bankId)}
                            >
                              <span>View Breakdown</span>
                              {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-primary/5">
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

              {/* Mobile Table */}
              <div className="md:hidden space-y-4 pt-4">
                {results.map((result) => {
                  const bank = getBankById(result.bankId);
                  const isExpanded = expandedBreakdowns[result.bankId] || false;
                  const isMobileExpanded = expandedMobileDetails[result.bankId] || false;
                  const manualBreakdown = generateManualBreakdown(result);

                  return (
                    <div key={result.bankId} className="bg-white rounded-lg shadow-sm border">
                      <div className="p-3">
                        {/* Bank and Interest Rate Row */}
                        <div className="flex items-center justify-between mb-2">
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
                          <span className="text-primary font-bold">
                            {result.interestRate ? (result.interestRate * 100).toFixed(2) : '0.00'}%
                          </span>
                        </div>

                        {/* Expandable Details Button */}
                        <button 
                          className="w-full text-left text-sm text-gray-600 flex items-center justify-between py-1"
                          onClick={() => toggleMobileDetails(result.bankId)}
                        >
                          <span>View Details</span>
                          {isMobileExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* Expanded Details */}
                        {isMobileExpanded && (
                          <div className="pt-2 space-y-2 border-t mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Monthly Interest:</span>
                              <span className="font-medium">
                                ${result.monthlyInterest ? result.monthlyInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Annual Interest:</span>
                              <span className="font-medium">
                                ${result.annualInterest ? result.annualInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                              </span>
                            </div>
                            <button 
                              className="w-full text-left text-sm text-blue-600 flex items-center justify-between py-1 mt-2"
                              onClick={() => toggleBreakdown(result.bankId)}
                            >
                              <span>Interest Breakdown</span>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isExpanded && (
                              <div className="glossy-surface mt-2 p-3 space-y-3 animate-in fade-in">
                                <InterestBreakdown breakdown={manualBreakdown || []} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Mobile Scroll Indicator */}
            <AnimatePresence>
              {showScrollIndicator && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 p-2 rounded-l-lg md:hidden"
                >
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonTable; 