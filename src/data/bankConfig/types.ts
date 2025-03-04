export interface InterestTier {
  tierType: string;
  balanceTier: string;
  interestRate: number;
  capAmount: number;
  remarks: string;
  minSpend?: number;
  minSalary?: number;
  salaryCredit?: boolean;
  giroCount?: number;
  categoryCount?: number;
}

export interface BankRequirements {
  salary: boolean;
  spending: boolean;
  investment: boolean;
  insurance: boolean;
  giro?: boolean;
  payment?: boolean;
  increasedBalance?: boolean;
  grewWealth?: boolean;
}

export interface Bank {
  id: string;
  name: string;
  logo: string;
  color: string;
  baseRate: number;
  maxRate: number;
  savingsRate: number;
  requirements: BankRequirements;
  tiers: InterestTier[];
  features: string[];
} 