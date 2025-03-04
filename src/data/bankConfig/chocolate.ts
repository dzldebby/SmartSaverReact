import { Bank } from './types';

export const chocolate: Bank = {
  id: 'chocolate',
  name: 'Chocolate',
  logo: '/placeholder.svg',
  color: '#8B4513',
  baseRate: 0.033, // 3.3%
  maxRate: 0.033,  // 3.3%
  savingsRate: 0.033, // 3.3%
  features: [
    'Up to 3.3% p.a. interest on your savings',
    'No requirements for bonus interest',
    'First $20,000 at 3.3%',
    'Next $30,000 at 3.0%',
    'No interest earned beyond $50,000'
  ],
  requirements: {
    salary: false,
    spending: false,
    investment: false,
    insurance: false
  },
  tiers: [
    {
      tierType: 'base',
      balanceTier: '1',
      interestRate: 0.033,
      capAmount: 20000,
      remarks: 'First $20k - no requirements'
    },
    {
      tierType: 'base',
      balanceTier: '2',
      interestRate: 0.03,
      capAmount: 30000,
      remarks: 'Next $30k - no requirements'
    },
    {
      tierType: 'base',
      balanceTier: '3',
      interestRate: 0.0,
      capAmount: 999999999,
      remarks: 'Beyond $50k - no interest'
    }
  ]
}; 