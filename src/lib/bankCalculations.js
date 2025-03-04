const { banks } = require('./banks');

/**
 * Calculate interest for a specific bank
 */
function calculateBankInterest(depositAmount, bankInfo, requirements) {
  console.log(`calculateBankInterest for ${bankInfo.id}`, { depositAmount, requirements });
  
  let result;
  const breakdownCategories = {
    base: [],
    bonus: [],
    extra: []
  };
  
  const addTier = (amount, rate, description) => {
    const tierInterest = amount * rate;
    const category = description.toLowerCase().includes('base') ? 'base' : 
                    description.toLowerCase().includes('extra') ? 'extra' : 'bonus';
    
    breakdownCategories[category].push({
      amountInTier: parseFloat(amount),
      tierRate: parseFloat(rate),
      tierInterest: parseFloat(tierInterest.toFixed(2)),
      monthlyInterest: parseFloat((tierInterest / 12).toFixed(2)),
      description
    });
    
    return tierInterest;
  };
  
  // Initialize default result
  result = {
    totalInterest: 0,
    interestRate: 0,
    explanation: `No calculation available for ${bankInfo.name}`,
    breakdown: []
  };
  
  switch (bankInfo.id) {
    case 'uob-one':
      result = calculateUOBOne(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'ocbc-360':
      result = calculateOCBC360(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'sc-bonussaver':
      result = calculateSCBonusSaver(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'dbs-multiplier':
      result = calculateDBSMultiplier(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'boc-smartsaver':
      result = calculateBOCSmartSaver(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'chocolate':
      result = calculateChocolate(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'cimb-fastsaver':
      result = calculateCIMBFastSaver(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'maybank-saveup':
      result = calculateMaybankSaveUp(depositAmount, bankInfo, requirements, addTier);
      break;
    case 'hsbc-everyday':
      result = calculateHSBCEveryday(depositAmount, bankInfo, requirements, addTier);
      break;
    default:
      console.warn(`No calculation function for bank ID: ${bankInfo.id}`);
  }
  
  // Ensure all numbers in result are properly formatted
  result.totalInterest = parseFloat(result.totalInterest.toFixed(2));
  result.interestRate = parseFloat(result.interestRate.toFixed(4));
  
  return result;
}

function calculateUOBOne(depositAmount, bankInfo, bankRequirements, addTier) {
  console.log(`calculateUOBOne for ${bankInfo.id}`, { depositAmount, bankRequirements });
  
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Check if minimum spend requirement is met
  const hasSpend = bankRequirements.spendAmount >= 500;
  const hasSalary = bankRequirements.hasSalary && bankRequirements.isSalaryBank;
  
  if (!hasSpend) {
    // If minimum spend not met, only apply base interest
    const baseRate = 0.0005; // 0.05%
    const baseInterest = depositAmount * baseRate;
    totalInterest = baseInterest;
    breakdown.push({
      amountInTier: depositAmount,
      tierRate: baseRate,
      tierInterest: baseInterest,
      monthlyInterest: baseInterest / 12,
      description: 'Base Interest (No minimum spend)'
    });
  } else {
    // Process in tiers with minimum spend met
    let remainingAmount = depositAmount;
    
    if (hasSalary) {
      // First $75K at 3.00%
      const firstTierCap = 75000;
      const firstTierAmount = Math.min(remainingAmount, firstTierCap);
      const firstTierRate = 0.03;
      const firstTierInterest = firstTierAmount * firstTierRate;
      totalInterest += firstTierInterest;
      breakdown.push({
        amountInTier: firstTierAmount,
        tierRate: firstTierRate,
        tierInterest: firstTierInterest,
        monthlyInterest: firstTierInterest / 12,
        description: 'First $75K (Salary + Spend)'
      });
      remainingAmount -= firstTierAmount;
      
      if (remainingAmount > 0) {
        // Next $50K at 4.50%
        const secondTierCap = 50000;
        const secondTierAmount = Math.min(remainingAmount, secondTierCap);
        const secondTierRate = 0.045;
        const secondTierInterest = secondTierAmount * secondTierRate;
        totalInterest += secondTierInterest;
        breakdown.push({
          amountInTier: secondTierAmount,
          tierRate: secondTierRate,
          tierInterest: secondTierInterest,
          monthlyInterest: secondTierInterest / 12,
          description: 'Next $50K (Salary + Spend)'
        });
        remainingAmount -= secondTierAmount;
      }
      
      if (remainingAmount > 0) {
        // Final $25K at 6.00%
        const thirdTierCap = 25000;
        const thirdTierAmount = Math.min(remainingAmount, thirdTierCap);
        const thirdTierRate = 0.06;
        const thirdTierInterest = thirdTierAmount * thirdTierRate;
        totalInterest += thirdTierInterest;
        breakdown.push({
          amountInTier: thirdTierAmount,
          tierRate: thirdTierRate,
          tierInterest: thirdTierInterest,
          monthlyInterest: thirdTierInterest / 12,
          description: 'Next $25K (Salary + Spend)'
        });
        remainingAmount -= thirdTierAmount;
      }
    } else {
      // Spend only - 0.65% on first $75K
      const spendTierCap = 75000;
      const spendTierAmount = Math.min(depositAmount, spendTierCap);
      const spendTierRate = 0.0065;
      const spendTierInterest = spendTierAmount * spendTierRate;
      totalInterest += spendTierInterest;
      breakdown.push({
        amountInTier: spendTierAmount,
        tierRate: spendTierRate,
        tierInterest: spendTierInterest,
        monthlyInterest: spendTierInterest / 12,
        description: 'First $75K (Spend Only)'
      });
      remainingAmount = depositAmount - spendTierAmount;
    }
    
    // Any remaining amount gets base rate
    if (remainingAmount > 0) {
      const baseRate = 0.0005;
      const baseInterest = remainingAmount * baseRate;
      totalInterest += baseInterest;
      breakdown.push({
        amountInTier: remainingAmount,
        tierRate: baseRate,
        tierInterest: baseInterest,
        monthlyInterest: baseInterest / 12,
        description: 'Remaining Amount (Base Rate)'
      });
    }
  }
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `UOB One account with $${depositAmount.toLocaleString()} deposit.`;
  if (hasSpend) {
    explanation += ` Card spend of $${bankRequirements.spendAmount.toLocaleString()} qualifies for bonus interest.`;
    if (hasSalary) {
      explanation += ' Salary credit increases bonus rates.';
    }
  }
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateOCBC360(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Salary credit + spend bonus rate
  if (bankRequirements.hasSalary && bankRequirements.spendAmount >= 500) {
    let bonusInterest = 0;
    if (depositAmount <= 75000) {
      bonusInterest = depositAmount * 0.0385;
      breakdown.push({
        amountInTier: depositAmount,
        tierRate: 0.0385,
        tierInterest: bonusInterest,
        monthlyInterest: bonusInterest / 12,
        description: 'Salary + Spend Bonus (First $75K)'
      });
    } else {
      const firstTierInterest = 75000 * 0.0385;
      const remainingAmount = Math.min(depositAmount - 75000, 75000);
      const secondTierInterest = remainingAmount * 0.0335;
      
      breakdown.push({
        amountInTier: 75000,
        tierRate: 0.0385,
        tierInterest: firstTierInterest,
        monthlyInterest: firstTierInterest / 12,
        description: 'Salary + Spend Bonus (First $75K)'
      });
      
      if (remainingAmount > 0) {
        breakdown.push({
          amountInTier: remainingAmount,
          tierRate: 0.0335,
          tierInterest: secondTierInterest,
          monthlyInterest: secondTierInterest / 12,
          description: 'Salary + Spend Bonus (Next $75K)'
        });
      }
      
      bonusInterest = firstTierInterest + secondTierInterest;
    }
    totalInterest += bonusInterest;
  }
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `OCBC 360 account with $${depositAmount.toLocaleString()} deposit.`;
  if (bankRequirements.hasSalary && bankRequirements.spendAmount >= 500) {
    explanation += ' Salary credit and minimum spend requirements met for bonus interest.';
  }
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateSCBonusSaver(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `Standard Chartered BonusSaver account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateDBSMultiplier(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `DBS Multiplier account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateBOCSmartSaver(depositAmount, bankInfo, bankRequirements, addTier) {
  console.log(`calculateBOCSmartSaver for ${bankInfo.id}`, { depositAmount, bankRequirements });
  
  let totalInterest = 0;
  let explanation = '';
  let remainingAmount = depositAmount;

  // Process base interest tiers
  const baseTiers = bankInfo.tiers.filter(t => t.type === 'base');
  // Sort tiers by maxAmount to process in ascending order
  baseTiers.sort((a, b) => a.maxAmount - b.maxAmount);
  
  // Track previous tier cap for tier calculation
  let prevCap = 0;
  for (const tier of baseTiers) {
    const cap = tier.maxAmount;
    const tierSize = cap - prevCap;
    const amountInTier = Math.min(Math.max(0, remainingAmount - prevCap), tierSize);
    
    if (amountInTier <= 0) {
      break;
    }
    
    const rate = tier.rate;
    const interest = amountInTier * rate;
    totalInterest += interest;
    addTier(amountInTier, rate, tier.remarks);
    prevCap = cap;
  }

  // Add bonus interest based on requirements
  if (depositAmount >= 1500) {  // Minimum balance requirement
    // Process salary credit bonus if applicable
    if (bankRequirements.hasSalary && bankRequirements.salaryAmount >= 2000) {
      const salaryTier = bankInfo.tiers.find(t => t.type === 'salary');
      if (salaryTier) {
        const rate = salaryTier.rate;
        const bonusAmount = Math.min(depositAmount, salaryTier.maxAmount);
        const interest = bonusAmount * rate;
        totalInterest += interest;
        addTier(bonusAmount, rate, salaryTier.remarks);
      }
    }

    // Process wealth bonus if applicable
    if (bankRequirements.hasInsurance) {
      const wealthTier = bankInfo.tiers.find(t => t.type === 'wealth');
      if (wealthTier) {
        const rate = wealthTier.rate;
        const bonusAmount = Math.min(depositAmount, wealthTier.maxAmount);
        const interest = bonusAmount * rate;
        totalInterest += interest;
        addTier(bonusAmount, rate, wealthTier.remarks);
      }
    }
    
    // Process spend bonus if applicable
    const spendAmount = bankRequirements.spendAmount || 0;
    if (spendAmount >= 500) {
      // Get appropriate spend tier based on amount
      const spendTiers = bankInfo.tiers.filter(t => t.type === 'spend');
      let spendTier;
      if (spendAmount >= 1500) {
        spendTier = spendTiers.find(t => t.remarks.includes('>= $1500'));
      } else {
        spendTier = spendTiers.find(t => t.remarks.includes('$500-$1499'));
      }
      
      if (spendTier) {
        const rate = spendTier.rate;
        const bonusAmount = Math.min(depositAmount, spendTier.maxAmount);
        const interest = bonusAmount * rate;
        totalInterest += interest;
        addTier(bonusAmount, rate, spendTier.remarks);
      }
    }

    // Process payment bonus if applicable
    if (bankRequirements.giroCount >= 3) {
      const paymentTier = bankInfo.tiers.find(t => t.type === 'payment');
      if (paymentTier) {
        const rate = paymentTier.rate;
        const bonusAmount = Math.min(depositAmount, paymentTier.maxAmount);
        const interest = bonusAmount * rate;
        totalInterest += interest;
        addTier(bonusAmount, rate, paymentTier.remarks);
      }
    }

    // Process extra interest for amount above $100k if applicable
    if (depositAmount > 100000) {
      const extraTier = bankInfo.tiers.find(t => t.type === 'extra');
      if (extraTier) {
        const extraAmount = depositAmount - 100000;
        const rate = extraTier.rate;
        const interest = extraAmount * rate;
        totalInterest += interest;
        addTier(extraAmount, rate, extraTier.remarks);
      }
    }
  }

  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `BOC SmartSaver account with $${depositAmount.toLocaleString()} deposit.`;
  if (depositAmount < 1500) {
    explanation += ' Minimum balance of $1,500 required for bonus interest.';
  } else {
    if (bankRequirements.hasSalary && bankRequirements.salaryAmount >= 2000) {
      explanation += ` Salary credit of $${bankRequirements.salaryAmount.toLocaleString()} qualifies for bonus interest.`;
    }
    if (bankRequirements.hasInsurance) {
      explanation += ' Insurance qualifies for bonus interest.';
    }
    if (bankRequirements.spendAmount >= 500) {
      explanation += ` Card spend of $${bankRequirements.spendAmount.toLocaleString()} qualifies for bonus interest.`;
    }
    if (bankRequirements.giroCount >= 3) {
      explanation += ' 3 bill payments qualify for bonus interest.';
    }
  }
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown: []
  };
}

function calculateChocolate(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `Chocolate account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateCIMBFastSaver(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `CIMB FastSaver account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateMaybankSaveUp(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `Maybank SaveUp account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

function calculateHSBCEveryday(depositAmount, bankInfo, bankRequirements, addTier) {
  let totalInterest = 0;
  let explanation = '';
  const breakdown = [];
  
  // Base interest rate 0.05%
  const baseRate = 0.0005;
  const baseInterest = depositAmount * baseRate;
  totalInterest += baseInterest;
  breakdown.push({
    amountInTier: depositAmount,
    tierRate: baseRate,
    tierInterest: baseInterest,
    monthlyInterest: baseInterest / 12,
    description: 'Base Interest'
  });
  
  // Calculate effective interest rate
  const interestRate = totalInterest / depositAmount;
  
  // Generate explanation
  explanation = `HSBC Everyday account with $${depositAmount.toLocaleString()} deposit.`;
  
  return {
    totalInterest,
    interestRate,
    explanation,
    breakdown
  };
}

module.exports = {
  calculateBankInterest,
  calculateUOBOne,
  calculateOCBC360,
  calculateSCBonusSaver,
  calculateDBSMultiplier,
  calculateBOCSmartSaver,
  calculateChocolate,
  calculateCIMBFastSaver,
  calculateMaybankSaveUp,
  calculateHSBCEveryday
}; 