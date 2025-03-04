import { Bank } from './types';

export const ocbc360: Bank = {
  id: 'ocbc-360',
  name: 'OCBC 360',
  logo: '/placeholder.svg',
  color: '#D71E28',
  baseRate: 0.0005, // 0.05%
  maxRate: 0.04,   // 4.0%
  savingsRate: 0.04, // 4.0%
  features: [
    'Up to 4.00% p.a. interest on your savings',
    'Bonus interest with salary crediting of $1800',
    'Card spend bonus with minimum $500 spend',
    'Insurance and investment bonuses available'
  ],
  requirements: {
    salary: true,
    spending: true,
    investment: true,
    insurance: true,
    increasedBalance: true,
    grewWealth: true
  },
  tiers: [
    {
      tierType: 'base',
      balanceTier: '1',
      interestRate: 0.0005,
      capAmount: 100000,
      remarks: 'Base interest with no requirements'
    },
    {
      tierType: 'salary',
      balanceTier: '1',
      interestRate: 0.02,
      minSalary: 1800,
      salaryCredit: true,
      capAmount: 75000,
      remarks: 'First $75k with salary at least $1800'
    },
    {
      tierType: 'salary',
      balanceTier: '2',
      interestRate: 0.04,
      minSalary: 1800,
      salaryCredit: true,
      capAmount: 25000,
      remarks: 'Next $25k with salary at least $1800'
    },
    {
      tierType: 'save',
      balanceTier: '1',
      interestRate: 0.012,
      capAmount: 75000,
      remarks: 'First $75k with increased balance'
    },
    {
      tierType: 'save',
      balanceTier: '2',
      interestRate: 0.024,
      capAmount: 25000,
      remarks: 'Next $25k with increased balance'
    },
    {
      tierType: 'spend',
      balanceTier: '1',
      interestRate: 0.006,
      minSpend: 500,
      capAmount: 75000,
      remarks: 'First $75k with card spend at least $500'
    },
    {
      tierType: 'spend',
      balanceTier: '2',
      interestRate: 0.006,
      minSpend: 500,
      capAmount: 25000,
      remarks: 'Next $25k with card spend at least $500'
    },
    {
      tierType: 'insure',
      balanceTier: '1',
      interestRate: 0.012,
      capAmount: 75000,
      remarks: 'First $75k with insurance'
    },
    {
      tierType: 'insure',
      balanceTier: '2',
      interestRate: 0.024,
      capAmount: 25000,
      remarks: 'Next $25k with insurance'
    },
    {
      tierType: 'invest',
      balanceTier: '1',
      interestRate: 0.012,
      capAmount: 75000,
      remarks: 'First $75k with investment'
    },
    {
      tierType: 'invest',
      balanceTier: '2',
      interestRate: 0.024,
      capAmount: 25000,
      remarks: 'Next $25k with investment'
    },
    {
      tierType: 'grow',
      balanceTier: '1',
      interestRate: 0.024,
      capAmount: 75000,
      remarks: 'First $75k with grow balance'
    },
    {
      tierType: 'grow',
      balanceTier: '2',
      interestRate: 0.024,
      capAmount: 25000,
      remarks: 'Next $25k with grow balance'
    }
  ]
}; 