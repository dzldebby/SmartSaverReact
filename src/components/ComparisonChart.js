"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';

const CustomTooltip = ({ active, payload, label, formatter, prefix = "$", suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">
          {prefix}{formatter ? formatter(payload[0].value) : payload[0].value.toFixed(2)}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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

  // Prepare radar chart data
  const radarData = results.map(result => {
    const bank = getBankById(result.bankId);
    const name = bank?.name || result.bankId;
    
    // Normalize values for radar chart (0-100 scale)
    const maxMonthly = Math.max(...results.map(r => r.monthlyPayment));
    const maxInterest = Math.max(...results.map(r => r.totalInterest));
    const maxTotal = Math.max(...results.map(r => r.totalCost));
    
    // For loans, lower values are better; for savings, higher values are better
    const monthlyScore = loanType === 'savings' 
      ? (result.monthlyPayment / maxMonthly) * 100
      : 100 - ((result.monthlyPayment / maxMonthly) * 100);
      
    const interestScore = loanType === 'savings'
      ? (result.totalInterest / maxInterest) * 100
      : 100 - ((result.totalInterest / maxInterest) * 100);
      
    const totalScore = loanType === 'savings'
      ? (result.totalCost / maxTotal) * 100
      : 100 - ((result.totalCost / maxTotal) * 100);
    
    return {
      name,
      "Monthly Payment": monthlyScore,
      "Total Interest": interestScore,
      "Total Cost": totalScore,
      color: bank?.color || '#888888'
    };
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="transition-all duration-300"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="gradient-heading text-xl leading-normal">Comparison Charts</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="interest">Interest</TabsTrigger>
              <TabsTrigger value="total">Total</TabsTrigger>
              <TabsTrigger value="amortization">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px] flex flex-col">
                  <h3 className="text-lg font-medium mb-2 text-center">Overall Comparison</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {radarData.map((entry, index) => (
                        <Radar
                          key={index}
                          name={entry.name}
                          dataKey={Object.keys(entry).filter(key => key !== 'name' && key !== 'color')[0]}
                          stroke={entry.color}
                          fill={entry.color}
                          fillOpacity={0.6}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px] flex flex-col">
                  <h3 className="text-lg font-medium mb-2 text-center">
                    {loanType === 'savings' ? 'Interest Distribution' : 'Cost Distribution'}
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={loanType === 'savings' ? interestData : totalCostData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {(loanType === 'savings' ? interestData : totalCostData).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="pt-2">
              <div className="h-[300px]">
                <h3 className="text-lg font-medium mb-2 text-center">Monthly Payment Comparison</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={monthlyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'auto']} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                    <Bar dataKey="value" nameKey="name">
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="interest" className="pt-2">
              <div className="h-[300px]">
                <h3 className="text-lg font-medium mb-2 text-center">
                  {loanType === 'savings' ? 'Total Interest Earned' : 'Total Interest Paid'}
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={interestData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'auto']} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                    <Bar dataKey="value" nameKey="name">
                      {interestData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="total" className="pt-2">
              <div className="h-[300px]">
                <h3 className="text-lg font-medium mb-2 text-center">
                  {loanType === 'savings' ? 'Final Balance' : 'Total Cost'}
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={totalCostData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'auto']} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                    <Bar dataKey="value" nameKey="name">
                      {totalCostData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="amortization" className="pt-2">
              <div className="h-[300px]">
                <h3 className="text-lg font-medium mb-2 text-center">
                  {loanType === 'savings' ? 'Balance Growth Over Time' : 'Amortization Schedule'}
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={amortizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {results.map((result, index) => {
                      const bank = getBankById(result.bankId);
                      const name = bank?.name || result.bankId;
                      return (
                        <Line
                          key={index}
                          type="monotone"
                          dataKey={name}
                          stroke={bank?.color || '#888888'}
                          activeDot={{ r: 8 }}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComparisonChart; 