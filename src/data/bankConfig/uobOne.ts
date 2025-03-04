import { Bank } from './types';

export const uobOne: Bank = {
  id: 'uob-one',
  name: 'UOB One',
  logo: '/placeholder.svg',
  color: '#0F52A0',
  baseRate: 0.0005, // 0.05%
  maxRate: 0.06,    // 6.0%
  savingsRate: 0.06, // 6.0%
  features: [
    'Up to 6.00% p.a. interest on your savings',
    'Bonus interest with salary crediting',
    'Card spend bonus with minimum $500 spend',
    'GIRO payment bonus available'
  ],
  requirements: {
    salary: true,
    spending: true,
    investment: false,
    insurance: false,
    giro: true
  },
  tiers: [
    {
      tierType: 'base',
      balanceTier: 'First $100K',
      interestRate: 0.0005,
      capAmount: 100000,
      remarks: 'Base interest of 0.05%'
    },
    {
      tierType: 'spend_only',
      balanceTier: '1',
      interestRate: 0.0065,
      minSpend: 500,
      capAmount: 75000,
      remarks: 'First $75k with card spend only'
    },
    {
      tierType: 'salary',
      balanceTier: 'First $75K',
      interestRate: 0.03,
      minSpend: 500,
      salaryCredit: true,
      capAmount: 75000,
      remarks: 'First $75k with salary+ spend'
    },
    {
      tierType: 'salary',
      balanceTier: 'Next $50K',
      interestRate: 0.045,
      minSpend: 500,
      salaryCredit: true,
      capAmount: 50000,
      remarks: 'Next $50k with salary+ spend'
    },
    {
      tierType: 'salary',
      balanceTier: 'Next $25K',
      interestRate: 0.06,
      minSpend: 500,
      salaryCredit: true,
      capAmount: 25000,
      remarks: 'Next $25k with salary+ spend'
    },
    {
      tierType: 'giro',
      balanceTier: 'First $75K',
      interestRate: 0.02,
      minSpend: 500,
      giroCount: 3,
      capAmount: 75000,
      remarks: 'First $75k with spend + 3 GIRO'
    },
    {
      tierType: 'giro',
      balanceTier: 'Next $50K',
      interestRate: 0.03,
      minSpend: 500,
      giroCount: 3,
      capAmount: 50000,
      remarks: 'Next $50k with spend + 3 GIRO'
    }
  ]
}; 