const banks = {
  'uob-one': {
    id: 'uob-one',
    name: 'UOB One',
    maxCap: 150000,
    baseRate: 0.0005,
    requiresSalary: false,
    minSalary: 1600,
    minSpend: 500,
    tiers: [
      {
        type: 'salary',
        maxAmount: 75000,
        rate: 0.03,
        requirements: ['salary', 'spend']
      },
      {
        type: 'salary',
        maxAmount: 50000,
        rate: 0.045,
        requirements: ['salary', 'spend']
      },
      {
        type: 'salary',
        maxAmount: 25000,
        rate: 0.06,
        requirements: ['salary', 'spend']
      },
      {
        type: 'spend_only',
        maxAmount: 75000,
        rate: 0.0065,
        requirements: ['spend']
      }
    ]
  },
  'ocbc-360': {
    id: 'ocbc-360',
    name: 'OCBC 360',
    maxCap: 100000,
    baseRate: 0.0005,
    requiresSalary: false,
    minSalary: 1800,
    tiers: [
      {
        type: 'salary',
        maxAmount: 75000,
        rate: 0.0238,
        requirements: ['salary']
      },
      {
        type: 'spend',
        maxAmount: 75000,
        rate: 0.0238,
        requirements: ['spend']
      },
      {
        type: 'grow',
        maxAmount: 75000,
        rate: 0.0238,
        requirements: ['increasedBalance']
      },
      {
        type: 'salary',
        maxAmount: 25000,
        rate: 0.0238,
        requirements: ['salary']
      },
      {
        type: 'spend',
        maxAmount: 25000,
        rate: 0.0238,
        requirements: ['spend']
      },
      {
        type: 'grow',
        maxAmount: 25000,
        rate: 0.0238,
        requirements: ['increasedBalance']
      }
    ]
  },
  'sc-bonussaver': {
    id: 'sc-bonussaver',
    name: 'SC BonusSaver',
    maxCap: 100000,
    baseRate: 0.0005,
    requiresSalary: false,
    minSalary: 3000,
    minSpend: 500,
    tiers: [
      {
        type: 'salary',
        maxAmount: 100000,
        rate: 0.0075,
        requirements: ['salary']
      },
      {
        type: 'spend',
        maxAmount: 100000,
        rate: 0.005,
        requirements: ['spend']
      },
      {
        type: 'invest',
        maxAmount: 100000,
        rate: 0.008,
        requirements: ['investments']
      },
      {
        type: 'insure',
        maxAmount: 100000,
        rate: 0.008,
        requirements: ['insurance']
      }
    ]
  },
  'chocolate': {
    id: 'chocolate',
    name: 'Chocolate',
    maxCap: 50000,
    baseRate: 0.033,
    requiresSalary: false,
    tiers: [
      {
        type: 'base',
        maxAmount: 20000,
        rate: 0.033,
        requirements: []
      },
      {
        type: 'base',
        maxAmount: 30000,
        rate: 0.03,
        requirements: []
      },
      {
        type: 'base',
        maxAmount: 999999999,
        rate: 0.0,
        requirements: []
      }
    ]
  },
  'boc-smartsaver': {
    id: 'boc-smartsaver',
    name: 'BOC SmartSaver',
    maxCap: 100000,
    baseRate: 0.0015,
    requiresSalary: false,
    minSalary: 2000,
    minSpend: 500,
    tiers: [
      {
        type: 'base',
        maxAmount: 5000,
        rate: 0.0015,
        requirements: [],
        remarks: 'Base interest for balance below $5K'
      },
      {
        type: 'base',
        maxAmount: 20000,
        rate: 0.002,
        requirements: [],
        remarks: 'Base interest for $5K to below $20K'
      },
      {
        type: 'base',
        maxAmount: 50000,
        rate: 0.003,
        requirements: [],
        remarks: 'Base interest for $20K to below $50K'
      },
      {
        type: 'base',
        maxAmount: 100000,
        rate: 0.003,
        requirements: [],
        remarks: 'Base interest for $50K to below $100K'
      },
      {
        type: 'base',
        maxAmount: 1000000,
        rate: 0.004,
        requirements: [],
        remarks: 'Base interest for $100K and above'
      },
      {
        type: 'wealth',
        maxAmount: 100000,
        rate: 0.024,
        requirements: ['insurance'],
        remarks: 'Insurance purchase bonus'
      },
      {
        type: 'spend',
        maxAmount: 100000,
        rate: 0.005,
        requirements: ['spend'],
        remarks: 'Card spend $500-$1499'
      },
      {
        type: 'spend',
        maxAmount: 100000,
        rate: 0.008,
        requirements: ['spend'],
        remarks: 'Card spend >= $1500'
      },
      {
        type: 'salary',
        maxAmount: 100000,
        rate: 0.025,
        requirements: ['salary'],
        remarks: 'Salary credit >= $2000'
      },
      {
        type: 'payment',
        maxAmount: 100000,
        rate: 0.009,
        requirements: ['giro'],
        remarks: '3 bill payments >= $30 each'
      },
      {
        type: 'extra',
        maxAmount: 999999,
        rate: 0.006,
        requirements: [],
        remarks: 'Extra interest above $100k'
      }
    ]
  },
  'dbs-multiplier': {
    id: 'dbs-multiplier',
    name: 'DBS Multiplier',
    maxCap: 100000,
    baseRate: 0.0005,
    requiresSalary: true,
    minSalary: 0,
    minSpend: 500,
    tiers: [
      {
        type: 'base',
        maxAmount: 999999999,
        rate: 0.0005,
        requirements: [],
        remarks: 'Base interest (for amounts not eligible for bonus)'
      },
      {
        type: 'cat1_low',
        maxAmount: 50000,
        rate: 0.018,
        requirements: ['salary', 'spend'],
        remarks: '1 category + $500-$15k transactions'
      },
      {
        type: 'cat1_mid',
        maxAmount: 50000,
        rate: 0.019,
        requirements: ['salary', 'spend'],
        remarks: '1 category + $15k-$30k transactions'
      },
      {
        type: 'cat1_high',
        maxAmount: 50000,
        rate: 0.022,
        requirements: ['salary', 'spend'],
        remarks: '1 category + >$30k transactions'
      },
      {
        type: 'cat2_low',
        maxAmount: 100000,
        rate: 0.021,
        requirements: ['salary', 'spend'],
        remarks: '2 categories + $500-$15k transactions'
      },
      {
        type: 'cat2_mid',
        maxAmount: 100000,
        rate: 0.022,
        requirements: ['salary', 'spend'],
        remarks: '2 categories + $15k-$30k transactions'
      },
      {
        type: 'cat2_high',
        maxAmount: 100000,
        rate: 0.03,
        requirements: ['salary', 'spend'],
        remarks: '2 categories + >$30k transactions'
      },
      {
        type: 'cat3_low',
        maxAmount: 100000,
        rate: 0.024,
        requirements: ['salary', 'spend'],
        remarks: '3+ categories + $500-$15k transactions'
      },
      {
        type: 'cat3_mid',
        maxAmount: 100000,
        rate: 0.025,
        requirements: ['salary', 'spend'],
        remarks: '3+ categories + $15k-$30k transactions'
      },
      {
        type: 'cat3_high',
        maxAmount: 100000,
        rate: 0.041,
        requirements: ['salary', 'spend'],
        remarks: '3+ categories + >$30k transactions'
      }
    ]
  }
};

module.exports = { banks }; 