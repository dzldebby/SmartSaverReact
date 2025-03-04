import React from 'react';

const InterestBreakdown = ({ breakdown = [] }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="text-center py-3">
        <p className="text-gray-500 dark:text-gray-400">No breakdown available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
      {breakdown.map((item, index) => {
        if (item.isHeader) {
          return (
            <p key={index} className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              {item.description}
            </p>
          );
        }
        
        if (item.isTotal) {
          return (
            <div key={index} className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <span className="font-medium">{item.description}</span>
              <span className="font-medium">${item.tierInterest.toFixed(2)}</span>
            </div>
          );
        }

        return (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.description}</span>
            <span>${item.tierInterest.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default InterestBreakdown; 