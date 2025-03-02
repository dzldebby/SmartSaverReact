import { Bank } from '../types';

// Manually extract features from the interest rates data
// This is a simplified approach since we can't directly import CSV in the browser
// In a real application, you would fetch this data from an API or use a build-time process
const extractFeaturesFromInterestRates = () => {
  // Map of bank names to their features
  const bankFeatures = {
    'UOB One': [
      'Up to 6.00% p.a. interest on your savings',
      'Bonus interest with salary crediting',
      'Card spend bonus with minimum $500 spend',
      'GIRO payment bonus available'
    ],
    'OCBC 360': [
      'Up to 4.00% p.a. interest on your savings',
      'Bonus interest with salary crediting of $1800',
      'Card spend bonus with minimum $500 spend',
      'Insurance and investment bonuses available'
    ],
    'SC BonusSaver': [
      'Up to 2.00% p.a. interest on your savings',
      'Regular salary credit at least $3000',
      'Card spend at least $1000',
      'Insurance purchase and investment bonuses'
    ],
    'DBS Multiplier': [
      'Up to 4.10% p.a. interest on your savings',
      'Bonus interest based on transaction categories',
      'First $50,000 at 1.80% with 1 category',
      'Higher rates with more transaction categories'
    ],
    'BOC SmartSaver': [
      'Up to 2.50% p.a. interest on your savings',
      'Salary credit >= $2000',
      'Card spend bonuses at different tiers',
      'Bill payment bonuses available'
    ],
    'Chocolate': [
      'Up to 3.30% p.a. interest on your savings',
      'No requirements for bonus interest',
      'First $20,000 at 3.30%',
      'Next $30,000 at 3.00%'
    ]
  };
  
  return bankFeatures;
};

// Get features for banks
const bankFeatures = extractFeaturesFromInterestRates();

// Helper function to convert percentage string to decimal
const percentToDecimal = (percentStr) => {
  if (!percentStr || typeof percentStr !== 'string') return 0;
  return parseFloat(percentStr.replace('%', '')) / 100;
};

export const banks = [
  {
    id: 'uob-one',
    name: 'UOB One',
    logo: '/placeholder.svg',
    color: '#0F52A0',
    baseRate: 0.0005, // 0.05%
    maxRate: 0.06,    // 6.0%
    savingsRate: 0.06, // 6.0%
    mortgageRate: 6.65,
    personalLoanRate: 11.79,
    carLoanRate: 5.24,
    creditCardRate: 19.99,
    features: bankFeatures['UOB One'],
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
        interestRate: 0.0005, // 0.05%
        capAmount: 100000,
        remarks: 'Base interest of 0.05%'
      },
      {
        tierType: 'spend_only',
        balanceTier: '1',
        interestRate: 0.0065, // 0.65%
        minSpend: 500,
        capAmount: 75000,
        remarks: 'First $75k with card spend only'
      },
      {
        tierType: 'salary',
        balanceTier: 'First $75K',
        interestRate: 0.03, // 3.00%
        minSpend: 500,
        salaryCredit: true,
        capAmount: 75000,
        remarks: 'First $75k with salary+ spend'
      },
      {
        tierType: 'salary',
        balanceTier: 'Next $50K',
        interestRate: 0.045, // 4.50%
        minSpend: 500,
        salaryCredit: true,
        capAmount: 50000,
        remarks: 'Next $50k with salary+ spend'
      },
      {
        tierType: 'salary',
        balanceTier: 'Next $25K',
        interestRate: 0.06, // 6.00%
        minSpend: 500,
        salaryCredit: true,
        capAmount: 25000,
        remarks: 'Next $25k with salary+ spend'
      },
      {
        tierType: 'giro',
        balanceTier: 'First $75K',
        interestRate: 0.02, // 2.00%
        minSpend: 500,
        giroCount: 3,
        capAmount: 75000,
        remarks: 'First $75k with spend + 3 GIRO'
      },
      {
        tierType: 'giro',
        balanceTier: 'Next $50K',
        interestRate: 0.03, // 3.00%
        minSpend: 500,
        giroCount: 3,
        capAmount: 50000,
        remarks: 'Next $50k with spend + 3 GIRO'
      }
    ]
  },
  {
    id: 'sc-bonussaver',
    name: 'SC BonusSaver',
    logo: '/placeholder.svg',
    color: '#6F2C91',
    baseRate: 0.0005, // 0.05%
    maxRate: 0.0355, // 3.55%
    savingsRate: 0.0355, // 3.55%
    mortgageRate: 6.88,
    personalLoanRate: 11.49,
    carLoanRate: 5.75,
    creditCardRate: 18.49,
    features: bankFeatures['SC BonusSaver'],
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
        interestRate: 0.0005, // 0.05%
        capAmount: 100000,
        remarks: 'Base interest with no requirements'
      },
      {
        tierType: 'salary',
        balanceTier: '1',
        interestRate: 0.01, // 1.00%
        minSalary: 3000,
        salaryCredit: true,
        capAmount: 100000,
        remarks: 'Regular salary credit at least $3000'
      },
      {
        tierType: 'spend',
        balanceTier: '1',
        interestRate: 0.01, // 1.00%
        minSpend: 1000,
        capAmount: 100000,
        remarks: 'Card spend at least $1000'
      },
      {
        tierType: 'invest',
        balanceTier: '1',
        interestRate: 0.02, // 2.00%
        capAmount: 100000,
        remarks: 'Unit Trust Investment (6 months)'
      },
      {
        tierType: 'insure',
        balanceTier: '1',
        interestRate: 0.02, // 2.00%
        capAmount: 100000,
        remarks: 'Insurance purchase (6 months)'
      },
      {
        tierType: 'bill',
        balanceTier: '1',
        interestRate: 0.0023, // 0.23%
        giroCount: 3,
        capAmount: 100000,
        remarks: '3 bill payments'
      }
    ]
  },
  {
    id: 'ocbc-360',
    name: 'OCBC 360',
    logo: '/placeholder.svg',
    color: '#D71E28',
    baseRate: 0.0005, // 0.05%
    maxRate: 0.04,   // 4.0%
    savingsRate: 0.04, // 4.0%
    mortgageRate: 6.85,
    personalLoanRate: 10.99,
    carLoanRate: 5.59,
    creditCardRate: 18.99,
    features: bankFeatures['OCBC 360'],
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
        interestRate: 0.0005, // 0.05%
        capAmount: 100000,
        remarks: 'Base interest with no requirements'
      },
      {
        tierType: 'salary',
        balanceTier: '1',
        interestRate: 0.02, // 2.00%
        minSalary: 1800,
        salaryCredit: true,
        capAmount: 75000,
        remarks: 'First $75k with salary at least $1800'
      },
      {
        tierType: 'salary',
        balanceTier: '2',
        interestRate: 0.04, // 4.00%
        minSalary: 1800,
        salaryCredit: true,
        capAmount: 25000,
        remarks: 'Next $25k with salary at least $1800'
      },
      {
        tierType: 'save',
        balanceTier: '1',
        interestRate: 0.012, // 1.20%
        capAmount: 75000,
        remarks: 'First $75k with increased balance'
      },
      {
        tierType: 'save',
        balanceTier: '2',
        interestRate: 0.024, // 2.40%
        capAmount: 25000,
        remarks: 'Next $25k with increased balance'
      },
      {
        tierType: 'spend',
        balanceTier: '1',
        interestRate: 0.006, // 0.60%
        minSpend: 500,
        capAmount: 75000,
        remarks: 'First $75k with card spend at least $500'
      },
      {
        tierType: 'spend',
        balanceTier: '2',
        interestRate: 0.006, // 0.60%
        minSpend: 500,
        capAmount: 25000,
        remarks: 'Next $25k with card spend at least $500'
      },
      {
        tierType: 'insure',
        balanceTier: '1',
        interestRate: 0.012, // 1.20%
        capAmount: 75000,
        remarks: 'First $75k with insurance'
      },
      {
        tierType: 'insure',
        balanceTier: '2',
        interestRate: 0.024, // 2.40%
        capAmount: 25000,
        remarks: 'Next $25k with insurance'
      },
      {
        tierType: 'invest',
        balanceTier: '1',
        interestRate: 0.012, // 1.20%
        capAmount: 75000,
        remarks: 'First $75k with investment'
      },
      {
        tierType: 'invest',
        balanceTier: '2',
        interestRate: 0.024, // 2.40%
        capAmount: 25000,
        remarks: 'Next $25k with investment'
      },
      {
        tierType: 'grow',
        balanceTier: '1',
        interestRate: 0.024, // 2.40%
        capAmount: 75000,
        remarks: 'First $75k with grow balance'
      },
      {
        tierType: 'grow',
        balanceTier: '2',
        interestRate: 0.024, // 2.40%
        capAmount: 25000,
        remarks: 'Next $25k with grow balance'
      }
    ]
  },
  {
    id: 'boc-smartsaver',
    name: 'BOC SmartSaver',
    logo: '/placeholder.svg',
    color: '#1C2C5B',
    baseRate: 0.0015, // 0.15%
    maxRate: 0.025,   // 2.5%
    savingsRate: 0.025, // 2.5%
    mortgageRate: 6.78,
    personalLoanRate: 10.88,
    carLoanRate: 5.38,
    creditCardRate: 18.88,
    features: bankFeatures['BOC SmartSaver'],
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
        interestRate: 0.0015, // 0.15%
        capAmount: 5000,
        remarks: 'Base interest for balance below $5K'
      },
      {
        tierType: 'base',
        balanceTier: '$5K to below $20K',
        interestRate: 0.002, // 0.20%
        capAmount: 15000,
        remarks: 'Base interest for $5K to below $20K'
      },
      {
        tierType: 'base',
        balanceTier: '$20K to below $50K',
        interestRate: 0.003, // 0.30%
        capAmount: 30000,
        remarks: 'Base interest for $20K to below $50K'
      },
      {
        tierType: 'base',
        balanceTier: '$50K to below $100K',
        interestRate: 0.003, // 0.30%
        capAmount: 50000,
        remarks: 'Base interest for $50K to below $100K'
      },
      {
        tierType: 'base',
        balanceTier: '$100K and above',
        interestRate: 0.004, // 0.40%
        capAmount: 1000000,
        remarks: 'Base interest for $100K and above'
      },
      {
        tierType: 'wealth',
        balanceTier: '1',
        interestRate: 0.024, // 2.40%
        capAmount: 100000,
        remarks: 'Insurance purchase bonus'
      },
      {
        tierType: 'spend',
        balanceTier: '1',
        interestRate: 0.005, // 0.50%
        minSpend: 500,
        capAmount: 100000,
        remarks: 'Card spend $500-$1499'
      },
      {
        tierType: 'spend',
        balanceTier: '2',
        interestRate: 0.008, // 0.80%
        minSpend: 1500,
        capAmount: 100000,
        remarks: 'Card spend >= $1500'
      },
      {
        tierType: 'salary',
        balanceTier: '1',
        interestRate: 0.025, // 2.50%
        minSalary: 2000,
        salaryCredit: true,
        capAmount: 100000,
        remarks: 'Salary credit >= $2000'
      },
      {
        tierType: 'payment',
        balanceTier: '1',
        interestRate: 0.009, // 0.90%
        giroCount: 3,
        capAmount: 100000,
        remarks: '3 bill payments >= $30 each'
      },
      {
        tierType: 'extra',
        balanceTier: '1',
        interestRate: 0.006, // 0.60%
        capAmount: 999999,
        remarks: 'Extra interest above $100k'
      }
    ]
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    logo: '/placeholder.svg',
    color: '#8B4513',
    baseRate: 0.033, // 3.30%
    maxRate: 0.033,  // 3.30%
    savingsRate: 0.033, // 3.30%
    mortgageRate: 6.50,
    personalLoanRate: 10.50,
    carLoanRate: 5.25,
    creditCardRate: 18.00,
    features: bankFeatures['Chocolate'],
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
        interestRate: 0.033, // 3.30%
        capAmount: 20000,
        remarks: 'First $20k - no requirements'
      },
      {
        tierType: 'base',
        balanceTier: '2',
        interestRate: 0.03, // 3.00%
        capAmount: 30000,
        remarks: 'Next $30k - no requirements'
      }
    ]
  },
  {
    id: 'dbs-multiplier',
    name: 'DBS Multiplier',
    logo: '/placeholder.svg',
    color: '#E31837',
    baseRate: 0.0005, // 0.05%
    maxRate: 0.041,   // 4.1%
    savingsRate: 0.041, // 4.1%
    mortgageRate: 6.75,
    personalLoanRate: 11.99,
    carLoanRate: 5.49,
    creditCardRate: 19.24,
    features: bankFeatures['DBS Multiplier'],
    requirements: {
      salary: true,
      spending: true,
      investment: true,
      insurance: true,
      loan: true
    },
    tiers: [
      {
        tierType: 'base',
        balanceTier: '1',
        interestRate: 0.0005, // 0.05%
        capAmount: 999999999,
        remarks: 'Base interest (for amounts not eligible for bonus)'
      },
      {
        tierType: 'cat1_low',
        balanceTier: '1',
        interestRate: 0.018, // 1.80%
        minSpend: 500,
        categoryCount: 1,
        salaryCredit: true,
        capAmount: 50000,
        remarks: '1 category + $500-$15k transactions'
      },
      {
        tierType: 'cat1_mid',
        balanceTier: '1',
        interestRate: 0.019, // 1.90%
        minSpend: 15000,
        categoryCount: 1,
        salaryCredit: true,
        capAmount: 50000,
        remarks: '1 category + $15k-$30k transactions'
      },
      {
        tierType: 'cat1_high',
        balanceTier: '1',
        interestRate: 0.022, // 2.20%
        minSpend: 30000,
        categoryCount: 1,
        salaryCredit: true,
        capAmount: 50000,
        remarks: '1 category + >$30k transactions'
      },
      {
        tierType: 'cat2_low',
        balanceTier: '1',
        interestRate: 0.021, // 2.10%
        minSpend: 500,
        categoryCount: 2,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '2 categories + $500-$15k transactions'
      },
      {
        tierType: 'cat2_mid',
        balanceTier: '1',
        interestRate: 0.022, // 2.20%
        minSpend: 15000,
        categoryCount: 2,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '2 categories + $15k-$30k transactions'
      },
      {
        tierType: 'cat2_high',
        balanceTier: '1',
        interestRate: 0.03, // 3.00%
        minSpend: 30000,
        categoryCount: 2,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '2 categories + >$30k transactions'
      },
      {
        tierType: 'cat3_low',
        balanceTier: '1',
        interestRate: 0.024, // 2.40%
        minSpend: 500,
        categoryCount: 3,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '3+ categories + $500-$15k transactions'
      },
      {
        tierType: 'cat3_mid',
        balanceTier: '1',
        interestRate: 0.025, // 2.50%
        minSpend: 15000,
        categoryCount: 3,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '3+ categories + $15k-$30k transactions'
      },
      {
        tierType: 'cat3_high',
        balanceTier: '1',
        interestRate: 0.041, // 4.10%
        minSpend: 30000,
        categoryCount: 3,
        salaryCredit: true,
        capAmount: 100000,
        remarks: '3+ categories + >$30k transactions'
      }
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