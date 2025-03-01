"use client";
import { useState } from 'react';
import { calculateInterest } from '@/lib/calculations';
import StepProgress from './StepProgress';

export default function Calculator() {
  // Basic state
  const [depositAmount, setDepositAmount] = useState(10000);
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Salary requirements
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(3500);
  const [salaryBank, setSalaryBank] = useState('');
  
  // Spending requirements
  const [hasSpending, setHasSpending] = useState(false);
  const [spendingAmount, setSpendingAmount] = useState(500);
  
  // Additional requirements
  const [hasInvestments, setHasInvestments] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [hasLoans, setHasLoans] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [hasGiro, setHasGiro] = useState(false);
  const [giroCount, setGiroCount] = useState(0);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Collect form data
    const requirements = {
      hasSalary,
      salaryAmount: hasSalary ? salaryAmount : 0,
      salaryBank: hasSalary ? salaryBank : '',
      hasSpending,
      spendingAmount: hasSpending ? spendingAmount : 0,
      hasInvestments,
      investmentAmount: hasInvestments ? investmentAmount : 0,
      hasInsurance,
      insuranceAmount: hasInsurance ? insuranceAmount : 0,
      hasLoans,
      loanAmount: hasLoans ? loanAmount : 0,
      hasGiro,
      giroCount: hasGiro ? giroCount : 0,
    };
    
    // Add a small delay to show loading state
    setTimeout(() => {
    // Calculate interest
    const calculationResults = calculateInterest(depositAmount, requirements);
    setResults(calculationResults);
    setCurrentStep(2);
      setIsCalculating(false);
    }, 800);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Bank Interest Calculator</h1>
        <p className="opacity-90">Find the best savings account for your money in Singapore</p>
      </div>
      
        <StepProgress currentStep={currentStep} />
      
      {currentStep === 1 && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Deposit Amount Field */}
          <div className="p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-8 h-8 mr-3 text-sm font-bold">1</span>
              Enter Your Deposit Amount
            </h3>
            <div>
              <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Deposit Amount
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="depositAmount"
                  id="depositAmount"
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 text-lg py-3"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  min="0"
                  step="1000"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the amount you plan to deposit in your savings account.
              </p>
            </div>
          </div>
          
          {/* Bank Requirements Section */}
          <div className="p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-8 h-8 mr-3 text-sm font-bold">2</span>
              Enter Your Banking Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Salary Credit Field */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="hasSalary"
                        name="hasSalary"
                        type="checkbox"
                        checked={hasSalary}
                        onChange={(e) => setHasSalary(e.target.checked)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="hasSalary" className="font-medium text-gray-700 text-base">Credit Salary</label>
                      <p className="text-gray-500 text-sm">Do you credit your salary to a bank account?</p>
                    </div>
                  </div>
                  
                  {hasSalary && (
                    <div className="mt-4 pl-8 space-y-4 border-l-2 border-blue-100 ml-1">
                      <div>
                        <label htmlFor="salaryAmount" className="block text-sm font-medium text-gray-700">
                          Monthly Salary Amount
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="salaryAmount"
                            id="salaryAmount"
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0.00"
                            value={salaryAmount}
                            onChange={(e) => setSalaryAmount(Number(e.target.value))}
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="salaryBank" className="block text-sm font-medium text-gray-700">
                          Which bank do you credit your salary to?
                        </label>
                        <select
                          id="salaryBank"
                          name="salaryBank"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={salaryBank}
                          onChange={(e) => setSalaryBank(e.target.value)}
                        >
                          <option value="">Select a bank</option>
                          <option value="dbs-multiplier">DBS/POSB</option>
                          <option value="ocbc-360">OCBC</option>
                          <option value="uob-one">UOB</option>
                          <option value="sc-bonussaver">Standard Chartered</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Card Spending Field */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="hasSpending"
                        name="hasSpending"
                        type="checkbox"
                        checked={hasSpending}
                        onChange={(e) => setHasSpending(e.target.checked)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="hasSpending" className="font-medium text-gray-700 text-base">Card Spending</label>
                      <p className="text-gray-500 text-sm">Do you spend using credit/debit cards?</p>
                    </div>
                  </div>
                  
                  {hasSpending && (
                    <div className="mt-4 pl-8 border-l-2 border-blue-100 ml-1">
                      <label htmlFor="spendingAmount" className="block text-sm font-medium text-gray-700">
                        Monthly Spending Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="spendingAmount"
                          id="spendingAmount"
                          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                          value={spendingAmount}
                          onChange={(e) => setSpendingAmount(Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                {/* Investments Field */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="hasInvestments"
                        name="hasInvestments"
                        type="checkbox"
                        checked={hasInvestments}
                        onChange={(e) => setHasInvestments(e.target.checked)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="hasInvestments" className="font-medium text-gray-700 text-base">Investments</label>
                      <p className="text-gray-500 text-sm">Do you have any investments with your bank?</p>
                    </div>
                  </div>
                  
                  {hasInvestments && (
                    <div className="mt-4 pl-8 border-l-2 border-blue-100 ml-1">
                      <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700">
                        Monthly Investment Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="investmentAmount"
                          id="investmentAmount"
                          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* GIRO Field */}
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="hasGiro"
                        name="hasGiro"
                        type="checkbox"
                        checked={hasGiro}
                        onChange={(e) => setHasGiro(e.target.checked)}
                        className="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="hasGiro" className="font-medium text-gray-700 text-base">GIRO Payments</label>
                      <p className="text-gray-500 text-sm">Do you have any GIRO arrangements with your bank?</p>
                    </div>
                  </div>
                  
                  {hasGiro && (
                    <div className="mt-4 pl-8 border-l-2 border-blue-100 ml-1">
                      <label htmlFor="giroCount" className="block text-sm font-medium text-gray-700">
                        Number of GIRO Arrangements
                      </label>
                      <input
                        type="number"
                        name="giroCount"
                        id="giroCount"
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        value={giroCount}
                        onChange={(e) => setGiroCount(Number(e.target.value))}
                        min="0"
                        max="10"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
        <button
          type="submit"
            disabled={isCalculating}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-md shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ease-in-out"
          >
            {isCalculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </>
            ) : (
              'Calculate Interest'
            )}
        </button>
      </form>
      )}
      
      {currentStep === 2 && results && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Results</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to calculator
            </button>
          </div>
          
          <div className="space-y-6">
            {results.map((result, index) => (
              <div 
                key={result.bankId} 
                className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${index === 0 ? 'bg-gradient-to-r from-blue-50 to-white border-blue-200 ring-1 ring-blue-200' : 'bg-white'}`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Best Rate
                    </span>
                  </div>
                )}
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{result.bankName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Interest Rate: <span className="font-medium text-blue-600">{(result.interestRate * 100).toFixed(2)}%</span>
                    </p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-3xl font-bold text-blue-600">
                      ${result.annualInterest.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">per year</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ${result.monthlyInterest.toFixed(2)} monthly
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {result.breakdown && result.breakdown.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Interest Breakdown:</p>
                      <div className="bg-gray-50 rounded-md p-3">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.breakdown.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div>
                                <span className="font-medium">{item.description}</span>: 
                                ${item.amountInTier.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
                                at {(item.tierRate * 100).toFixed(2)}% = 
                                ${item.tierInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per year
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">How this was calculated:</p>
                    <p className="whitespace-pre-line bg-gray-50 rounded-md p-3">{result.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}