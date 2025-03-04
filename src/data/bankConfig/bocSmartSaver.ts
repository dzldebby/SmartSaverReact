import { Bank } from './types';

export const bocSmartSaver: Bank = {
  id: 'boc-smartsaver',
  name: 'BOC SmartSaver',
  logo: '/placeholder.svg',
  color: '#1C2C5B',
  baseRate: 0.0015, // 0.15%
  maxRate: 0.025,   // 2.5%
  savingsRate: 0.025, // 2.5%
  features: [
    'Up to 2.50% p.a. interest on your savings',
    'Salary credit >= $2000',
    'Card spend bonuses at different tiers',
    'Bill payment bonuses available',
    '2.40% Wealth Bonus with insurance products'
  ],
  requirements: {
    salary: true,
    spending: true,
    investment: true,
    insurance: true,
    payment: true
  },
  tiers: [
    {
      tierType: 'base',
      balanceTier: 'Below $5K',
      interestRate: 0.0015,
      capAmount: 5000,
      remarks: 'Base interest for balance below $5K'
    },
    {
      tierType: 'base',
      balanceTier: '$5K to below $20K',
      interestRate: 0.002,
      capAmount: 15000,
      remarks: 'Base interest for $5K to below $20K'
    },
    {
      tierType: 'base',
      balanceTier: '$20K to below $50K',
      interestRate: 0.003,
      capAmount: 30000,
      remarks: 'Base interest for $20K to below $50K'
    },
    {
      tierType: 'base',
      balanceTier: '$50K to below $100K',
      interestRate: 0.003,
      capAmount: 50000,
      remarks: 'Base interest for $50K to below $100K'
    },
    {
      tierType: 'base',
      balanceTier: '$100K and above',
      interestRate: 0.004,
      capAmount: 1000000,
      remarks: 'Base interest for $100K and above'
    },
    {
      tierType: 'wealth',
      balanceTier: '1',
      interestRate: 0.024,
      capAmount: 100000,
      remarks: 'Insurance purchase bonus'
    },
    {
      tierType: 'spend',
      balanceTier: '1',
      interestRate: 0.005,
      minSpend: 500,
      capAmount: 100000,
      remarks: 'Card spend $500-$1499'
    },
    {
      tierType: 'spend',
      balanceTier: '2',
      interestRate: 0.008,
      minSpend: 1500,
      capAmount: 100000,
      remarks: 'Card spend >= $1500'
    },
    {
      tierType: 'salary',
      balanceTier: '1',
      interestRate: 0.025,
      minSalary: 2000,
      salaryCredit: true,
      capAmount: 100000,
      remarks: 'Salary credit >= $2000'
    },
    {
      tierType: 'payment',
      balanceTier: '1',
      interestRate: 0.009,
      giroCount: 3,
      capAmount: 100000,
      remarks: '3 bill payments >= $30 each'
    },
    {
      tierType: 'extra',
      balanceTier: '1',
      interestRate: 0.006,
      capAmount: 999999,
      remarks: 'Extra interest above $100k'
    }
  ]
}; 