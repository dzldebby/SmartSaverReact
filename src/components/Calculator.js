"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, BadgePercent, PiggyBank, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, Checkbox, Label, Input, Slider, Button } from './ui';
import { calculateInterest } from '../lib/calculations';
import StepProgress from './StepProgress';

const Calculator = ({
  depositAmount,
  setDepositAmount,
  hasSalary,
  setHasSalary,
  salaryAmount,
  setSalaryAmount,
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
  formatNumber
}) => {
  const [isBasicRequirementsOpen, setIsBasicRequirementsOpen] = useState(true);
  const [isAdvancedRequirementsOpen, setIsAdvancedRequirementsOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

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

  // The handleSubmit function is not being used and contains undefined variables
  // Removing it to fix the errors
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Step 1: Enter Savings Amount */}
      <motion.div variants={itemVariants} className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-primary" />
          Step 1: Enter Your Savings Amount
        </h2>
        <div className="glass-panel p-6 space-y-4">
          <div>
            <Label htmlFor="deposit-amount" className="text-sm font-medium mb-2 block">
              Amount to calculate interest for ($)
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  id="deposit-amount"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="input-glass"
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
      </motion.div>

      {/* Step 2: Banking Details */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <PiggyBank className="mr-2 h-5 w-5 text-primary" />
          Step 2: Enter Your Banking Details
        </h2>
        
        {/* Basic Requirements - Collapsible */}
        <Card className="glass-card overflow-hidden">
          <button 
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
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(Number(e.target.value))}
                      className="input-glass"
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
                    value={cardSpend}
                    onChange={(e) => setCardSpend(Number(e.target.value))}
                    className="input-glass"
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
                    onChange={(e) => setGiroCount(Number(e.target.value))}
                    min="0"
                    max="10"
                    className="input-glass"
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
        <Card className="glass-card overflow-hidden">
          <button 
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
                    onCheckedChange={(checked) => {
                      console.log("Insurance checkbox changed to:", checked);
                      setHasInsurance(checked);
                    }}
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
                      value={insuranceAmount}
                      onChange={(e) => setInsuranceAmount(Number(e.target.value))}
                      className="input-glass"
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
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="input-glass"
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
                      value={homeLoanAmount}
                      onChange={(e) => setHomeLoanAmount(Number(e.target.value))}
                      className="input-glass"
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
            </div>
          </motion.div>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button 
          onClick={() => {
            console.log("Calculate button clicked");
            console.log("Current state before calculation:", {
              depositAmount,
              hasSalary,
              salaryAmount,
              cardSpend,
              giroCount,
              hasInsurance,
              insuranceAmount,
              hasInvestments,
              investmentAmount,
              hasHomeLoan,
              homeLoanAmount,
              increasedBalance,
              grewWealth
            });
            setIsCalculating(true);
            // Add a small delay to allow the UI to update
            setTimeout(() => {
              calculateResults();
              setIsCalculating(false);
            }, 100);
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-6 font-medium text-lg shadow-lg"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate Interest Rates"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Calculator;