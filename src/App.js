"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ComparisonTable from './components/ComparisonTable';
import Calculator from './components/Calculator';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui';
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';
import Layout from './components/Layout';
import { calculateInterest } from './lib/calculations';
import { banks } from './data/banks';
import './App.css';

function App() {
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [calculationResults, setCalculationResults] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
  
  // Add new state variables for collapsible sections
  const [isBasicRequirementsOpen, setIsBasicRequirementsOpen] = useState(true);
  const [isAdvancedRequirementsOpen, setIsAdvancedRequirementsOpen] = useState(false);
  
  const getBankById = (bankId) => {
    const bank = banks.find(bank => bank.id === bankId);
    if (!bank) {
      console.warn(`Bank with ID ${bankId} not found`);
      return null;
    }
    return bank;
  };
  
  // Format number with commas
  const formatNumber = (n) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };
  
  // Calculate results for all banks
  const calculateResults = () => {
    console.log("calculateResults function called");
    console.log("Current state:", { 
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
    
    // Log the imported banks array
    console.log("Imported banks array:", banks);
    console.log("Number of banks in imported array:", banks.length);
    console.log("Bank IDs in imported array:", banks.map(bank => bank.id));
    
    const requirements = {
      hasSalary,
      salaryAmount,
      spendAmount: cardSpend,
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
    
    console.log("Requirements object:", requirements);
    
    // Use the imported calculateInterest function
    try {
      console.log("Calling calculateInterest with:", depositAmount, requirements);
      const results = calculateInterest(depositAmount, requirements);
      console.log("Results from calculateInterest:", results);
      console.log("All bank IDs from results:", results.map(r => r.bankId));
      
      // Convert the results to the format expected by the app
      const formattedResults = {};
      
      results.forEach(result => {
        console.log(`Processing result for ${result.bankId}:`, result);
        console.log(`Breakdown for ${result.bankId}:`, result.breakdown);
        
        formattedResults[result.bankId] = {
          bankId: result.bankId,
          monthlyInterest: result.monthlyInterest,
          annualInterest: result.annualInterest,
          interestRate: result.interestRate,
          breakdown: result.breakdown || []
      };
    });
    
      console.log("Formatted results:", formattedResults);
      console.log("Formatted results bank IDs:", Object.keys(formattedResults));
      setCalculationResults(formattedResults);
    setHasCalculated(true);
      
      // MODIFIED: Select all banks for data processing
      const allBankIds = results.map(result => result.bankId);
      console.log("Selecting all banks:", allBankIds);
      setSelectedBanks(allBankIds);
    
    // Collapse both sections after calculation
    setIsBasicRequirementsOpen(false);
    setIsAdvancedRequirementsOpen(false);
    } catch (error) {
      console.error("Error in calculateResults:", error);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-4">
        {/* Side-by-side layout for calculator and comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <Card className="glass-card h-full">
              <CardHeader className="bg-gray-100 py-2 px-3">
                <CardTitle className="text-left text-black">Savings Calculator</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[80vh] px-3">
                <Calculator 
                  depositAmount={depositAmount}
                  setDepositAmount={setDepositAmount}
                  hasSalary={hasSalary}
                  setHasSalary={setHasSalary}
                  salaryAmount={salaryAmount}
                  setSalaryAmount={setSalaryAmount}
                  cardSpend={cardSpend}
                  setCardSpend={setCardSpend}
                  giroCount={giroCount}
                  setGiroCount={setGiroCount}
                  hasInsurance={hasInsurance}
                  setHasInsurance={setHasInsurance}
                  insuranceAmount={insuranceAmount}
                  setInsuranceAmount={setInsuranceAmount}
                  hasInvestments={hasInvestments}
                  setHasInvestments={setHasInvestments}
                  investmentAmount={investmentAmount}
                  setInvestmentAmount={setInvestmentAmount}
                  hasHomeLoan={hasHomeLoan}
                  setHasHomeLoan={setHasHomeLoan}
                  homeLoanAmount={homeLoanAmount}
                  setHomeLoanAmount={setHomeLoanAmount}
                  increasedBalance={increasedBalance}
                  setIncreasedBalance={setIncreasedBalance}
                  grewWealth={grewWealth}
                  setGrewWealth={setGrewWealth}
                  calculateResults={calculateResults}
                  formatNumber={formatNumber}
                />
              </CardContent>
            </Card>
          </motion.div>

          {hasCalculated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full"
            >
              <div className="h-full overflow-auto max-h-[80vh]">
                {Object.values(calculationResults).length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-md mb-4 flex items-center shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                    <div>
                      <span className="font-bold">Best Option: </span>
                      {(() => {
                        const results = Object.values(calculationResults);
                        const bestBank = results.reduce((prev, current) => 
                          (prev.interestRate > current.interestRate) ? prev : current
                        );
                        const bankInfo = getBankById(bestBank.bankId);
                        return `${bankInfo?.name || bestBank.bankId} offers the highest interest rate at ${(bestBank.interestRate * 100).toFixed(2)}%`;
                      })()}
                    </div>
                  </motion.div>
                )}
                <ComparisonTable 
                  results={Object.values(calculationResults)} 
                  getBankById={getBankById} 
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full"
            >
              <Card className="glass-card h-full flex items-center justify-center">
                <CardContent className="text-center p-4">
                  <h3 className="text-xl font-medium text-gray-500 mb-4">Enter your details and calculate to see bank comparison</h3>
                  <p className="text-muted-foreground">The comparison table will appear here after calculation</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {hasCalculated && (
        <>
          <ChatButton onClick={() => setIsChatOpen(true)} />
          {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} calculationResults={Object.values(calculationResults)} />}
        </>
      )}
    </Layout>
  );
}

export default App; 