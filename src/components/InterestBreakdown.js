import React from 'react';

const InterestBreakdown = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No breakdown available.</p>
      </div>
    );
  }

  // Check if we're using the old format (with isHeader/isTotal properties)
  const isOldFormat = breakdown.some(item => item.isHeader || item.isTotal);

  if (isOldFormat) {
    return (
      <div className="bg-white/50 rounded-lg p-3">
        {breakdown.map((item, index) => {
          if (item.isHeader) {
            return (
              <p key={index} className="font-medium text-gray-700 mb-2">
                {item.description}
              </p>
            );
          }
          
          if (item.isTotal) {
            return (
              <div key={index} className="flex justify-between border-t border-gray-200 pt-2 mt-2">
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
  }

  // New format (with period.title and period.tiers)
  return (
    <div className="bg-white/50 rounded-lg p-3">
      {breakdown.map((period, index) => (
        <div key={index}>
          <p key={`title-${index}`} className="font-medium text-gray-700 mb-2">
            {period.title}
          </p>
          
          {period.tiers.map((tier, tierIndex) => (
            <div key={`tier-${index}-${tierIndex}`} className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span>{tier.description}</span>
              <span className="font-medium">{tier.rate}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default InterestBreakdown; 