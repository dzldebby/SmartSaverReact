/**
 * @typedef {Object} Bank
 * @property {string} id
 * @property {string} name
 * @property {string} [logo]
 * @property {string} color
 * @property {number} savingsRate
 * @property {number} mortgageRate
 * @property {number} personalLoanRate
 * @property {number} carLoanRate
 * @property {number} creditCardRate
 * @property {string[]} features
 * @property {number} [baseRate]
 * @property {number} [maxRate]
 * @property {Object} [requirements]
 * @property {boolean} [requirements.salary]
 * @property {boolean} [requirements.spending]
 * @property {boolean} [requirements.investment]
 * @property {boolean} [requirements.insurance]
 * @property {boolean} [requirements.loan]
 * @property {boolean} [requirements.giro]
 * @property {Array} [tiers]
 * @property {Array} [bonuses]
 */

/**
 * @typedef {Object} CalculationResult
 * @property {string} bankId
 * @property {number} monthlyPayment
 * @property {number} totalInterest
 * @property {number} totalPayment
 * @property {Array<{month: number, payment: number, principal: number, interest: number, balance: number}>} amortizationSchedule
 */

/**
 * @typedef {'mortgage' | 'personal' | 'car' | 'credit' | 'savings'} LoanType
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {Date} timestamp
 */

// Export empty object to make this a valid module
export {}; 