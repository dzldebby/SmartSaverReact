"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const ComparisonChart = ({ results, loanType, getBankById }) => {
  if (!results.length) return null;

  const formatData = (key) => {
    return results.map(result => {
      const bank = getBankById(result.bankId);
      return {
        name: bank?.name || result.bankId,
        value: result[key],
        color: bank?.color || '#888888'
      };
    });
  };

  const monthlyData = formatData('monthlyPayment');
  const interestData = formatData('totalInterest');
  const totalCostData = formatData('totalCost');

  // Prepare amortization schedule for line chart
  const amortizationData = [];
  const maxYears = Math.max(...results.map(r => r.amortizationSchedule?.length || 0));
  
  for (let i = 0; i < maxYears; i++) {
    const dataPoint = { year: i + 1 };
    
    results.forEach(result => {
      const bank = getBankById(result.bankId);
      const schedule = result.amortizationSchedule?.[i];
      if (schedule) {
        dataPoint[bank?.name || result.bankId] = schedule.remainingBalance;
      }
    });
    
    amortizationData.push(dataPoint);
  }

  return (
    <div className="transition-all duration-300">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Comparison Charts</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="monthly">Monthly Payment</TabsTrigger>
              <TabsTrigger value="interest">Interest</TabsTrigger>
              <TabsTrigger value="total">Total Cost</TabsTrigger>
              <TabsTrigger value="amortization">Amortization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="pt-2">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium mb-2">Monthly Payment Comparison</h3>
                  <div className="space-y-4">
                    {monthlyData.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${(item.value / Math.max(...monthlyData.map(d => d.value))) * 100}%`,
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interest" className="pt-2">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {loanType === 'savings' ? 'Total Interest Earned' : 'Total Interest Paid'}
                  </h3>
                  <div className="space-y-4">
                    {interestData.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${(item.value / Math.max(...interestData.map(d => d.value))) * 100}%`,
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="total" className="pt-2">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {loanType === 'savings' ? 'Final Balance' : 'Total Cost'}
                  </h3>
                  <div className="space-y-4">
                    {totalCostData.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${(item.value / Math.max(...totalCostData.map(d => d.value))) * 100}%`,
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="amortization" className="pt-2">
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium mb-2">Amortization Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    This chart shows how your loan balance decreases over time.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonChart; 