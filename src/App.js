"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BankCard from './components/BankCard';
import ComparisonChart from './components/ComparisonChart';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import ChatButton from './components/ChatButton';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [depositAmount, setDepositAmount] = useState(10000);
  const [calculationResults, setCalculationResults] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // User requirements
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState(3500);
  const [cardSpend, setCardSpend] = useState(500);
  const [giroCount, setGiroCount] = useState(0);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [hasInvestments, setHasInvestments] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [homeLoanAmount, setHomeLoanAmount] = useState(0);
  const [increasedBalance, setIncreasedBalance] = useState(false);
  const [grewWealth, setGrewWealth] = useState(false);
  
  // Add new state variables for collapsible sections
  const [isBasicRequirementsOpen, setIsBasicRequirementsOpen] = useState(true);
  const [isAdvancedRequirementsOpen, setIsAdvancedRequirementsOpen] = useState(false);
  
  // Sample bank data wrapped in useMemo based on SmartSaver structure
  const banks = useMemo(() => [
    {
      id: 'uob-one',
      bank: 'UOB One',
      name: 'UOB One',
      color: '#0033A0',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: 'First $100K',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest of 0.05%'
        },
        {
          tier_type: 'spend_only',
          balance_tier: '1',
          interest_rate: '0.65%',
          requirement_type: 'spend_only',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 75000,
          remarks: 'First $75k with card spend only'
        },
        {
          tier_type: 'salary',
          balance_tier: 'First $75K',
          interest_rate: '3.00%',
          requirement_type: 'salary',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 75000,
          remarks: 'First $75k with salary + spend'
        },
        {
          tier_type: 'salary',
          balance_tier: 'Next $50K',
          interest_rate: '4.50%',
          requirement_type: 'salary',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 50000,
          remarks: 'Next $50k with salary + spend'
        },
        {
          tier_type: 'salary',
          balance_tier: 'Next $25K',
          interest_rate: '6.00%',
          requirement_type: 'salary',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 25000,
          remarks: 'Next $25k with salary + spend'
        }
      ],
      features: [
        'Up to 7.8% p.a. interest on your savings',
        'No minimum credit card spend',
        'No minimum salary credit',
        'No lock-in period'
      ]
    },
    {
      id: 'sc-bonussaver',
      bank: 'SC BonusSaver',
      name: 'Standard Chartered BonusSaver',
      color: '#0F5132',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest with no requirements'
        },
        {
          tier_type: 'salary',
          balance_tier: '1',
          interest_rate: '1.00%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 3000,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 100000,
          remarks: 'Regular salary credit at least $3000'
        },
        {
          tier_type: 'spend',
          balance_tier: '1',
          interest_rate: '1.00%',
          requirement_type: 'spend',
          min_spend: 1000,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Card spend at least $1000'
        }
      ],
      features: [
        'Up to 4.28% p.a. interest on your savings',
        'Bonus interest on eligible transactions',
        'No lock-in period',
        'Free digital banking'
      ]
    },
    {
      id: 'ocbc-360',
      bank: 'OCBC 360',
      name: 'OCBC 360',
      color: '#EB001B',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Base interest with no requirements'
        },
        {
          tier_type: 'salary',
          balance_tier: '1',
          interest_rate: '2.00%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 1800,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 75000,
          remarks: 'First $75k with salary at least $1800'
        },
        {
          tier_type: 'salary',
          balance_tier: '2',
          interest_rate: '4.00%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 1800,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 25000,
          remarks: 'Next $25k with salary at least $1800'
        },
        {
          tier_type: 'spend',
          balance_tier: '1',
          interest_rate: '0.60%',
          requirement_type: 'spend',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 75000,
          remarks: 'First $75k with card spend at least $500'
        },
        {
          tier_type: 'spend',
          balance_tier: '2',
          interest_rate: '0.60%',
          requirement_type: 'spend',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 25000,
          remarks: 'Next $25k with card spend at least $500'
        }
      ],
      features: [
        'Up to 7.65% p.a. interest on your savings',
        'Multiple ways to earn bonus interest',
        'No minimum balance fee',
        'Free digital banking'
      ]
    },
    {
      id: 'dbs-multiplier',
      bank: 'DBS Multiplier',
      name: 'DBS Multiplier',
      color: '#E52E2E',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: '1',
          interest_rate: '0.05%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 999999999,
          remarks: 'Base interest (for amounts not eligible for bonus)'
        },
        {
          tier_type: 'cat1_low',
          balance_tier: '1',
          interest_rate: '1.80%',
          requirement_type: 'cat1',
          min_spend: 500,
          min_salary: 1,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 50000,
          remarks: '1 category + $500-$15k transactions'
        },
        {
          tier_type: 'cat2_high',
          balance_tier: '1',
          interest_rate: '3.00%',
          requirement_type: 'cat2',
          min_spend: 30000,
          min_salary: 1,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 100000,
          remarks: '2 categories + >$30k transactions'
        }
      ],
      features: [
        'Up to 4.1% p.a. interest on your savings',
        'No minimum amount for salary credit',
        'No lock-in period',
        'Free digital banking'
      ]
    },
    {
      id: 'boc-smartsaver',
      bank: 'BOC SmartSaver',
      name: 'BOC SmartSaver',
      color: '#C41E3A',
      tiers: [
        {
          tier_type: 'base',
          balance_tier: 'Below $5K',
          interest_rate: '0.15%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 5000,
          remarks: 'Base interest for balance below $5K'
        },
        {
          tier_type: 'base',
          balance_tier: '$5K to below $20K',
          interest_rate: '0.20%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 15000,
          remarks: 'Base interest for $5K to below $20K'
        },
        {
          tier_type: 'base',
          balance_tier: '$20K to below $50K',
          interest_rate: '0.30%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 30000,
          remarks: 'Base interest for $20K to below $50K'
        },
        {
          tier_type: 'base',
          balance_tier: '$50K to below $100K',
          interest_rate: '0.30%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 50000,
          remarks: 'Base interest for $50K to below $100K'
        },
        {
          tier_type: 'base',
          balance_tier: '$100K and above',
          interest_rate: '0.40%',
          requirement_type: 'base',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 1000000,
          remarks: 'Base interest for $100K and above'
        },
        {
          tier_type: 'wealth',
          balance_tier: '1',
          interest_rate: '2.40%',
          requirement_type: 'wealth',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Insurance purchase bonus'
        },
        {
          tier_type: 'spend',
          balance_tier: '1',
          interest_rate: '0.50%',
          requirement_type: 'spend',
          min_spend: 500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Card spend $500-$1499'
        },
        {
          tier_type: 'spend',
          balance_tier: '2',
          interest_rate: '0.80%',
          requirement_type: 'spend',
          min_spend: 1500,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: 'Card spend >= $1500'
        },
        {
          tier_type: 'salary',
          balance_tier: '1',
          interest_rate: '2.50%',
          requirement_type: 'salary',
          min_spend: 0,
          min_salary: 2000,
          giro_count: 0,
          salary_credit: 'Y',
          cap_amount: 100000,
          remarks: 'Salary credit >= $2000'
        },
        {
          tier_type: 'payment',
          balance_tier: '1',
          interest_rate: '0.90%',
          requirement_type: 'payment',
          min_spend: 0,
          min_salary: 0,
          giro_count: 3,
          salary_credit: 'N',
          cap_amount: 100000,
          remarks: '3 bill payments >= $30 each'
        },
        {
          tier_type: 'extra',
          balance_tier: '1',
          interest_rate: '0.60%',
          requirement_type: 'extra',
          min_spend: 0,
          min_salary: 0,
          giro_count: 0,
          salary_credit: 'N',
          cap_amount: 999999,
          remarks: 'Extra interest above $100k'
        }
      ],
      features: [
        'Up to 4.1% p.a. interest on your savings',
        'Tiered base interest rates',
        'Multiple bonus interest categories',
        'Extra interest for balances above $100K'
      ]
    }
  ], []);
  
  const getBankById = (bankId) => {
    return banks.find(bank => bank.id === bankId);
  };
  
  const toggleBankSelection = (bankId) => {
    setSelectedBanks(prev => {
      if (prev.includes(bankId)) {
        return prev.filter(id => id !== bankId);
      } else {
        return [...prev, bankId];
      }
    });
  };
  
  // Format number with commas
  const formatNumber = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate bank interest based on SmartSaver logic
  const calculateBankInterest = (depositAmount, bankInfo, requirements) => {
    let totalInterest = 0;
    const breakdown = [];
    
    // Helper function to add tier
    const addTier = (amount, rate, description = "") => {
      const interest = amount * rate;
      breakdown.push({
        amount_in_tier: parseFloat(amount),
        tier_rate: parseFloat(rate),
        tier_interest: interest,
        monthly_interest: interest / 12,
        description: description.trim()
      });
      return interest;
    };
    
    // Process UOB One
    if (bankInfo.id === 'uob-one') {
      // Salary + Spend tier calculation
      if (requirements.hasSalary && requirements.cardSpend >= 500) {
        let remainingAmount = depositAmount;
        
        // First $75K with salary + spend (3.00%)
        const firstTier = bankInfo.tiers.find(t => t.tier_type === 'salary' && t.balance_tier === 'First $75K');
        if (firstTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          const tierRate = parseFloat(firstTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "First $75K with salary + spend");
          remainingAmount -= tierAmount;
        }
        
        // Next $50K with salary + spend (4.50%)
        if (remainingAmount > 0) {
          const secondTier = bankInfo.tiers.find(t => t.tier_type === 'salary' && t.balance_tier === 'Next $50K');
          if (secondTier) {
            const tierAmount = Math.min(remainingAmount, 50000);
            const tierRate = parseFloat(secondTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(tierAmount, tierRate, "Next $50K with salary + spend");
            remainingAmount -= tierAmount;
          }
        }
        
        // Next $25K with salary + spend (6.00%) - Hardcoded since it's missing from the data
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          const tierRate = 0.06; // 6.00%
          totalInterest += addTier(tierAmount, tierRate, "Next $25K with salary + spend");
          remainingAmount -= tierAmount;
        }
        
        // Any remaining amount gets base interest
        if (remainingAmount > 0) {
          const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
          if (baseTier) {
            const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(remainingAmount, baseRate, "Remaining amount (base interest)");
          }
        }
      }
      // Spend only tier calculation
      else if (requirements.cardSpend >= 500) {
        let remainingAmount = depositAmount;
        
        // First $75K with card spend only (0.65%)
        const spendTier = bankInfo.tiers.find(t => t.tier_type === 'spend_only' && t.balance_tier === '1');
        if (spendTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          const tierRate = parseFloat(spendTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "First $75K with card spend only");
          remainingAmount -= tierAmount;
        }
        
        // Next $50K with card spend only (0.05%)
        if (remainingAmount > 0) {
          const secondTier = bankInfo.tiers.find(t => t.tier_type === 'spend_only' && t.balance_tier === '2');
          if (secondTier) {
            const tierAmount = Math.min(remainingAmount, 50000);
            const tierRate = parseFloat(secondTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(tierAmount, tierRate, "Next $50K with card spend only");
            remainingAmount -= tierAmount;
          }
        }
        
        // Any remaining amount gets base interest
        if (remainingAmount > 0) {
          const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
          if (baseTier) {
            const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(remainingAmount, baseRate, "Remaining amount (base interest)");
          }
        }
      }
      // GIRO tier calculation
      else if (requirements.giroCount >= 3) {
        let remainingAmount = depositAmount;
        
        // First $75K with GIRO payments (2.00%)
        const giroTier = bankInfo.tiers.find(t => t.tier_type === 'giro' && t.balance_tier === 'First $75K');
        if (giroTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          const tierRate = parseFloat(giroTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "First $75K with GIRO payments");
          remainingAmount -= tierAmount;
        }
        
        // Next $50K with GIRO payments (3.00%)
        if (remainingAmount > 0) {
          const secondTier = bankInfo.tiers.find(t => t.tier_type === 'giro' && t.balance_tier === 'Next $50K');
          if (secondTier) {
            const tierAmount = Math.min(remainingAmount, 50000);
            const tierRate = parseFloat(secondTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(tierAmount, tierRate, "Next $50K with GIRO payments");
            remainingAmount -= tierAmount;
          }
        }
        
        // Any remaining amount gets base interest
        if (remainingAmount > 0) {
          const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
          if (baseTier) {
            const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(remainingAmount, baseRate, "Remaining amount (base interest)");
          }
        }
      }
      // Base interest only
      else {
        const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
        if (baseTier) {
          const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(depositAmount, baseRate, "Base interest");
        }
      }
    }
    
    // Process OCBC 360
    else if (bankInfo.id === 'ocbc-360') {
      // Start with base interest on entire amount
      const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
      if (baseTier) {
        const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
        totalInterest += addTier(depositAmount, baseRate, "Base interest");
      }
      
      // Salary tier calculation
      if (requirements.hasSalary && requirements.salaryAmount >= 1800) {
        let remainingAmount = depositAmount;
        
        // First $75K with salary (2.00%)
        const firstTier = bankInfo.tiers.find(t => t.tier_type === 'salary' && t.balance_tier === '1');
        if (firstTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          const tierRate = parseFloat(firstTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "First $75K with salary");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with salary (4.00%)
        const secondTier = bankInfo.tiers.find(t => t.tier_type === 'salary' && t.balance_tier === '2');
        if (secondTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          const tierRate = parseFloat(secondTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Next $25K with salary");
        }
      }
      
      // Spend tier calculation
      if (requirements.cardSpend >= 500) {
        let remainingAmount = depositAmount;
        
        // First $75K with spend (0.60%)
        const firstTier = bankInfo.tiers.find(t => t.tier_type === 'spend' && t.balance_tier === '1');
        if (firstTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          const tierRate = parseFloat(firstTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "First $75K with card spend");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with spend (0.60%)
        const secondTier = bankInfo.tiers.find(t => t.tier_type === 'spend' && t.balance_tier === '2');
        if (secondTier && remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          const tierRate = parseFloat(secondTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Next $25K with card spend");
        }
      }
      
      // Insurance tier calculation
      if (requirements.hasInsurance) {
        let remainingAmount = depositAmount;
        
        // First $75K with insurance (1.20%)
        const firstTierRate = 0.012; // 1.20%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          totalInterest += addTier(tierAmount, firstTierRate, "First $75K with insurance");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with insurance (2.40%)
        const secondTierRate = 0.024; // 2.40%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          totalInterest += addTier(tierAmount, secondTierRate, "Next $25K with insurance");
        }
      }
      
      // Increased balance calculation
      if (increasedBalance) {
        let remainingAmount = depositAmount;
        
        // First $75K with increased balance (1.20%)
        const firstTierRate = 0.012; // 1.20%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          totalInterest += addTier(tierAmount, firstTierRate, "First $75K with increased balance");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with increased balance (2.40%)
        const secondTierRate = 0.024; // 2.40%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          totalInterest += addTier(tierAmount, secondTierRate, "Next $25K with increased balance");
        }
      }
      
      // Investment tier calculation
      if (requirements.hasInvestments) {
        let remainingAmount = depositAmount;
        
        // First $75K with investment (1.20%)
        const firstTierRate = 0.012; // 1.20%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          totalInterest += addTier(tierAmount, firstTierRate, "First $75K with investment");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with investment (2.40%)
        const secondTierRate = 0.024; // 2.40%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          totalInterest += addTier(tierAmount, secondTierRate, "Next $25K with investment");
        }
      }
      
      // Grew wealth calculation
      if (grewWealth) {
        let remainingAmount = depositAmount;
        
        // First $75K with grew wealth (2.40%)
        const firstTierRate = 0.024; // 2.40%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 75000);
          totalInterest += addTier(tierAmount, firstTierRate, "First $75K with grew wealth");
          remainingAmount -= tierAmount;
        }
        
        // Next $25K with grew wealth (4.80%)
        const secondTierRate = 0.048; // 4.80%
        if (remainingAmount > 0) {
          const tierAmount = Math.min(remainingAmount, 25000);
          totalInterest += addTier(tierAmount, secondTierRate, "Next $25K with grew wealth");
        }
      }
    }
    
    // Process SC BonusSaver
    else if (bankInfo.id === 'sc-bonussaver') {
      // Start with base interest on entire amount
      const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
      if (baseTier) {
        const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
        totalInterest += addTier(depositAmount, baseRate, "Base interest");
      }
      
      // Salary tier calculation
      if (requirements.hasSalary && requirements.salaryAmount >= 3000) {
        const salaryTier = bankInfo.tiers.find(t => t.tier_type === 'salary');
        if (salaryTier) {
          const tierAmount = Math.min(depositAmount, 100000);
          const tierRate = parseFloat(salaryTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Salary credit bonus");
        }
      }
      
      // Spend tier calculation
      if (requirements.cardSpend >= 1000) {
        const spendTier = bankInfo.tiers.find(t => t.tier_type === 'spend');
        if (spendTier) {
          const tierAmount = Math.min(depositAmount, 100000);
          const tierRate = parseFloat(spendTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Card spend bonus");
        }
      }
      
      // Insurance tier calculation
      if (requirements.hasInsurance) {
        const insureTier = bankInfo.tiers.find(t => t.tier_type === 'insure');
        if (insureTier) {
          const tierAmount = Math.min(depositAmount, 100000);
          const tierRate = parseFloat(insureTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Insurance purchase bonus");
        }
      }
      
      // Investment tier calculation
      if (requirements.hasInvestments) {
        const investTier = bankInfo.tiers.find(t => t.tier_type === 'invest');
        if (investTier) {
          const tierAmount = Math.min(depositAmount, 100000);
          const tierRate = parseFloat(investTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Investment bonus");
        }
      }
      
      // Bill payment tier calculation
      if (requirements.giroCount >= 3) {
        const billTier = bankInfo.tiers.find(t => t.tier_type === 'bill');
        if (billTier) {
          const tierAmount = Math.min(depositAmount, 100000);
          const tierRate = parseFloat(billTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(tierAmount, tierRate, "Bill payment bonus");
        }
      }
    }
    
    // Process DBS Multiplier
    else if (bankInfo.id === 'dbs-multiplier') {
      // Get base interest rate
      const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
      const baseRate = baseTier ? parseFloat(baseTier.interest_rate.replace('%', '')) / 100 : 0.0005;
      
      if (requirements.hasSalary) {
        // Count categories
        let categoryCount = 1; // Salary is already 1 category
        if (requirements.cardSpend >= 500) categoryCount++;
        if (requirements.hasInvestments) categoryCount++;
        if (requirements.hasInsurance) categoryCount++;
        if (requirements.hasHomeLoan) categoryCount++;
        
        // Calculate total eligible transaction amount
        let transactionAmount = requirements.salaryAmount;
        if (requirements.cardSpend >= 500) transactionAmount += requirements.cardSpend;
        if (requirements.hasInvestments) transactionAmount += requirements.investmentAmount;
        if (requirements.hasInsurance) transactionAmount += requirements.insuranceAmount;
        if (requirements.hasHomeLoan) transactionAmount += requirements.homeLoanAmount;
        
        // Apply bonus interest based on categories
        if (categoryCount >= 1) {
          // First $50,000 with 1 category gets 1.80% bonus interest
          const bonusAmount = Math.min(depositAmount, 50000);
          const bonusRate = 0.018; // 1.80%
          totalInterest += addTier(bonusAmount, bonusRate, 
            `Bonus Interest (Income + ${categoryCount - 1} categories, $${transactionAmount.toFixed(2)} transactions)`);
          
          // Apply base interest only to the amount above the bonus cap
          const remainingAmount = depositAmount - bonusAmount;
          if (remainingAmount > 0) {
            totalInterest += addTier(remainingAmount, baseRate, "Base Interest (Amount Above Cap)");
          }
        } else {
          // If no categories apply, use base interest on entire amount
          totalInterest += addTier(depositAmount, baseRate, "Base interest");
        }
      } else {
        // If no salary, use base interest on entire amount
        totalInterest += addTier(depositAmount, baseRate, "Base interest");
      }
    }
    // Process BOC SmartSaver
    else if (bankInfo.id === 'boc-smartsaver') {
      // Calculate base interest based on tiered structure
      let remainingAmount = depositAmount;
      let baseInterest = 0;
      
      // Below $5K tier
      const tier1 = bankInfo.tiers.find(t => t.tier_type === 'base' && t.balance_tier === 'Below $5K');
      if (tier1 && remainingAmount > 0) {
        const tierAmount = Math.min(remainingAmount, 5000);
        const tierRate = parseFloat(tier1.interest_rate.replace('%', '')) / 100;
        baseInterest += addTier(tierAmount, tierRate, "Base interest for balance below $5K");
        remainingAmount -= tierAmount;
      }
      
      // $5K to below $20K tier
      if (remainingAmount > 0) {
        const tier2 = bankInfo.tiers.find(t => t.tier_type === 'base' && t.balance_tier === '$5K to below $20K');
        if (tier2) {
          const tierAmount = Math.min(remainingAmount, 15000);
          const tierRate = parseFloat(tier2.interest_rate.replace('%', '')) / 100;
          baseInterest += addTier(tierAmount, tierRate, "Base interest for $5K to below $20K");
          remainingAmount -= tierAmount;
        }
      }
      
      // $20K to below $50K tier
      if (remainingAmount > 0) {
        const tier3 = bankInfo.tiers.find(t => t.tier_type === 'base' && t.balance_tier === '$20K to below $50K');
        if (tier3) {
          const tierAmount = Math.min(remainingAmount, 30000);
          const tierRate = parseFloat(tier3.interest_rate.replace('%', '')) / 100;
          baseInterest += addTier(tierAmount, tierRate, "Base interest for $20K to below $50K");
          remainingAmount -= tierAmount;
        }
      }
      
      // $50K to below $100K tier
      if (remainingAmount > 0) {
        const tier4 = bankInfo.tiers.find(t => t.tier_type === 'base' && t.balance_tier === '$50K to below $100K');
        if (tier4) {
          const tierAmount = Math.min(remainingAmount, 50000);
          const tierRate = parseFloat(tier4.interest_rate.replace('%', '')) / 100;
          baseInterest += addTier(tierAmount, tierRate, "Base interest for $50K to below $100K");
          remainingAmount -= tierAmount;
        }
      }
      
      // $100K and above tier
      if (remainingAmount > 0) {
        const tier5 = bankInfo.tiers.find(t => t.tier_type === 'base' && t.balance_tier === '$100K and above');
        if (tier5) {
          const tierRate = parseFloat(tier5.interest_rate.replace('%', '')) / 100;
          baseInterest += addTier(remainingAmount, tierRate, "Base interest for $100K and above");
        }
      }
      
      totalInterest += baseInterest;
      
      // Calculate bonus interest
      const bonusAmount = Math.min(depositAmount, 100000); // Bonus interest applies to first $100K
      
      // Wealth bonus (Insurance)
      if (requirements.hasInsurance) {
        const wealthTier = bankInfo.tiers.find(t => t.tier_type === 'wealth');
        if (wealthTier) {
          const tierRate = parseFloat(wealthTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(bonusAmount, tierRate, "Insurance purchase bonus");
        }
      }
      
      // Spend bonus
      if (requirements.cardSpend >= 500) {
        // Card spend $500-$1499
        if (requirements.cardSpend < 1500) {
          const spendTier1 = bankInfo.tiers.find(t => t.tier_type === 'spend' && t.balance_tier === '1');
          if (spendTier1) {
            const tierRate = parseFloat(spendTier1.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(bonusAmount, tierRate, "Card spend $500-$1499");
          }
        } 
        // Card spend >= $1500
        else {
          const spendTier2 = bankInfo.tiers.find(t => t.tier_type === 'spend' && t.balance_tier === '2');
          if (spendTier2) {
            const tierRate = parseFloat(spendTier2.interest_rate.replace('%', '')) / 100;
            totalInterest += addTier(bonusAmount, tierRate, "Card spend >= $1500");
          }
        }
      }
      
      // Salary bonus
      if (requirements.hasSalary && requirements.salaryAmount >= 2000) {
        const salaryTier = bankInfo.tiers.find(t => t.tier_type === 'salary');
        if (salaryTier) {
          const tierRate = parseFloat(salaryTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(bonusAmount, tierRate, "Salary credit >= $2000");
        }
      }
      
      // Payment bonus (Bill payments)
      if (requirements.giroCount >= 3) {
        const paymentTier = bankInfo.tiers.find(t => t.tier_type === 'payment');
        if (paymentTier) {
          const tierRate = parseFloat(paymentTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(bonusAmount, tierRate, "3 bill payments >= $30 each");
        }
      }
      
      // Extra interest for amount above $100K
      if (depositAmount > 100000) {
        const extraAmount = depositAmount - 100000;
        const extraTier = bankInfo.tiers.find(t => t.tier_type === 'extra');
        if (extraTier) {
          const tierRate = parseFloat(extraTier.interest_rate.replace('%', '')) / 100;
          totalInterest += addTier(extraAmount, tierRate, "Extra interest above $100K");
        }
      }
    }
    // Default case for any other bank
    else {
      // Start with base interest on entire amount
      const baseTier = bankInfo.tiers.find(t => t.tier_type === 'base');
      if (baseTier) {
        const baseRate = parseFloat(baseTier.interest_rate.replace('%', '')) / 100;
        totalInterest += addTier(depositAmount, baseRate, "Base interest");
      }
    }
    
    return {
      total_interest: totalInterest,
      breakdown: breakdown
    };
  };
  
  // Calculate results for all banks
  const calculateResults = () => {
    const requirements = {
      hasSalary,
      salaryAmount,
      cardSpend,
      giroCount,
      hasInsurance,
      hasInvestments,
      increasedBalance,
      grewWealth,
      insuranceAmount: hasInsurance ? insuranceAmount : 0,
      investmentAmount: hasInvestments ? investmentAmount : 0,
      hasHomeLoan,
      homeLoanAmount: hasHomeLoan ? homeLoanAmount : 0
    };
    
    const results = {};
    
    banks.forEach(bank => {
      const bankResults = calculateBankInterest(depositAmount, bank, requirements);
      
      results[bank.id] = {
        bankId: bank.id,
        monthlyInterest: bankResults.total_interest / 12,
        annualInterest: bankResults.total_interest,
        breakdown: bankResults.breakdown
      };
    });
    
    setCalculationResults(results);
    setHasCalculated(true);
    
    // Collapse both sections after calculation
    setIsBasicRequirementsOpen(false);
    setIsAdvancedRequirementsOpen(false);
  };
  
  // Get comparison results for selected banks
  const getComparisonResults = () => {
    return selectedBanks.map(bankId => ({
      bankId,
      monthlyPayment: calculationResults[bankId]?.monthlyInterest || 0,
      totalInterest: calculationResults[bankId]?.annualInterest || 0,
      totalCost: depositAmount + (calculationResults[bankId]?.annualInterest || 0),
      amortizationSchedule: []
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">🏦 SmartSaverSG</h1>
        <p className="text-lg text-muted-foreground">Maximize Your Savings with Bank Interest Calculator</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Step 1: Enter Savings Amount */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Enter Your Savings Amount</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Amount to calculate interest for ($)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Selected Amount: ${formatNumber(depositAmount)}
              </p>
            </div>
          </div>

          {/* Step 2: Banking Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Enter Your Banking Details</h2>
            
            {/* Basic Requirements - Collapsible */}
            <div className="border rounded-lg mb-4 overflow-hidden">
              <button 
                onClick={() => setIsBasicRequirementsOpen(!isBasicRequirementsOpen)}
                className="w-full p-4 text-left font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span>Basic Requirements</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`collapsible-icon ${isBasicRequirementsOpen ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div className={`collapsible-content ${isBasicRequirementsOpen ? 'open' : ''}`}>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="has-salary"
                        checked={hasSalary}
                        onChange={(e) => setHasSalary(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="has-salary" className="text-sm font-medium">
                        Credit Salary to Bank Account
                      </label>
                    </div>
                    
                    {hasSalary && (
                      <div className="ml-6 mb-2">
                        <label className="block text-sm mb-1">
                          Monthly Salary Amount ($)
                        </label>
                        <input
                          type="number"
                          value={salaryAmount}
                          onChange={(e) => setSalaryAmount(Number(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Selected Salary Amount: ${formatNumber(salaryAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Card Spend per Month ($)
                      </label>
                      <input
                        type="number"
                        value={cardSpend}
                        onChange={(e) => setCardSpend(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected Card Spend: ${formatNumber(cardSpend)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Number of Bill Payments / GIRO
                      </label>
                      <input
                        type="number"
                        value={giroCount}
                        onChange={(e) => setGiroCount(Number(e.target.value))}
                        min="0"
                        max="10"
                        className="w-full p-2 border rounded"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected Bill Payments: {giroCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced Requirements - Collapsible and closed by default */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                onClick={() => setIsAdvancedRequirementsOpen(!isAdvancedRequirementsOpen)}
                className="w-full p-4 text-left font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span>Advanced Requirements (Optional)</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`collapsible-icon ${isAdvancedRequirementsOpen ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div className={`collapsible-content ${isAdvancedRequirementsOpen ? 'open' : ''}`}>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="has-insurance"
                        checked={hasInsurance}
                        onChange={(e) => setHasInsurance(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="has-insurance" className="text-sm font-medium">
                        Have Insurance Products
                      </label>
                    </div>
                    
                    {hasInsurance && (
                      <div className="ml-6 mb-2">
                        <label className="block text-sm mb-1">
                          Monthly Insurance Premium Amount ($)
                        </label>
                        <input
                          type="number"
                          value={insuranceAmount}
                          onChange={(e) => setInsuranceAmount(Number(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="has-investments"
                        checked={hasInvestments}
                        onChange={(e) => setHasInvestments(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="has-investments" className="text-sm font-medium">
                        Have Investments
                      </label>
                    </div>
                    
                    {hasInvestments && (
                      <div className="ml-6 mb-2">
                        <label className="block text-sm mb-1">
                          Monthly Investment Amount ($)
                        </label>
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="has-home-loan"
                        checked={hasHomeLoan}
                        onChange={(e) => setHasHomeLoan(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="has-home-loan" className="text-sm font-medium">
                        Have Home Loan
                      </label>
                    </div>
                    
                    {hasHomeLoan && (
                      <div className="ml-6 mb-2">
                        <label className="block text-sm mb-1">
                          Monthly Home Loan Installment Amount ($)
                        </label>
                        <input
                          type="number"
                          value={homeLoanAmount}
                          onChange={(e) => setHomeLoanAmount(Number(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="increased-balance"
                        checked={increasedBalance}
                        onChange={(e) => setIncreasedBalance(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="increased-balance" className="text-sm font-medium">
                        [OCBC-Specific] Increased Account Balance
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="grew-wealth"
                        checked={grewWealth}
                        onChange={(e) => setGrewWealth(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="grew-wealth" className="text-sm font-medium">
                        [OCBC-Specific] Grew Wealth
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={calculateResults}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: '#0033A0', color: 'white' }}
          >
            Calculate Interest Rates
          </button>
        </div>
        
        <div>
          {/* Step 3: Results */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 3: Calculate and Compare</h2>
            
            {!hasCalculated ? (
              <div className="border p-6 rounded-lg text-center">
                <p className="text-lg mb-2">Enter your details and click "Calculate Interest Rates"</p>
                <p className="text-muted-foreground">
                  You'll see detailed breakdowns for each bank and be able to compare interest rates.
                </p>
              </div>
            ) : (
              <div>
                {/* Sort banks by interest rate (highest to lowest) */}
                {Object.values(calculationResults)
                  .sort((a, b) => b.annualInterest - a.annualInterest)
                  .map((result, index) => {
                    const bank = getBankById(result.bankId);
                    const isOptimal = index === 0;
                    
                    return (
                      <div 
                        key={result.bankId}
                        className={`border rounded-lg mb-4 overflow-hidden ${
                          isOptimal ? 'border-primary border-2' : ''
                        }`}
                      >
                        {isOptimal && (
                          <div className="bg-primary text-black py-1 px-4 text-center">
                            🏆 Optimal Choice
                          </div>
                        )}
                        
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: bank.color }}
                            >
                              {bank.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{bank.name}</h3>
                            </div>
                            
                            <div className="ml-auto">
                              <input
                                type="checkbox"
                                id={`compare-${bank.id}`}
                                checked={selectedBanks.includes(bank.id)}
                                onChange={() => toggleBankSelection(bank.id)}
                                className="mr-1"
                              />
                              <label htmlFor={`compare-${bank.id}`} className="text-xs">
                                Compare
                              </label>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly Interest</p>
                              <p className="text-2xl font-bold">${result.monthlyInterest.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Annual Interest</p>
                              <p className="text-2xl font-bold">${result.annualInterest.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {result.breakdown && result.breakdown.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Interest Breakdown:</p>
                              <ul className="text-sm space-y-1">
                                {result.breakdown.map((tier, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                      ${tier.amount_in_tier.toFixed(2)} at {(tier.tier_rate * 100).toFixed(2)}% - {tier.description}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-1">Key Features</p>
                            <ul className="text-sm space-y-1">
                              {bank.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBanks.length > 1 && hasCalculated && (
        <div className="mt-8">
          <ComparisonChart
            results={getComparisonResults()}
            loanType="savings"
            getBankById={getBankById}
          />
        </div>
      )}

      {/* Add chat components - only show after calculation */}
      {hasCalculated && (
        <>
          <ChatButton 
            onClick={() => setIsChatOpen(true)} 
            isOpen={isChatOpen} 
          />
          
          <ChatWindow 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
            userInputs={{
              depositAmount,
              hasSalary,
              salaryAmount,
              cardSpend,
              giroCount,
              hasInsurance,
              hasInvestments,
              increasedBalance,
              grewWealth
            }}
            calculationResults={calculationResults}
            selectedBanks={selectedBanks}
          />
        </>
      )}

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2023 SmartSaverSG. All rates are for demonstration purposes only.</p>
      </footer>
    </div>
  );
}

export default App; 