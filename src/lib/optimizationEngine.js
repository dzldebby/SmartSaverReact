const { BANKS } = require('./bankConstants');
const { calculateBankInterest } = require('./bankCalculations');

// Define INCREMENT if not imported
const INCREMENT = 5000; // Minimum increment for distribution in dollars

// Progress update callback type
let progressCallback = null;

/**
 * Set the progress callback function
 * @param {Function} callback - Function to call with progress updates
 */
function setProgressCallback(callback) {
  progressCallback = callback;
}

/**
 * Update progress if callback is set
 * @param {Object} progress - Progress information
 */
function updateProgress(progress) {
  if (progressCallback) {
    progressCallback(progress);
  }
}

/**
 * Calculate interest for a specific distribution scenario
 * @param {Object} distribution - Amount allocated to each bank
 * @param {Object} requirements - User requirements
 * @returns {Object} Interest calculation results
 */
function calculateScenarioInterest(distribution, requirements) {
  try {
    console.log('Calculating interest for scenario:', distribution);
    let totalInterest = 0;
    const breakdown = {};
    
    for (const [bankId, amount] of Object.entries(distribution)) {
      if (amount > 0) {
        const bank = BANKS[bankId];
        if (!bank) {
          console.error(`Bank not found: ${bankId}`);
          continue;
        }
        const result = calculateBankInterest(amount, bank, requirements);
        if (!result) {
          console.warn(`No result returned for bank ${bankId} with amount ${amount}`);
          continue;
        }
        totalInterest += result.totalInterest;
        breakdown[bankId] = {
          amount,
          interest: result.totalInterest,
          interestRate: result.interestRate,
          breakdown: result.breakdown
        };
      }
    }
    
    const totalAmount = Object.values(distribution).reduce((a, b) => a + b, 0);
    return {
      distribution,
      totalInterest,
      effectiveRate: totalAmount > 0 ? totalInterest / totalAmount : 0,
      monthlyInterest: totalInterest / 12,
      breakdown
    };
  } catch (error) {
    console.error('Error calculating scenario interest:', error);
    return {
      distribution,
      totalInterest: 0,
      effectiveRate: 0,
      monthlyInterest: 0,
      breakdown: {}
    };
  }
}

/**
 * Validate if a bank meets requirements for bonus interest
 * @param {string} bankId - Bank identifier
 * @param {Object} requirements - User requirements
 * @returns {boolean} Whether the bank meets requirements
 */
function validateBankRequirements(bankId, requirements) {
  const bank = BANKS[bankId];
  if (!bank) return false;
  
  // Check minimum salary requirement if applicable
  if (bank.requiresSalary && (!requirements.hasSalary || requirements.salaryAmount < bank.minSalary)) {
    return false;
  }
  
  return true;
}

/**
 * Generate all possible distribution scenarios in $5,000 increments
 * @param {number} totalAmount - Total amount to distribute
 * @param {Object} requirements - User requirements
 * @returns {Array} Array of possible distributions
 */
function generateDistributionScenarios(totalAmount, requirements) {
  const bankIds = Object.keys(BANKS);
  const scenarios = [];
  
  // Helper function to generate combinations recursively
  function generateCombinations(remaining, currentBank, currentDist, salaryBankId = null) {
    // Base case: all money distributed or no more banks
    if (remaining === 0 || currentBank >= bankIds.length) {
      if (remaining === 0) {
        scenarios.push({...currentDist});
      }
      return;
    }
    
    const bankId = bankIds[currentBank];
    const bank = BANKS[bankId];
    
    // Skip if bank doesn't meet requirements
    if (!validateBankRequirements(bankId, requirements)) {
      generateCombinations(remaining, currentBank + 1, currentDist, salaryBankId);
      return;
    }
    
    // Handle salary credit requirement
    let bankReqs = {...requirements};
    if (bank.requiresSalary) {
      if (salaryBankId === null) {
        // This bank can be the salary bank
        bankReqs.hasSalary = true;
        generateCombinations(remaining, currentBank + 1, currentDist, bankId);
      } else if (salaryBankId === bankId) {
        // This is the salary bank
        bankReqs.hasSalary = true;
      } else {
        // Another bank is already the salary bank
        bankReqs.hasSalary = false;
      }
    }
    
    // Try different amounts for current bank
    const maxForBank = Math.min(remaining, bank.maxCap);
    for (let amount = 0; amount <= maxForBank; amount += INCREMENT) {
      currentDist[bankId] = amount;
      generateCombinations(remaining - amount, currentBank + 1, currentDist, salaryBankId);
    }
    
    // Clean up
    delete currentDist[bankId];
  }
  
  // Start generation with full amount
  generateCombinations(totalAmount, 0, {});
  
  return scenarios;
}

/**
 * Find optimal distribution of money across banks
 * @param {number} totalAmount - Total amount to distribute
 * @param {Object} requirements - User requirements
 * @returns {Array} Top 3 distribution scenarios
 */
function findOptimalDistribution(totalAmount, requirements) {
  console.log('Finding optimal distribution for:', { totalAmount, requirements });
  
  // Round total amount to nearest $5,000
  const adjustedAmount = Math.floor(totalAmount / INCREMENT) * INCREMENT;
  
  // Update progress - starting
  updateProgress({
    status: 'Starting optimization...',
    progress: 0,
    totalScenarios: 0,
    currentScenario: 0
  });
  
  // Generate all possible distributions
  const scenarios = generateDistributionScenarios(adjustedAmount, requirements);
  console.log(`Generated ${scenarios.length} possible scenarios`);
  
  // Update progress - scenarios generated
  updateProgress({
    status: 'Calculating interest for each scenario...',
    progress: 0,
    totalScenarios: scenarios.length,
    currentScenario: 0
  });
  
  // Calculate interest for each scenario
  const results = scenarios.map((distribution, index) => {
    // Update progress for each scenario
    updateProgress({
      status: 'Calculating interest for each scenario...',
      progress: (index / scenarios.length) * 100,
      totalScenarios: scenarios.length,
      currentScenario: index + 1
    });
    
    return {
      distribution,
      ...calculateScenarioInterest(distribution, requirements)
    };
  });
  
  // Sort by total interest (descending) and take top 3
  results.sort((a, b) => b.totalInterest - a.totalInterest);
  const topResults = results.slice(0, 3);
  
  // Update progress - complete
  updateProgress({
    status: 'Optimization complete!',
    progress: 100,
    totalScenarios: scenarios.length,
    currentScenario: scenarios.length
  });
  
  // Add ranking and format results
  return topResults.map((result, index) => ({
    rank: index + 1,
    distribution: result.distribution,
    totalInterest: result.totalInterest,
    effectiveRate: result.effectiveRate,
    monthlyInterest: result.monthlyInterest,
    breakdown: result.breakdown
  }));
}

module.exports = {
  findOptimalDistribution,
  calculateScenarioInterest,
  generateDistributionScenarios,
  validateBankRequirements,
  setProgressCallback
}; 