"use client";
import { useState, useMemo } from 'react';
import { CalculationResult, LoanType } from '@/types';
import { banks, getBankRate } from '@/data/banks';

const useCalculator = () => {
  const [amount, setAmount] = useState<number>(200000);
  const [term, setTerm] = useState<number>(30);
  const [loanType, setLoanType] = useState<LoanType>('mortgage');
  const [selectedBanks, setSelectedBanks] = useState<string[]>(['dbs-multiplier', 'ocbc-360', 'uob-one']);

  const calculateMonthlyPayment = (principal: number, annualRate: number, termYears: number): number => {
    // For savings accounts, we calculate interest earned instead
    if (loanType === 'savings') {
      return (principal * (annualRate / 100)) / 12;
    }
    
    const monthlyRate = annualRate / 100 / 12;
    const totalPayments = termYears * 12;
    
    // Simple interest for credit cards
    if (loanType === 'credit') {
      return principal * (monthlyRate) + (principal / totalPayments);
    }
    
    // Compound interest formula for other loans
    if (monthlyRate === 0) return principal / totalPayments;
    
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    );
  };

  const generateAmortizationSchedule = (
    principal: number,
    annualRate: number,
    termYears: number,
    monthlyPayment: number
  ) => {
    const schedule = [];
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    
    for (let month = 1; month <= termYears * 12; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      if (balance < 0) balance = 0;
      
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });
      
      // Break early if balance is paid
      if (balance <= 0) break;
    }
    
    return schedule;
  };

  const calculateResults = useMemo(() => {
    return selectedBanks.map(bankId => {
      const rate = getBankRate(bankId, loanType);
      const monthlyPayment = calculateMonthlyPayment(amount, rate, term);
      
      let amortizationSchedule: any[] = [];
      let totalInterest = 0;
      
      if (loanType === 'savings') {
        // For savings, simple calculation
        amortizationSchedule = Array.from({ length: term * 12 }, (_, month) => {
          return {
            month: month + 1,
            payment: 0,
            principal: 0,
            interest: monthlyPayment,
            balance: amount + (monthlyPayment * (month + 1))
          };
        });
        totalInterest = monthlyPayment * term * 12;
      } else {
        // For loans
        amortizationSchedule = generateAmortizationSchedule(amount, rate, term, monthlyPayment);
        totalInterest = amortizationSchedule.reduce((sum, { interest }) => sum + interest, 0);
      }
      
      const totalPayment = loanType === 'savings' 
        ? amount + totalInterest
        : amount + totalInterest;
      
      return {
        bankId,
        monthlyPayment,
        totalInterest,
        totalPayment,
        amortizationSchedule,
      } as CalculationResult;
    });
  }, [amount, term, loanType, selectedBanks]);

  return {
    amount,
    setAmount,
    term,
    setTerm,
    loanType,
    setLoanType,
    selectedBanks,
    setSelectedBanks,
    results: calculateResults,
    banks,
  };
};

export default useCalculator; 