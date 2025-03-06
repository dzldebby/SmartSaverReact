import React from 'react';

const InterestBreakdown = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No breakdown available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 rounded-lg p-3">
      {breakdown.map((period, index) => (
        <div key={index}>
          <p key={index} className="font-medium text-gray-700 mb-2">
            {period.title}
          </p>
          
          {period.tiers.map((tier, index) => (
            <div key={index} className="flex justify-between border-t border-gray-200 pt-2 mt-2">
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