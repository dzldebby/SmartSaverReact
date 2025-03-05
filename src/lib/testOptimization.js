const { findOptimalDistribution } = require('./optimizationEngine');
const fs = require('fs');

// Create a string to hold all output
let output = '';

// Helper function to log to both console and our output string
function log(message) {
  console.log(message);
  output += message + '\n';
}

async function runTest() {
  // Test with only salary and spend
  log('Test 1: Only Salary and Spend');
  const requirements1 = {
    hasSalary: true,
    salaryAmount: 3500,
    spendAmount: 500,
    transactionCode: 'SALA',
    giroCount: 0,
    hasInsurance: false,
    insuranceAmount: 0,
    hasInvestments: false,
    investmentAmount: 0,
    hasHomeLoan: false,
    homeLoanAmount: 0,
    increasedBalance: false,
    grewWealth: false
  };

  log('Requirements: ' + JSON.stringify(requirements1, null, 2));
  const results1 = await findOptimalDistribution(200000, requirements1);
  
  log('Top result:');
  log(JSON.stringify(results1[0], null, 2));
  
  // Check if OCBC 360 interest is correct
  const ocbcInterest = results1[0].breakdown['ocbc-360']?.interest || 0;
  log(`OCBC 360 Interest: $${ocbcInterest.toFixed(2)}`);
  
  // Write the output to a file
  fs.writeFileSync('optimization_test_output.txt', output);
  log('\nOutput has been written to optimization_test_output.txt');
}

runTest().catch(err => {
  console.error('Error running test:', err);
}); 