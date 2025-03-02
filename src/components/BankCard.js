"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, BadgePercent, PiggyBank, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Checkbox, Label } from './ui';

const BankCard = ({
  bank,
  loanType,
  calculationResult,
  selected,
  onToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
  
  const getBankRate = () => {
    if (!bank) return 0;
    
    switch (loanType) {
      case 'mortgage':
        return bank.mortgageRate || 0;
      case 'personal':
        return bank.personalLoanRate || 0;
      case 'auto':
      case 'car':
        return bank.carLoanRate || 0;
      case 'credit':
        return bank.creditCardRate || 0;
      case 'savings':
        // First check if we have a calculated interest rate from the calculation result
        if (calculationResult && typeof calculationResult.interestRate !== 'undefined') {
          return calculationResult.interestRate * 100;
        }
        // If not, try to get from tiers if available
        if (bank.tiers && bank.tiers.length > 0) {
          // Handle different tier structures
          if (typeof bank.tiers[0] === 'object' && 'interest_rate' in bank.tiers[0]) {
            const baseRate = bank.tiers.find(tier => tier.tier_type === 'base')?.interest_rate || bank.tiers[0].interest_rate;
            return typeof baseRate === 'string' && baseRate.includes('%') 
              ? parseFloat(baseRate.replace('%', '')) 
              : parseFloat(baseRate) * 100 || 0;
          } else {
            // Handle numeric tiers
            return (bank.tiers[0].rate || bank.baseRate || 0) * 100;
          }
        }
        // Then try savingsRate
        return (bank.savingsRate || bank.maxRate || bank.baseRate || 0) * 100;
      default:
        return 0;
    }
  };

  const getLoanTypeName = () => {
    switch (loanType) {
      case 'mortgage':
        return 'Mortgage';
      case 'personal':
        return 'Personal Loan';
      case 'auto':
        return 'Auto Loan';
      case 'savings':
        return 'Savings';
      default:
        return 'Loan';
    }
  };
  
  const getLoanTypeIcon = () => {
    switch (loanType) {
      case 'mortgage':
        return <Wallet className="w-5 h-5" />;
      case 'personal':
        return <BadgePercent className="w-5 h-5" />;
      case 'auto':
        return <TrendingUp className="w-5 h-5" />;
      case 'savings':
        return <PiggyBank className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  // Group breakdown items by type
  const getGroupedBreakdown = () => {
    console.log("getGroupedBreakdown called");
    console.log("calculationResult:", calculationResult);
    
    if (!calculationResult) {
      console.log("No calculation result available");
      return { total: 0 };
    }
    
    if (!calculationResult.breakdown || !Array.isArray(calculationResult.breakdown) || calculationResult.breakdown.length === 0) {
      console.log("No breakdown data available or empty array");
      return { total: calculationResult.annualInterest || 0 };
    }
    
    console.log("Breakdown data:", calculationResult.breakdown);
    
    const grouped = {};
    let totalInterest = 0;
    
    calculationResult.breakdown.forEach(item => {
      console.log("Processing breakdown item:", item);
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
    
    console.log("Grouped breakdown:", grouped);
    return grouped;
  };

  if (!bank) return null;
  
  const cardVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    selected: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }
  };

  const groupedBreakdown = getGroupedBreakdown();

  return (
    <motion.div
      initial="initial"
      animate={selected ? "selected" : "initial"}
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative glass-card overflow-hidden ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {selected && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`compare-${bank.id}`}
              checked={selected}
              onChange={() => onToggle(bank.id)}
            />
            <Label htmlFor={`compare-${bank.id}`} className="text-xs">
              Compare
            </Label>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${bank.color || '#888888'}, ${bank.color ? bank.color + '99' : '#666666'})` 
              }}
            >
              {bank.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold">{bank.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground space-x-1">
                {getLoanTypeIcon()}
                <span>{getLoanTypeName()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {getBankRate().toFixed(2)}%
              </motion.p>
            </div>

            {calculationResult && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Interest</p>
                  <motion.p 
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    ${calculationResult.monthlyInterest !== undefined ? calculationResult.monthlyInterest.toFixed(2) : '0.00'}
                  </motion.p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {loanType === 'savings' ? 'Annual Interest Earned' : 'Total Interest'}
                  </p>
                  <motion.p 
                    className="text-xl font-semibold"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    ${calculationResult.annualInterest !== undefined ? calculationResult.annualInterest.toFixed(2) : '0.00'}
                  </motion.p>
                </div>
              </>
            )}

            {calculationResult && (
              <div className="mt-4">
                <button 
                  className="flex items-center justify-between w-full text-sm font-medium mb-2 text-primary"
                  onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
                >
                  <span>Interest Breakdown</span>
                  {isBreakdownExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {isBreakdownExpanded && (
                  <div className="text-sm space-y-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    {(!calculationResult.breakdown || !Array.isArray(calculationResult.breakdown) || calculationResult.breakdown.length === 0) ? (
                      <div className="text-center py-2">
                        <p>Detailed breakdown not available for this bank.</p>
                        <p>Total Annual Interest: ${calculationResult.annualInterest ? calculationResult.annualInterest.toFixed(2) : '0.00'}</p>
                        <p>Monthly Interest: ${calculationResult.monthlyInterest ? calculationResult.monthlyInterest.toFixed(2) : '0.00'}</p>
                      </div>
                    ) : (
                      <>
                        {/* Base Interest Section */}
                        {groupedBreakdown['Base Interest'] && (
                          <div>
                            <p className="font-medium">Base Interest:</p>
                            <ul className="space-y-1 pl-2">
                              {groupedBreakdown['Base Interest'].items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.description.replace('Base Interest', '').trim()}: ${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                  <span>${item.tierInterest.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between font-medium mt-1">
                              <span>Total Base Interest:</span>
                              <span>${groupedBreakdown['Base Interest'].subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Bonus Interest Section */}
                        {groupedBreakdown['Bonus Interest'] && (
                          <div>
                            <p className="font-medium">Bonus Interest (on first $100,000):</p>
                            <ul className="space-y-1 pl-2">
                              {groupedBreakdown['Bonus Interest'].items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.description}: ${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                  <span>${item.tierInterest.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between font-medium mt-1">
                              <span>Total Bonus Interest:</span>
                              <span>${groupedBreakdown['Bonus Interest'].subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Extra Interest Section */}
                        {groupedBreakdown['Extra Interest'] && (
                          <div>
                            <p className="font-medium">Extra Interest (above $100,000):</p>
                            <ul className="space-y-1 pl-2">
                              {groupedBreakdown['Extra Interest'].items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.description}: ${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                  <span>${item.tierInterest.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between font-medium mt-1">
                              <span>Total Extra Interest:</span>
                              <span>${groupedBreakdown['Extra Interest'].subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Other Interest Section */}
                        {groupedBreakdown['Other'] && (
                          <div>
                            <p className="font-medium">Other Interest:</p>
                            <ul className="space-y-1 pl-2">
                              {groupedBreakdown['Other'].items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.description}: ${item.amountInTier.toLocaleString()} at {(item.tierRate * 100).toFixed(2)}%</span>
                                  <span>${item.tierInterest.toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between font-medium mt-1">
                              <span>Total Other Interest:</span>
                              <span>${groupedBreakdown['Other'].subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Total Section */}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Annual Interest:</span>
                            <span>${groupedBreakdown.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Monthly Interest:</span>
                            <span>${(groupedBreakdown.total / 12).toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BankCard; 