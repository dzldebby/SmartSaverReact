export const banks = [
    {
      id: 'dbs-multiplier',
      name: 'DBS Multiplier',
      baseRate: 0.005, // 0.5%
      maxRate: 0.04,   // 4.0%
      requirements: {
        salary: true,
        spending: true,
        investment: false,
        insurance: false,
        loan: false
      },
      tiers: [
        { threshold: 2000, rate: 0.02 },  // 2%
        { threshold: 5000, rate: 0.025 }, // 2.5%
        { threshold: 15000, rate: 0.03 }, // 3%
        { threshold: 30000, rate: 0.035 }, // 3.5%
        { threshold: 50000, rate: 0.04 }  // 4%
      ]
    },
    {
      id: 'ocbc-360',
      name: 'OCBC 360',
      baseRate: 0.0065, // 0.65%
      maxRate: 0.045,   // 4.5%
      requirements: {
        salary: true,
        spending: true,
        investment: false,
        insurance: false,
        step: false
      },
      bonuses: [
        { type: 'salary', amount: 1800, bonus: 0.01 }, // 1%
        { type: 'spend', amount: 500, bonus: 0.01 },   // 1%
        { type: 'grow', amount: 500, bonus: 0.01 }     // 1%
      ]
    },
    {
      id: 'uob-one',
      name: 'UOB One',
      baseRate: 0.005, // 0.5%
      maxRate: 0.038,  // 3.8%
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
    }
  ];