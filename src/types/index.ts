export interface Bank {
  id: string;
  name: string;
  logo?: string;
  color: string;
  savingsRate: number;
  mortgageRate: number;
  personalLoanRate: number;
  carLoanRate: number;
  creditCardRate: number;
  features: string[];
  baseRate?: number;
  maxRate?: number;
  requirements?: {
    salary?: boolean;
    spending?: boolean;
    investment?: boolean;
    insurance?: boolean;
    loan?: boolean;
    giro?: boolean;
  };
  tiers?: any[];
  bonuses?: any[];
}

export interface CalculationResult {
  bankId: string;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export type LoanType = 'mortgage' | 'personal' | 'car' | 'credit' | 'savings';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
} 