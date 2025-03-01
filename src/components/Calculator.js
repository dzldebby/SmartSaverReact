"use client";
import { useState } from 'react';
import { calculateInterest } from '@/lib/calculations';
import StepProgress from './StepProgress';

export default function Calculator() {
  const [depositAmount, setDepositAmount] = useState(10000);
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(3500);
  const [hasSpending, setHasSpending] = useState(false);
  const [spendingAmount, setSpendingAmount] = useState(500);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect form data
    const requirements = {
      hasSalary,
      salaryAmount: hasSalary ? salaryAmount : 0,
      hasSpending,
      spendingAmount: hasSpending ? spendingAmount : 0,
    };
    
    // Calculate interest
    const calculationResults = calculateInterest(depositAmount, requirements);
    setResults(calculationResults);
    setCurrentStep(2);
  };
  
  return (
    <div className="w-full">
      <StepProgress currentStep={currentStep} />
      
      {currentStep === 1 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deposit Amount Field */}
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
                className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500"
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
          
          {/* Salary Credit Field */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="hasSalary"
                  name="hasSalary"
                  type="checkbox"
                  checked={hasSalary}
                  onChange={(e) => setHasSalary(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="hasSalary" className="font-medium text-gray-700">Credit Salary</label>
                <p className="text-gray-500">Do you credit your salary to this bank account?</p>
              </div>
            </div>
            
            {hasSalary && (
              <div className="ml-7">
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
            )}
          </div>
          
          {/* Card Spending Field */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="hasSpending"
                  name="hasSpending"
                  type="checkbox"
                  checked={hasSpending}
                  onChange={(e) => setHasSpending(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="hasSpending" className="font-medium text-gray-700">Card Spending</label>
                <p className="text-gray-500">Do you spend using this bank's credit/debit card?</p>
              </div>
            </div>
            
            {hasSpending && (
              <div className="ml-7">
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
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Interest
          </button>
        </form>
      )}
      
      {currentStep === 2 && results && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Results</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to calculator
            </button>
          </div>
          
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.bankId} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{result.bankName}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${result.annualInterest.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">per year</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Interest Rate:</span> {(result.interestRate * 100).toFixed(2)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Monthly Interest:</span> ${result.monthlyInterest.toFixed(2)}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium">How this was calculated:</p>
                    <p className="whitespace-pre-line">{result.explanation}</p>
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