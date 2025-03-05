const { calculateBankInterest } = require('./bankCalculations');
const { BANKS } = require('./bankConstants');
const fs = require('fs');

// Create a string to hold all output
let output = '';

// Helper function to log to both console and our output string
function log(message) {
  console.log(message);
  output += message + '\n';
}

// Test with all bonuses
log('Test with All Bonuses');
const bankInfo = BANKS['ocbc-360'];
const requirements = {
  hasSalary: true,
  salaryAmount: 3500,
  spendAmount: 500,
  isSalaryBank: true,
  increasedBalance: true,
  grewWealth: true,
  hasInsurance: true,
  hasInvestments: true
};

log('Requirements: ' + JSON.stringify(requirements, null, 2));
const result = calculateBankInterest(50000, bankInfo, requirements);

log('OCBC 360 Interest Calculation (All Bonuses):');
log('-------------------------------------------');
log(`Total Interest: $${result.totalInterest.toFixed(2)}`);
log(`Effective Rate: ${(result.interestRate * 100).toFixed(2)}%`);

// Calculate what the interest should be with all bonuses
let expectedInterest = 0;
// Base interest: 0.05% on $50,000
const baseInterest = 50000 * 0.0005;
expectedInterest += baseInterest;
// Salary bonus: 1.2% on first $25,000, 2.4% on next $25,000
const salaryInterest = 25000 * 0.012 + 25000 * 0.024;
expectedInterest += salaryInterest;
// Spend bonus: 0.3% on first $25,000, 0.6% on next $25,000
const spendInterest = 25000 * 0.003 + 25000 * 0.006;
expectedInterest += spendInterest;
// Step-Up bonus: 0.4% on first $25,000, 0.8% on next $25,000
const stepUpInterest = 25000 * 0.004 + 25000 * 0.008;
expectedInterest += stepUpInterest;
// Wealth bonus: 0.4% on first $25,000, 0.8% on next $25,000
const wealthInterest = 25000 * 0.004 + 25000 * 0.008;
expectedInterest += wealthInterest;
// Grow bonus: 0.4% on first $25,000, 0.8% on next $25,000
const growInterest = 25000 * 0.004 + 25000 * 0.008;
expectedInterest += growInterest;

log('\nExpected Interest with All Bonuses:');
log(`Base: $${baseInterest.toFixed(2)}`);
log(`Salary: $${salaryInterest.toFixed(2)}`);
log(`Spend: $${spendInterest.toFixed(2)}`);
log(`Step-Up: $${stepUpInterest.toFixed(2)}`);
log(`Wealth: $${wealthInterest.toFixed(2)}`);
log(`Grow: $${growInterest.toFixed(2)}`);
log(`Total: $${expectedInterest.toFixed(2)}`);
log(`Rate: ${(expectedInterest / 50000 * 100).toFixed(2)}%`);

// Now let's check if our implementation is adding all the bonuses
log('\nChecking if all bonuses are being added:');
log('Breakdown from calculation:');
result.breakdown.forEach(item => {
  log(`${item.description}: $${item.tierInterest.toFixed(2)}`);
});

// Write the output to a file
fs.writeFileSync('ocbc_test_output.txt', output);
log('\nOutput has been written to ocbc_test_output.txt'); 