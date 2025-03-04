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
    let salaryBankId = null;
    
    // Find the salary bank - prioritize UOB One if it has sufficient deposit
    for (const [bankId, amount] of Object.entries(distribution)) {
      if (amount > 0) {
        const bank = BANKS[bankId];
        console.log(`Checking bank ${bankId}:`, {
          amount,
          bank,
          requirements
        });
        
        // For UOB One, check if amount and requirements are sufficient for salary bonus
        if (bankId === 'uob-one' && 
            requirements.hasSalary && 
            requirements.salaryAmount >= 1600 && 
            requirements.spendAmount >= 500) {
          salaryBankId = bankId;
          console.log('Found UOB One as salary bank:', bankId);
          break;
        }
        // For other banks that require salary
        else if (bank?.requiresSalary && requirements.hasSalary) {
          salaryBankId = bankId;
          console.log('Found other salary bank:', bankId);
          break;
        }
      }
    }
    
    for (const [bankId, amount] of Object.entries(distribution)) {
      if (amount > 0) {
        const bank = BANKS[bankId];
        if (!bank) {
          console.error(`Bank not found: ${bankId}`);
          continue;
        }
        
        // Add salaryBankId to requirements if this is the salary bank
        const bankRequirements = {
          ...requirements,
          isSalaryBank: bankId === salaryBankId
        };
        
        const result = calculateBankInterest(amount, bank, bankRequirements);
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
    const result = {
      distribution,
      totalInterest,
      effectiveRate: totalAmount > 0 ? totalInterest / totalAmount : 0,
      monthlyInterest: totalInterest / 12,
      breakdown,
      salaryBankId  // Make sure salaryBankId is included in the result
    };
    console.log('Scenario result:', {
      distribution: result.distribution,
      salaryBankId: result.salaryBankId,
      totalInterest: result.totalInterest
    });
    return result;
  } catch (error) {
    console.error('Error calculating scenario interest:', error);
    return {
      distribution,
      totalInterest: 0,
      effectiveRate: 0,
      monthlyInterest: 0,
      breakdown: {},
      salaryBankId: null
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
  
  // Special handling for UOB One
  if (bankId === 'uob-one') {
    // If trying to get salary bonus
    if (requirements.hasSalary) {
      // Check minimum salary and spend requirements
      if (requirements.salaryAmount < 1600 || requirements.spendAmount < 500) {
        return false;
      }
    }
    // If not using salary, still need minimum spend
    else if (requirements.spendAmount < 500) {
      return false;
    }
    return true;
  }
  
  // For other banks, check minimum salary requirement if applicable
  if (bank.requiresSalary) {
    // If bank requires salary, we need salary credit enabled
    if (!requirements.hasSalary) {
      return false;
    }
    // If bank has a minimum salary requirement, check it
    if (bank.minSalary > 0 && requirements.salaryAmount < bank.minSalary) {
      return false;
    }
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
  
  // Find potential salary banks
  const potentialSalaryBanks = bankIds.filter(bankId => {
    const bank = BANKS[bankId];
    // Check if bank can be a salary bank
    if (bankId === 'uob-one') {
      return requirements.hasSalary && 
             requirements.salaryAmount >= 1600 && 
             requirements.spendAmount >= 500;
    }
    return bank.requiresSalary && requirements.hasSalary;
  });
  
  // Helper function to generate combinations recursively
  function generateCombinations(remaining, currentBank, currentDist, salaryBankId = null) {
    // Base case: all money distributed or no more banks
    if (remaining === 0 || currentBank >= bankIds.length) {
      if (remaining === 0) {
        // Only add scenario if it has a valid salary bank when required
        if (!requirements.hasSalary || salaryBankId) {
          scenarios.push({
            distribution: { ...currentDist },
            salaryBankId
          });
        }
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
    
    // Try different amounts for current bank
    const maxForBank = Math.min(remaining, bank.maxCap || remaining);
    for (let amount = 0; amount <= maxForBank; amount += INCREMENT) {
      currentDist[bankId] = amount;
      
      // Handle salary bank assignment
      let newSalaryBankId = salaryBankId;
      if (amount > 0 && !salaryBankId && potentialSalaryBanks.includes(bankId)) {
        newSalaryBankId = bankId;
      }
      
      generateCombinations(remaining - amount, currentBank + 1, currentDist, newSalaryBankId);
    }
    
    // Clean up
    delete currentDist[bankId];
  }
  
  // Start generation with full amount
  generateCombinations(totalAmount, 0, {}, null);
  
  return scenarios;
}

/**
 * Find optimal distribution of money across banks
 * @param {number} totalAmount - Total amount to distribute
 * @param {Object} requirements - User requirements
 * @returns {Array} Top 3 distribution scenarios
 */
async function findOptimalDistribution(totalAmount, requirements) {
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
  
  // Calculate interest for each scenario in chunks to prevent UI blocking
  const results = [];
  const CHUNK_SIZE = 50; // Process 50 scenarios at a time
  
  for (let i = 0; i < scenarios.length; i += CHUNK_SIZE) {
    const chunk = scenarios.slice(i, i + CHUNK_SIZE);
    
    // Process chunk
    const chunkResults = chunk.map((scenario, index) => {
      const globalIndex = i + index;
      
      // Update progress for each scenario
      updateProgress({
        status: 'Calculating interest for each scenario...',
        progress: (globalIndex / scenarios.length) * 100,
        totalScenarios: scenarios.length,
        currentScenario: globalIndex + 1
      });
      
      // Calculate interest for this scenario
      const result = calculateScenarioInterest(scenario.distribution, requirements);
      
      // Preserve the salaryBankId from both calculation and scenario
      result.salaryBankId = result.salaryBankId || scenario.salaryBankId;
      
      return result;
    });
    
    results.push(...chunkResults);
    
    // Allow UI to update between chunks
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  // Sort by total interest (descending) and take top 3
  results.sort((a, b) => b.totalInterest - a.totalInterest);
  const topResults = results.slice(0, 3);
  
  // Log the final top results
  console.log('Top 3 results:', topResults.map(result => ({
    distribution: result.distribution,
    salaryBankId: result.salaryBankId,
    totalInterest: result.totalInterest
  })));
  
  // Update progress - complete
  updateProgress({
    status: 'Optimization complete!',
    progress: 100,
    totalScenarios: scenarios.length,
    currentScenario: scenarios.length
  });
  
  return topResults;
}

module.exports = {
  findOptimalDistribution,
  calculateScenarioInterest,
  generateDistributionScenarios,
  validateBankRequirements,
  setProgressCallback
}; 