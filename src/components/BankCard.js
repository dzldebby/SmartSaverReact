"use client";

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

const BankCard = ({
  bank,
  loanType,
  calculationResult,
  selected,
  onToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getBankRate = () => {
    if (!bank) return 0;
    
    switch (loanType) {
      case 'mortgage':
        return bank.rates.mortgage;
      case 'personal':
        return bank.rates.personal;
      case 'auto':
        return bank.rates.auto;
      case 'savings':
        return bank.rates.savings;
      default:
        return 0;
    }
  };

  const getLoanTypeName = () => {
    switch (loanType) {
      case 'mortgage':
        return 'Mortgage';
      case 'personal':
        return 'Personal Loan';
      case 'auto':
        return 'Auto Loan';
      case 'savings':
        return 'Savings';
      default:
        return 'Loan';
    }
  };

  if (!bank) return null;

  return (
    <Card
      className={`relative transition-all duration-300 ${
        selected ? 'ring-2 ring-primary' : ''
      } ${isHovered ? 'shadow-md' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 right-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`compare-${bank.id}`}
            checked={selected}
            onChange={() => onToggle(bank.id)}
          />
          <Label htmlFor={`compare-${bank.id}`} className="text-xs">
            Compare
          </Label>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: bank.color || '#888888' }}
          >
            {bank.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{bank.name}</h3>
            <p className="text-sm text-muted-foreground">{getLoanTypeName()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Interest Rate</p>
            <p className="text-2xl font-bold">{getBankRate()}%</p>
          </div>

          {calculationResult && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-xl font-semibold">
                  ${calculationResult.monthlyPayment.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {loanType === 'savings' ? 'Total Interest Earned' : 'Total Interest'}
                </p>
                <p className="text-xl font-semibold">
                  ${calculationResult.totalInterest.toFixed(2)}
                </p>
              </div>
            </>
          )}

          <div>
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
      </CardContent>
    </Card>
  );
};

export default BankCard; 