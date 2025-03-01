import { Bank } from '@/types';

export const banks = [
  {
    id: 'dbs-multiplier',
    name: 'DBS Multiplier',
    logo: '/placeholder.svg',
    color: '#E31837',
    baseRate: 0.005, // 0.5%
    maxRate: 0.04,   // 4.0%
    savingsRate: 0.04, // 4.0%
    mortgageRate: 6.75,
    personalLoanRate: 11.99,
    carLoanRate: 5.49,
    creditCardRate: 19.24,
    features: [
      'Up to 4.0% interest on savings',
      'No minimum balance fee',
      'Free digital transfers'
    ],
    requirements: {
      salary: true,
      spending: true,
      investment: true,
      insurance: true,
      loan: true
    },
    tiers: [
      { 
        threshold: 2000, 
        rates: [0.02, 0.025, 0.03] // 1, 2, 3+ categories
      },
      { 
        threshold: 5000, 
        rates: [0.025, 0.03, 0.035] 
      },
      { 
        threshold: 15000, 
        rates: [0.03, 0.035, 0.04] 
      },
      { 
        threshold: 30000, 
        rates: [0.035, 0.04, 0.045] 
      }
    ]
  },
  {
    id: 'ocbc-360',
    name: 'OCBC 360',
    logo: '/placeholder.svg',
    color: '#D71E28',
    baseRate: 0.0065, // 0.65%
    maxRate: 0.045,   // 4.5%
    savingsRate: 0.045, // 4.5%
    mortgageRate: 6.85,
    personalLoanRate: 10.99,
    carLoanRate: 5.59,
    creditCardRate: 18.99,
    features: [
      'Up to 4.5% interest on savings',
      'Bonus interest with salary crediting',
      'Integrated investment options'
    ],
    requirements: {
      salary: true,
      spending: true,
      investment: true,
      insurance: false,
      giro: true
    },
    bonuses: [
      { type: 'salary', amount: 1800, bonus: 0.01 }, // 1%
      { type: 'spend', amount: 500, bonus: 0.01 },   // 1%
      { type: 'giro', count: 3, bonus: 0.01 },       // 1%
      { type: 'invest', amount: 200, bonus: 0.01 }   // 1%
    ]
  },
  {
    id: 'uob-one',
    name: 'UOB One',
    logo: '/placeholder.svg',
    color: '#0F52A0',
    baseRate: 0.005, // 0.5%
    maxRate: 0.038,  // 3.8%
    savingsRate: 0.038, // 3.8%
    mortgageRate: 6.65,
    personalLoanRate: 11.79,
    carLoanRate: 5.24,
    creditCardRate: 19.99,
    features: [
      'Up to 3.8% interest on savings',
      'Rebates on credit card spending',
      'No minimum balance requirement'
    ],
    requirements: {
      salary: false,
      spending: true,
      investment: false,
      insurance: false
    },
    tiers: [
      { spend: 500, rate: 0.02 },   // 2%
      { spend: 1000, rate: 0.03 },  // 3%
      { spend: 2000, rate: 0.038 }  // 3.8%
    ]
  },
  {
    id: 'sc-bonussaver',
    name: 'SC BonusSaver',
    logo: '/placeholder.svg',
    color: '#6F2C91',
    baseRate: 0.008, // 0.8%
    maxRate: 0.0355, // 3.55%
    savingsRate: 0.0355, // 3.55%
    mortgageRate: 6.88,
    personalLoanRate: 11.49,
    carLoanRate: 5.75,
    creditCardRate: 18.49,
    features: [
      'Up to 3.55% interest on savings',
      'Multiple bonus interest categories',
      'Integrated with SC credit cards'
    ],
    requirements: {
      salary: true,
      spending: true,
      investment: true,
      insurance: true
    },
    bonuses: [
      { type: 'salary', amount: 3000, bonus: 0.0075 }, // 0.75%
      { type: 'spend', amount: 2000, bonus: 0.01 },    // 1%
      { type: 'spend', amount: 500, bonus: 0.005 },    // 0.5%
      { type: 'invest', amount: 100, bonus: 0.008 },   // 0.8%
      { type: 'insurance', amount: 100, bonus: 0.008 } // 0.8%
    ]
  },
  {
    id: 'cimb-fastsaver',
    name: 'CIMB FastSaver',
    logo: '/placeholder.svg',
    color: '#FF6000',
    baseRate: 0.005, // 0.5%
    maxRate: 0.02,   // 2.0%
    savingsRate: 0.02, // 2.0%
    mortgageRate: 6.63,
    personalLoanRate: 9.99,
    carLoanRate: 5.19,
    creditCardRate: 17.49,
    features: [
      'Up to 2.0% interest on savings',
      'No fall-below fees',
      'Free online transfers'
    ],
    requirements: {
      salary: false,
      spending: true,
      investment: false,
      insurance: false
    },
    tiers: [
      { amount: 50000, rate: 0.015 },  // 1.5% for first $50,000
      { amount: 75000, rate: 0.02 },   // 2.0% for next $75,000
      { amount: Infinity, rate: 0.01 } // 1.0% for remaining
    ]
  },
  {
    id: 'maybank-saveup',
    name: 'Maybank SaveUp',
    logo: '/placeholder.svg',
    color: '#1170CE',
    baseRate: 0.0025, // 0.25%
    maxRate: 0.03,    // 3.0%
    savingsRate: 0.03, // 3.0%
    mortgageRate: 6.45,
    personalLoanRate: 9.49,
    carLoanRate: 4.85,
    creditCardRate: 17.99,
    features: [
      'Up to 3.0% interest on savings',
      'Multiple product categories for bonus',
      'Low initial deposit requirement'
    ],
    requirements: {
      salary: true,
      spending: true,
      investment: true,
      insurance: true,
      loan: true
    },
    bonuses: [
      { type: 'salary', amount: 2000, bonus: 0.0075 }, // 0.75%
      { type: 'spend', amount: 500, bonus: 0.0075 },   // 0.75%
      { type: 'invest', amount: 200, bonus: 0.0075 },  // 0.75%
      { type: 'insurance', amount: 200, bonus: 0.0075 }, // 0.75%
      { type: 'loan', amount: 500, bonus: 0.0075 }     // 0.75%
    ]
  },
  {
    id: 'hsbc-everyday',
    name: 'HSBC Everyday Global',
    baseRate: 0.001, // 0.1%
    maxRate: 0.025,  // 2.5%
    requirements: {
      salary: true,
      spending: true,
      investment: false,
      insurance: false
    },
    bonuses: [
      { type: 'salary', amount: 2000, bonus: 0.01 },  // 1.0%
      { type: 'spend', amount: 500, bonus: 0.015 }    // 1.5%
    ]
  }
];

export const getBankRate = (bankId, loanType) => {
  const bank = banks.find(b => b.id === bankId);
  if (!bank) return 0;

  switch (loanType) {
    case 'mortgage':
      return bank.mortgageRate;
    case 'personal':
      return bank.personalLoanRate;
    case 'car':
      return bank.carLoanRate;
    case 'credit':
      return bank.creditCardRate;
    case 'savings':
      return bank.savingsRate;
    default:
      return 0;
  }
};

export const getLoanTypeName = (loanType) => {
  switch (loanType) {
    case 'mortgage':
      return 'Mortgage Loan';
    case 'personal':
      return 'Personal Loan';
    case 'car':
      return 'Auto Loan';
    case 'credit':
      return 'Credit Card';
    case 'savings':
      return 'Savings Account';
    default:
      return 'Loan';
  }
};