import { banks } from '@/data/banks';

export function calculateInterest(depositAmount, requirements) {
  const results = [];
  
  for (const bank of banks) {
    let interestRate = bank.baseRate;
    let annualInterest = depositAmount * interestRate;
    let monthlyInterest = annualInterest / 12;
    let explanation = `Base interest rate: ${interestRate * 100}%`;
    
    // Very simplified calculation logic - we'll make this more accurate later
    if (bank.id === 'dbs-multiplier') {
      if (requirements.hasSalary && requirements.hasSpending) {
        const totalTransactions = requirements.salaryAmount + requirements.spendingAmount;
        
        // Find applicable tier
        for (let i = bank.tiers.length - 1; i >= 0; i--) {
          if (totalTransactions >= bank.tiers[i].threshold) {
            interestRate = bank.tiers[i].rate;
            annualInterest = depositAmount * interestRate;
            monthlyInterest = annualInterest / 12;
            explanation = `Transactions: $${totalTransactions} qualifies for ${interestRate * 100}% interest rate`;
            break;
          }
        }
      }
    } 
    else if (bank.id === 'ocbc-360') {
      interestRate = bank.baseRate;
      
      if (requirements.hasSalary && requirements.salaryAmount >= 1800) {
        interestRate += 0.01; // +1%
        explanation += `\nSalary credit bonus: +1%`;
      }
      
      if (requirements.hasSpending && requirements.spendingAmount >= 500) {
        interestRate += 0.01; // +1%
        explanation += `\nSpending bonus: +1%`;
      }
      
      annualInterest = depositAmount * interestRate;
      monthlyInterest = annualInterest / 12;
    }
    else if (bank.id === 'uob-one') {
      if (requirements.hasSpending) {
        // Find applicable tier
        for (let i = bank.tiers.length - 1; i >= 0; i--) {
          if (requirements.spendingAmount >= bank.tiers[i].spend) {
            interestRate = bank.tiers[i].rate;
            annualInterest = depositAmount * interestRate;
            monthlyInterest = annualInterest / 12;
            explanation = `Spending: $${requirements.spendingAmount} qualifies for ${interestRate * 100}% interest rate`;
            break;
          }
        }
      }
    }
    
    results.push({
      bankId: bank.id,
      bankName: bank.name,
      interestRate: interestRate,
      annualInterest: annualInterest,
      monthlyInterest: monthlyInterest,
      explanation: explanation
    });
  }
  
  // Sort by annual interest (highest first)
  results.sort((a, b) => b.annualInterest - a.annualInterest);
  
  return results;
}