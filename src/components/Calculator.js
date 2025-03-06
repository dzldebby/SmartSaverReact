"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, BadgePercent, PiggyBank, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Checkbox, Label, Input, Slider, Button } from './ui';
import { calculateInterest } from '../lib/calculations';
import { findOptimalDistribution } from '../lib/optimizationEngine';
import { BANKS } from '../lib/bankConstants';
import StepProgress from './StepProgress';
import ComparisonTable from './ComparisonTable';

const Calculator = ({
  depositAmount,
  setDepositAmount,
  hasSalary,
  setHasSalary,
  salaryAmount,
  setSalaryAmount,
  transactionCode,
  setTransactionCode,
  cardSpend,
  setCardSpend,
  giroCount,
  setGiroCount,
  hasInsurance,
  setHasInsurance,
  insuranceAmount,
  setInsuranceAmount,
  hasInvestments,
  setHasInvestments,
  investmentAmount,
  setInvestmentAmount,
  hasHomeLoan,
  setHasHomeLoan,
  homeLoanAmount,
  setHomeLoanAmount,
  increasedBalance,
  setIncreasedBalance,
  grewWealth,
  setGrewWealth,
  calculateResults,
  handleOptimize,
  formatNumber
}) => {
  const [isBasicRequirementsOpen, setIsBasicRequirementsOpen] = useState(true);
  const [isAdvancedRequirementsOpen, setIsAdvancedRequirementsOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState([]);
  const [results, setResults] = useState([]);
  const [hasTransactionCode, setHasTransactionCode] = useState(false);

  // Add a local formatNumber function if it's not provided as a prop
  const formatNumberLocal = (n) => {
    if (formatNumber) {
      return formatNumber(n);
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Add this helper function at the top of the component
  const handleNumericInput = (value, setter) => {
    // If empty or just a minus sign, set to empty string
    if (value === '' || value === '-') {
      setter('');
      return;
    }
    
    // Convert to number and validate
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setter(num);
    }
  };

  // Add handleCalculate function
  const handleCalculate = () => {
    setIsCalculating(true);
    try {
      calculateResults();
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Add handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCalculate();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full p-0">
      {/* Left Column - Calculator Form */}
      <div className="space-y-4 w-full">
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          {/* Step 1: Enter Savings Amount */}
          <div className="space-y-4 mb-6 mt-4 w-full">
            <h3 className="text-xl font-semibold flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              Step 1: Enter Your Savings Amount
            </h3>
            <div className="glass-panel p-4 sm:p-6 space-y-4 w-full">
              <div>
                <Label htmlFor="deposit-amount" className="text-sm font-medium mb-2 block">
                  Amount to calculate interest for ($)
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      id="deposit-amount"
                      type="number"
                      value={depositAmount || ''}
                      onChange={(e) => handleNumericInput(e.target.value, setDepositAmount)}
                      className="input-glass"
                      min="0"
                    />
                    <Button 
                      onClick={() => setDepositAmount(10000)}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      Reset
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected Amount: ${formatNumberLocal(depositAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Banking Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <PiggyBank className="mr-2 h-5 w-5 text-primary" />
              Step 2: Enter Your Banking Details
            </h3>
            
            {/* Basic Requirements - Collapsible */}
            <Card className="glass-card overflow-hidden w-full">
              <button 
                type="button"
                onClick={() => setIsBasicRequirementsOpen(!isBasicRequirementsOpen)}
                className="w-full p-4 text-left font-medium flex justify-between items-center hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span>Basic Requirements</span>
                {isBasicRequirementsOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              
              <motion.div 
                initial={{ height: isBasicRequirementsOpen ? 'auto' : 0 }}
                animate={{ height: isBasicRequirementsOpen ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has-salary"
                        checked={hasSalary}
                        onCheckedChange={setHasSalary}
                      />
                      <Label htmlFor="has-salary" className="font-medium">
                        Credit Salary to Bank Account
                      </Label>
                    </div>
                    
                    {hasSalary && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 space-y-2"
                      >
                        <Label htmlFor="salary-amount" className="text-sm block">
                          Monthly Salary Amount ($)
                        </Label>
                        <Input
                          id="salary-amount"
                          type="number"
                          value={salaryAmount || ''}
                          onChange={(e) => handleNumericInput(e.target.value, setSalaryAmount)}
                          className="input-glass"
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground">
                          Selected Salary Amount: ${formatNumberLocal(salaryAmount)}
                        </p>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-spend" className="text-sm block">
                        Card Spend per Month ($)
                      </Label>
                      <Input
                        id="card-spend"
                        type="number"
                        value={cardSpend || ''}
                        onChange={(e) => handleNumericInput(e.target.value, setCardSpend)}
                        className="input-glass"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Selected Card Spend: ${formatNumberLocal(cardSpend)}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="giro-count" className="text-sm block">
                        Number of Bill Payments / GIRO
                      </Label>
                      <Input
                        id="giro-count"
                        type="number"
                        value={giroCount}
                        onChange={(e) => handleNumericInput(e.target.value, setGiroCount)}
                        className="input-glass"
                        min="0"
                        max="10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Selected Bill Payments: {giroCount}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
            
            {/* Advanced Requirements - Collapsible */}
            <Card className="glass-card overflow-hidden w-full">
              <button 
                type="button"
                onClick={() => setIsAdvancedRequirementsOpen(!isAdvancedRequirementsOpen)}
                className="w-full p-4 text-left font-medium flex justify-between items-center hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span>Advanced Requirements (Optional)</span>
                {isAdvancedRequirementsOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              
              <motion.div 
                initial={{ height: isAdvancedRequirementsOpen ? 'auto' : 0 }}
                animate={{ height: isAdvancedRequirementsOpen ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has-insurance"
                        checked={hasInsurance}
                        onCheckedChange={setHasInsurance}
                      />
                      <Label htmlFor="has-insurance" className="font-medium">
                        Have Insurance Products
                      </Label>
                    </div>
                    
                    {hasInsurance && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 space-y-2"
                      >
                        <Label htmlFor="insurance-amount" className="text-sm block">
                          Monthly Insurance Premium Amount ($)
                        </Label>
                        <Input
                          id="insurance-amount"
                          type="number"
                          value={insuranceAmount || ''}
                          onChange={(e) => handleNumericInput(e.target.value, setInsuranceAmount)}
                          className="input-glass"
                          min="0"
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has-investments"
                        checked={hasInvestments}
                        onCheckedChange={setHasInvestments}
                      />
                      <Label htmlFor="has-investments" className="font-medium">
                        Have Investments
                      </Label>
                    </div>
                    
                    {hasInvestments && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 space-y-2"
                      >
                        <Label htmlFor="investment-amount" className="text-sm block">
                          Monthly Investment Amount ($)
                        </Label>
                        <Input
                          id="investment-amount"
                          type="number"
                          value={investmentAmount || ''}
                          onChange={(e) => handleNumericInput(e.target.value, setInvestmentAmount)}
                          className="input-glass"
                          min="0"
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has-home-loan"
                        checked={hasHomeLoan}
                        onCheckedChange={setHasHomeLoan}
                      />
                      <Label htmlFor="has-home-loan" className="font-medium">
                        Have Home Loan
                      </Label>
                    </div>
                    
                    {hasHomeLoan && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 space-y-2"
                      >
                        <Label htmlFor="home-loan-amount" className="text-sm block">
                          Monthly Home Loan Installment Amount ($)
                        </Label>
                        <Input
                          id="home-loan-amount"
                          type="number"
                          value={homeLoanAmount || ''}
                          onChange={(e) => handleNumericInput(e.target.value, setHomeLoanAmount)}
                          className="input-glass"
                          min="0"
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="increased-balance"
                        checked={increasedBalance}
                        onCheckedChange={setIncreasedBalance}
                      />
                      <Label htmlFor="increased-balance" className="font-medium">
                        [OCBC-Specific] Increased Account Balance
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="grew-wealth"
                        checked={grewWealth}
                        onCheckedChange={setGrewWealth}
                      />
                      <Label htmlFor="grew-wealth" className="font-medium">
                        [OCBC-Specific] Grew Wealth
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has-transaction-code"
                        checked={hasTransactionCode}
                        onCheckedChange={(checked) => {
                          setHasTransactionCode(checked);
                          if (!checked) setTransactionCode('');
                        }}
                      />
                      <Label htmlFor="has-transaction-code" className="font-medium">
                        Have Transaction Code
                      </Label>
                    </div>
                    
                    {hasTransactionCode && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-6 space-y-2"
                      >
                        <Input
                          id="transaction-code"
                          type="text"
                          value={transactionCode}
                          onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                          placeholder="Enter transaction code"
                          className="input-glass"
                        />
                        {transactionCode === 'SALA' && (
                          <p className="text-xs text-green-600">✓ Valid transaction code for salary credit</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Card>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isCalculating ? 'Calculating...' : 'Calculate interest for a single bank'}
          </button>
          <button
            type="button"
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {isOptimizing ? 'Optimizing...' : 'Find best strategy across multiple banks'}
          </button>
        </div>
      </div>

      {/* Right Column - Results */}
      <div className="space-y-4">
        {results.length > 0 && (
          <ComparisonTable 
            results={results}
            formatNumber={formatNumberLocal}
          />
        )}
      </div>
    </div>
  );
};

export default Calculator;