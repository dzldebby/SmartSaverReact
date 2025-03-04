const { findOptimalDistribution } = require('./optimizationEngine');

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Basic Test - $100,000 with salary',
    amount: 100000,
    requirements: {
      hasSalary: true,
      salaryAmount: 3000,
      spendAmount: 500,
      giroCount: 3,
      hasInsurance: false,
      hasInvestments: false,
      hasHomeLoan: false,
      increasedBalance: false,
      grewWealth: false
    }
  },
  {
    name: 'Minimal Test - $45,000 basic requirements',
    amount: 45000,
    requirements: {
      hasSalary: true,
      salaryAmount: 2000,
      spendAmount: 500,
      giroCount: 0,
      hasInsurance: false,
      hasInvestments: false,
      hasHomeLoan: false,
      increasedBalance: false,
      grewWealth: false
    }
  },
  {
    name: 'Maximum Test - $300,000 all requirements',
    amount: 300000,
    requirements: {
      hasSalary: true,
      salaryAmount: 5000,
      spendAmount: 1000,
      giroCount: 3,
      hasInsurance: true,
      insuranceAmount: 200,
      hasInvestments: true,
      investmentAmount: 1000,
      hasHomeLoan: true,
      homeLoanAmount: 2000,
      increasedBalance: true,
      grewWealth: true
    }
  }
];

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2
  }).format(amount);
}

function formatPercent(rate) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(rate);
}

function displayResults(scenario, results) {
  console.log('\n' + '='.repeat(80));
  console.log(`Test Scenario: ${scenario.name}`);
  console.log('='.repeat(80));
  
  results.forEach((result) => {
    console.log(`\nRank ${result.rank} Distribution:`);
    console.log('-'.repeat(40));
    
    // Display distribution
    Object.entries(result.distribution).forEach(([bankId, amount]) => {
      if (amount > 0) {
        const bankName = require('./bankConstants').BANKS[bankId].name;
        console.log(`${bankName}: ${formatMoney(amount)}`);
      }
    });
    
    // Display interest details
    console.log('\nInterest Breakdown:');
    Object.entries(result.breakdown).forEach(([bankId, detail]) => {
      const bankName = require('./bankConstants').BANKS[bankId].name;
      console.log(`${bankName}:`);
      console.log(`  Amount: ${formatMoney(detail.amount)}`);
      console.log(`  Interest: ${formatMoney(detail.interest)} (${formatPercent(detail.interestRate)})`);
    });
    
    console.log('\nTotal Results:');
    console.log(`Total Interest: ${formatMoney(result.totalInterest)}`);
    console.log(`Monthly Interest: ${formatMoney(result.monthlyInterest)}`);
    console.log(`Effective Rate: ${formatPercent(result.effectiveRate)}`);
    console.log('\n' + '-'.repeat(80));
  });
}

// Run all test scenarios
function runTests() {
  console.log('Starting optimization tests...\n');
  
  TEST_SCENARIOS.forEach(scenario => {
    console.time(`${scenario.name} execution time`);
    const results = findOptimalDistribution(scenario.amount, scenario.requirements);
    console.timeEnd(`${scenario.name} execution time`);
    
    displayResults(scenario, results);
  });
}

// Run if called directly
if (require.main === module) {
  runTests();
} 