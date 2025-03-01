"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BankCard from './components/BankCard';
import ComparisonChart from './components/ComparisonChart';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import './App.css';

function App() {
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [calculationResults, setCalculationResults] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  
  // User requirements
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(3500);
  const [cardSpend, setCardSpend] = useState(500);
  const [giroCount, setGiroCount] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [hasInvestments, setHasInvestments] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [homeLoanAmount, setHomeLoanAmount] = useState(0);
  const [increasedBalance, setIncreasedBalance] = useState(false);
  const [grewWealth, setGrewWealth] = useState(false);
  
  // Sample bank data wrapped in useMemo based on SmartSaver structure
  const banks = useMemo(() => [
    {
      id: 'uob-one',
      bank: 'UOB One',
      name: 'UOB One',
      color: '#0033A0',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: 'First $100K',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest of 0.05%'
        },
        {
          tier_type: 'spend_only',
          balance_tier: '1',
          interest_rate: '0.65%',
          requirement_type: 'spend_only',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 75000,
          remarks: 'First $75k with card spend only'
        },
        {
          tier_type: 'salary',
          balance_tier: 'First $75K',
          interest_rate: '3.00%',
          requirement_type: 'salary',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 75000,
          remarks: 'First $75k with salary + spend'
        },
        {
          tier_type: 'salary',
          balance_tier: 'Next $50K',
          interest_rate: '4.50%',
          requirement_type: 'salary',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 50000,
          remarks: 'Next $50k with salary + spend'
        }
      ],
      features: [
        'Up to 7.8% p.a. interest on your savings',
        'No minimum credit card spend',
        'No minimum salary credit',
        'No lock-in period'
      ]
    },
    {
      id: 'sc-bonussaver',
      bank: 'SC BonusSaver',
      name: 'Standard Chartered BonusSaver',
      color: '#0F5132',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest with no requirements'
        },
        {
          tier_type: 'salary',
          balance_tier: '1',
          interest_rate: '1.00%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 3000,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 100000,
          remarks: 'Regular salary credit at least $3000'
        },
        {
          tier_type: 'spend',
          balance_tier: '1',
          interest_rate: '1.00%',
          requirement_type: 'spend',
          min_spend: 1000,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Card spend at least $1000'
        }
      ],
      features: [
        'Up to 4.28% p.a. interest on your savings',
        'Bonus interest on eligible transactions',
        'No lock-in period',
        'Free digital banking'
      ]
    },
    {
      id: 'ocbc-360',
      bank: 'OCBC 360',
      name: 'OCBC 360',
      color: '#EB001B',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest with no requirements'
        },
        {
          tier_type: 'salary',
          balance_tier: '1',
          interest_rate: '2.00%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 1800,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 75000,
          remarks: 'First $75k with salary at least $1800'
        },
        {
          tier_type: 'spend',
          balance_tier: '1',
          interest_rate: '0.60%',
          requirement_type: 'spend',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 75000,
          remarks: 'First $75k with card spend at least $500'
        }
      ],
      features: [
        'Up to 7.65% p.a. interest on your savings',
        'Multiple ways to earn bonus interest',
        'No minimum balance fee',
        'Free digital banking'
      ]
    },
    {
      id: 'dbs-multiplier',
      bank: 'DBS Multiplier',
      name: 'DBS Multiplier',
      color: '#E52E2E',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 999999999,
          remarks: 'Base interest (for amounts not eligible for bonus)'
        },
        {
          tier_type: 'cat1_low',
          balance_tier: '1',
          interest_rate: '1.80%',
          requirement_type: 'cat1',
          min_spend: 500,
          min_salary: 1,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 50000,
          remarks: '1 category + $500-$15k transactions'
        },
        {
          tier_type: 'cat2_high',
          balance_tier: '1',
          interest_rate: '3.00%',
          requirement_type: 'cat2',
          min_spend: 30000,
          min_salary: 1,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 100000,
          remarks: '2 categories + >$30k transactions'
        }
      ],
      features: [
        'Up to 4.1% p.a. interest on your savings',
        'No minimum amount for salary credit',
        'No lock-in period',
        'Free digital banking'
      ]
    }
  ], []);
  
  const getBankById = (bankId) => {
    return banks.find(bank => bank.id === bankId);
  };
  
  const toggleBankSelection = (bankId) => {
    setSelectedBanks(prev => {
      if (prev.includes(bankId)) {
        return prev.filter(id => id !== bankId);
      } else {
        return [...prev, bankId];
      }
    });
  };
  
  // Format number with commas
  const formatNumber = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate bank interest based on SmartSaver logic
  const calculateBankInterest = (depositAmount, bankInfo, requirements) => {
    let totalInterest = 0;
    const breakdown = [];
    
    // Helper function to add tier
    const addTier = (amount, rate, description = "") => {
      const interest = amount * rate;
      breakdown.push({
        amount_in_tier: parseFloat(amount),
        tier_rate: parseFloat(rate),
        tier_interest: interest,
        monthly_interest: interest / 12,
        description: description.trim()
      });
      return interest;
    };
    
    // Base interest calculation
    const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
    if (baseTier) {
      const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
      totalInterest += addTier(depositAmount, baseRate, "Base interest");
    }
    
    // Salary tier calculation
    if (requirements.hasSalary && requirements.salaryAmount >= 2000) {
      const salaryTier = bankInfo.tiers.find(t => t.tier_type === 'salary');
      if (salaryTier) {
        const salaryRate = parseFloat(salaryTier.interest_rate.replace('%', '')) / 100;
        const capAmount = Math.min(depositAmount, parseFloat(salaryTier.cap_amount));
        totalInterest += addTier(capAmount, salaryRate, "Salary credit bonus");
      }
    }
    
    // Spend tier calculation
    if (requirements.cardSpend >= 500) {
      const spendTier = bankInfo.tiers.find(t => 
        t.tier_type === 'spend' || t.tier_type === 'spend_only'
      );
      if (spendTier && requirements.cardSpend >= parseFloat(spendTier.min_spend)) {
        const spendRate = parseFloat(spendTier.interest_rate.replace('%', '')) / 100;
        const capAmount = Math.min(depositAmount, parseFloat(spendTier.cap_amount));
        totalInterest += addTier(capAmount, spendRate, "Card spend bonus");
      }
    }
    
    // GIRO tier calculation
    if (requirements.giroCount > 0) {
      const giroTier = bankInfo.tiers.find(t => t.tier_type === 'giro');
      if (giroTier && requirements.giroCount >= parseFloat(giroTier.giro_count)) {
        const giroRate = parseFloat(giroTier.interest_rate.replace('%', '')) / 100;
        const capAmount = Math.min(depositAmount, parseFloat(giroTier.cap_amount));
        totalInterest += addTier(capAmount, giroRate, "GIRO payment bonus");
      }
    }
    
    return {
      total_interest: totalInterest,
      breakdown: breakdown
    };
  };
  
  // Calculate results for all banks
  const calculateResults = () => {
    const requirements = {
      hasSalary,
      salaryAmount,
      cardSpend,
      giroCount,
      hasInsurance,
      hasInvestments,
      increasedBalance,
      grewWealth,
      insuranceAmount: hasInsurance ? insuranceAmount : 0,
      investmentAmount: hasInvestments ? investmentAmount : 0,
      hasHomeLoan,
      homeLoanAmount: hasHomeLoan ? homeLoanAmount : 0
    };
    
    const results = {};
    
    banks.forEach(bank => {
      const bankResults = calculateBankInterest(depositAmount, bank, requirements);
      
      results[bank.id] = {
        bankId: bank.id,
        monthlyInterest: bankResults.total_interest / 12,
        annualInterest: bankResults.total_interest,
        breakdown: bankResults.breakdown
      };
    });
    
    setCalculationResults(results);
    setHasCalculated(true);
  };
  
  // Get comparison results for selected banks
  const getComparisonResults = () => {
    return selectedBanks.map(bankId => ({
      bankId,
      monthlyPayment: calculationResults[bankId]?.monthlyInterest || 0,
      totalInterest: calculationResults[bankId]?.annualInterest || 0,
      totalCost: depositAmount + (calculationResults[bankId]?.annualInterest || 0),
      amortizationSchedule: []
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">🏦 SmartSaverSG</h1>
        <p className="text-lg text-muted-foreground">Maximize Your Savings with Bank Interest Calculator</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Step 1: Enter Savings Amount */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Enter Your Savings Amount</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount to calculate interest for ($)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Selected Amount: ${formatNumber(depositAmount)}
              </p>
            </div>
          </div>

          {/* Step 2: Banking Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Enter Your Banking Details</h2>
            
            <div className="border p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-3">Basic Requirements</h3>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="has-salary"
                    checked={hasSalary}
                    onChange={(e) => setHasSalary(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has-salary" className="text-sm font-medium">
                    Credit Salary to Bank Account
                  </label>
                </div>
                
                {hasSalary && (
                  <div className="ml-6 mb-2">
                    <label className="block text-sm mb-1">
                      Monthly Salary Amount ($)
                    </label>
                    <input
                      type="number"
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected Salary Amount: ${formatNumber(salaryAmount)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Spend per Month ($)
                  </label>
                  <input
                    type="number"
                    value={cardSpend}
                    onChange={(e) => setCardSpend(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected Card Spend: ${formatNumber(cardSpend)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Bill Payments / GIRO
                  </label>
                  <input
                    type="number"
                    value={giroCount}
                    onChange={(e) => setGiroCount(Number(e.target.value))}
                    min="0"
                    max="10"
                    className="w-full p-2 border rounded"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected Bill Payments: {giroCount}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-3">Advanced Requirements (Optional)</h3>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="has-insurance"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has-insurance" className="text-sm font-medium">
                    Have Insurance Products
                  </label>
                </div>
                
                {hasInsurance && (
                  <div className="ml-6 mb-2">
                    <label className="block text-sm mb-1">
                      Monthly Insurance Premium Amount ($)
                    </label>
                    <input
                      type="number"
                      value={insuranceAmount}
                      onChange={(e) => setInsuranceAmount(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="has-investments"
                    checked={hasInvestments}
                    onChange={(e) => setHasInvestments(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has-investments" className="text-sm font-medium">
                    Have Investments
                  </label>
                </div>
                
                {hasInvestments && (
                  <div className="ml-6 mb-2">
                    <label className="block text-sm mb-1">
                      Monthly Investment Amount ($)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="has-home-loan"
                    checked={hasHomeLoan}
                    onChange={(e) => setHasHomeLoan(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="has-home-loan" className="text-sm font-medium">
                    Have Home Loan
                  </label>
                </div>
                
                {hasHomeLoan && (
                  <div className="ml-6 mb-2">
                    <label className="block text-sm mb-1">
                      Monthly Home Loan Installment Amount ($)
                    </label>
                    <input
                      type="number"
                      value={homeLoanAmount}
                      onChange={(e) => setHomeLoanAmount(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="increased-balance"
                    checked={increasedBalance}
                    onChange={(e) => setIncreasedBalance(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="increased-balance" className="text-sm font-medium">
                    [OCBC-Specific] Increased Account Balance
                  </label>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="grew-wealth"
                    checked={grewWealth}
                    onChange={(e) => setGrewWealth(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="grew-wealth" className="text-sm font-medium">
                    [OCBC-Specific] Grew Wealth
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={calculateResults}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: '#0033A0', color: 'white' }}
          >
            Calculate Interest Rates
          </button>
        </div>
        
        <div>
          {/* Step 3: Results */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 3: Calculate and Compare</h2>
            
            {!hasCalculated ? (
              <div className="border p-6 rounded-lg text-center">
                <p className="text-lg mb-2">Enter your details and click "Calculate Interest Rates"</p>
                <p className="text-muted-foreground">
                  You'll see detailed breakdowns for each bank and be able to compare interest rates.
                </p>
              </div>
            ) : (
              <div>
                {/* Sort banks by interest rate (highest to lowest) */}
                {Object.values(calculationResults)
                  .sort((a, b) => b.annualInterest - a.annualInterest)
                  .map((result, index) => {
                    const bank = getBankById(result.bankId);
                    const isOptimal = index === 0;
                    
                    return (
                      <div 
                        key={result.bankId}
                        className={`border rounded-lg mb-4 overflow-hidden ${
                          isOptimal ? 'border-primary border-2' : ''
                        }`}
                      >
                        {isOptimal && (
                          <div className="bg-primary text-white py-1 px-4 text-center">
                            🏆 Optimal Choice
                          </div>
                        )}
                        
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: bank.color }}
                            >
                              {bank.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{bank.name}</h3>
                            </div>
                            
                            <div className="ml-auto">
                              <input
                                type="checkbox"
                                id={`compare-${bank.id}`}
                                checked={selectedBanks.includes(bank.id)}
                                onChange={() => toggleBankSelection(bank.id)}
                                className="mr-1"
                              />
                              <label htmlFor={`compare-${bank.id}`} className="text-xs">
                                Compare
                              </label>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly Interest</p>
                              <p className="text-2xl font-bold">${result.monthlyInterest.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Annual Interest</p>
                              <p className="text-2xl font-bold">${result.annualInterest.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {result.breakdown && result.breakdown.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Interest Breakdown:</p>
                              <ul className="text-sm space-y-1">
                                {result.breakdown.map((tier, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      ${tier.amount_in_tier.toFixed(2)} at {(tier.tier_rate * 100).toFixed(2)}% - {tier.description}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-1">Key Features</p>
                            <ul className="text-sm space-y-1">
                              {bank.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBanks.length > 1 && hasCalculated && (
        <div className="mt-8">
          <ComparisonChart
            results={getComparisonResults()}
            loanType="savings"
            getBankById={getBankById}
          />
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2023 SmartSaverSG. All rates are for demonstration purposes only.</p>
      </footer>
    </div>
  );
}

export default App; 