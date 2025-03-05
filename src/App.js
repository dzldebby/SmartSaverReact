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
import { findOptimalDistribution } from './lib/optimizationEngine';
import { BANKS } from './lib/bankConstants';
import './App.css';

function App() {
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [calculationResults, setCalculationResults] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState({
    status: '',
    progress: 0,
    totalScenarios: 0,
    currentScenario: 0
  });
  
  // User requirements
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(3500);
  const [transactionCode, setTransactionCode] = useState('');
  const [hasTransactionCode, setHasTransactionCode] = useState(false);
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
    const bank = BANKS[bankId];
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
  
  // Add optimization handler
  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationProgress({
      status: 'Starting optimization...',
      progress: 0,
      totalScenarios: 0,
      currentScenario: 0
    });
    
    try {
      const requirements = {
        hasSalary,
        salaryAmount,
        transactionCode,
        spendAmount: cardSpend,
        giroCount,
        hasInsurance,
        insuranceAmount,
        hasInvestments,
        investmentAmount,
        hasHomeLoan,
        homeLoanAmount,
        increasedBalance,
        grewWealth
      };
      
      // Set up progress callback
      const { setProgressCallback } = require('./lib/optimizationEngine');
      setProgressCallback((progress) => {
        setOptimizationProgress(progress);
      });
      
      // Wait for optimization to complete
      const results = await findOptimalDistribution(depositAmount, requirements);
      
      // Store all results for global maximum calculation
      setOptimizationResults(results);
      setCalculationResults({}); // Clear calculation results
      setHasCalculated(true); // Keep the right panel visible
    } catch (error) {
      console.error("Error in handleOptimize:", error);
      // Show error to user
      setOptimizationProgress({
        status: 'Error during optimization',
        progress: 0,
        totalScenarios: 0,
        currentScenario: 0
      });
    } finally {
      // Small delay before hiding the loading overlay
      setTimeout(() => {
        setIsOptimizing(false);
        setOptimizationProgress({
          status: '',
          progress: 0,
          totalScenarios: 0,
          currentScenario: 0
        });
      }, 500);
    }
  };
  
  // Modify calculateResults to clear optimization results
  const calculateResults = () => {
    console.log("calculateResults function called");
    console.log("Current state:", { 
      depositAmount, 
      hasSalary,
      transactionCode,
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
    console.log("Imported banks array:", BANKS);
    console.log("Number of banks in imported array:", Object.keys(BANKS).length);
    console.log("Bank IDs in imported array:", Object.keys(BANKS));
    
    const requirements = {
      hasSalary: hasSalary || transactionCode === 'SALA',
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
          depositAmount: depositAmount,
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
      setOptimizationResults([]); // Clear optimization results
      
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
      <div className="space-y-4 p-0 bg-gray-50 min-h-screen">
        {/* Loading Overlay */}
        {isOptimizing && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {optimizationProgress.status}
            </h3>
            <div className="w-80">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${optimizationProgress.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {optimizationProgress.currentScenario} of {optimizationProgress.totalScenarios} scenarios
              </p>
            </div>
          </div>
        )}

        {/* Side-by-side layout for calculator and comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <Card className="glass-card h-full bg-white">
              <CardHeader className="bg-gray-100 py-2 px-3">
                <CardTitle className="text-left text-black">Savings Calculator</CardTitle>
              </CardHeader>
              <CardContent className="md:overflow-auto md:max-h-[80vh] px-3">
                <Calculator 
                  depositAmount={depositAmount}
                  setDepositAmount={setDepositAmount}
                  hasSalary={hasSalary}
                  setHasSalary={setHasSalary}
                  salaryAmount={salaryAmount}
                  setSalaryAmount={setSalaryAmount}
                  transactionCode={transactionCode}
                  setTransactionCode={setTransactionCode}
                  hasTransactionCode={hasTransactionCode}
                  setHasTransactionCode={setHasTransactionCode}
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
                  handleOptimize={handleOptimize}
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
              <Card className="glass-card h-full bg-white">
                <CardHeader className="bg-gray-100 py-2 px-3">
                  <CardTitle className="text-left text-black">Results</CardTitle>
                </CardHeader>
                <CardContent className="md:overflow-auto md:max-h-[80vh] px-3">
                  {optimizationResults.length > 0 ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Optimization Results</h3>
                      
                      {/* Add Global Maximum Interest Rate Display */}
                      <div className="mb-6 p-4 border rounded-lg bg-green-50">
                        <h4 className="font-medium mb-2">Global Maximum Interest</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Annual Interest</p>
                            <p className="text-lg font-semibold">${optimizationResults[0].totalInterest.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Effective Rate</p>
                            <p className="text-lg font-semibold">{(optimizationResults[0].effectiveRate * 100).toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                      
                      {optimizationResults.map((result, index) => (
                        <div key={index} className="mb-6 p-4 border rounded-lg bg-white">
                          <h4 className="font-medium mb-2">Option {index + 1}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Monthly Interest</p>
                              <p className="text-lg font-semibold">${result.monthlyInterest.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Effective Rate</p>
                              <p className="text-lg font-semibold">{(result.effectiveRate * 100).toFixed(2)}%</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Distribution:</p>
                            <div className="space-y-2">
                              {Object.entries(result.distribution).map(([bankId, amount]) => {
                                const bank = getBankById(bankId);
                                const isSalaryBank = bankId === result.salaryBankId;
                                console.log('Rendering bank in distribution:', {
                                  bankId,
                                  bankName: bank?.name,
                                  amount,
                                  isSalaryBank,
                                  resultSalaryBankId: result.salaryBankId,
                                  bankRequiresSalary: bank?.requiresSalary
                                });
                                return (
                                  <div key={bankId} className="flex justify-between text-sm">
                                    <span className="flex items-center">
                                      {bank?.name || bankId}
                                      {isSalaryBank && (
                                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                          Salary Bank
                                        </span>
                                      )}
                                    </span>
                                    <span>${amount.toLocaleString()}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {hasSalary && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Note:</span> Credit your salary to the bank marked as "Salary Bank" to qualify for bonus interest rates.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : Object.values(calculationResults).length > 0 ? (
                    <>
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
                      <ComparisonTable 
                        results={Object.values(calculationResults)} 
                        getBankById={getBankById} 
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-xl font-medium text-gray-500 mb-4">Enter your details and calculate to see bank comparison</h3>
                      <p className="text-muted-foreground">The comparison table will appear here after calculation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full"
            >
              <Card className="glass-card h-full bg-white">
                <CardHeader className="bg-gray-100 py-2 px-3">
                  <CardTitle className="text-left text-black">Results</CardTitle>
                </CardHeader>
                <CardContent className="md:overflow-auto md:max-h-[80vh] px-3">
                  <div className="text-center p-4">
                    <h3 className="text-xl font-medium text-gray-500 mb-4">Enter your details and calculate to see bank comparison</h3>
                    <p className="text-muted-foreground">The comparison table will appear here after calculation</p>
                  </div>
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