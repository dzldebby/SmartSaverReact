import { Bank } from './types';

export const scBonusSaver: Bank = {
  id: 'sc-bonussaver',
  name: 'SC BonusSaver',
  logo: '/placeholder.svg',
  color: '#6F2C91',
  baseRate: 0.0005, // 0.05%
  maxRate: 0.0355, // 3.55%
  savingsRate: 0.0355, // 3.55%
  features: [
    'Up to 2.00% p.a. interest on your savings',
    'Regular salary credit at least $3000',
    'Card spend at least $1000',
    'Insurance purchase and investment bonuses'
  ],
  requirements: {
    salary: true,
    spending: true,
    investment: true,
    insurance: true
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
      interestRate: 0.01,
      minSalary: 3000,
      salaryCredit: true,
      capAmount: 100000,
      remarks: 'Regular salary credit at least $3000'
    },
    {
      tierType: 'spend',
      balanceTier: '1',
      interestRate: 0.01,
      minSpend: 1000,
      capAmount: 100000,
      remarks: 'Card spend at least $1000'
    },
    {
      tierType: 'invest',
      balanceTier: '1',
      interestRate: 0.02,
      capAmount: 100000,
      remarks: 'Unit Trust Investment (6 months)'
    },
    {
      tierType: 'insure',
      balanceTier: '1',
      interestRate: 0.02,
      capAmount: 100000,
      remarks: 'Insurance purchase (6 months)'
    },
    {
      tierType: 'bill',
      balanceTier: '1',
      interestRate: 0.0023,
      giroCount: 3,
      capAmount: 100000,
      remarks: '3 bill payments'
    }
  ]
}; 