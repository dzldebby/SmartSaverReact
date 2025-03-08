import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar, X } from 'lucide-react';

// Sample data - replace with actual data from your API
const BANK_UPDATE_DATES = [
  { name: 'DBS', lastUpdated: new Date('2025-03-08') },
  { name: 'OCBC', lastUpdated: new Date('2025-03-08') },
  { name: 'UOB', lastUpdated: new Date('2025-03-08') },
  { name: 'Standard Chartered', lastUpdated: new Date('2025-03-08') },
  { name: 'POSB', lastUpdated: new Date('2025-03-08') },
  { name: 'Chocolate', lastUpdated: new Date('2025-03-08') }
];

// Find the most recent update date
const getMostRecentDate = () => {
  return new Date(Math.max(...BANK_UPDATE_DATES.map(bank => bank.lastUpdated)));
};

// Format date to abbreviated format (e.g., "Jun 5")
const formatDateAbbr = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Format date to full format (e.g., "June 5, 2024")
const formatDateFull = (date) => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const LastUpdatedRates = () => {
  const [open, setOpen] = useState(false);
  const mostRecentDate = getMostRecentDate();
  
  return (
    <div style={{ position: 'relative', zIndex: 40 }}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button 
            className="inline-flex items-center gap-1 text-xs bg-transparent hover:bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-transparent hover:border-gray-200"
            aria-label="View rates last updated information"
          >
            <Calendar size={14} className="text-purple-500 flex-shrink-0" />
            <span className="whitespace-nowrap">Updated {formatDateAbbr(mostRecentDate)}</span>
          </button>
        </Popover.Trigger>
        
        <Popover.Portal>
          <div style={{ position: 'fixed', zIndex: 9999 }}>
            <Popover.Content 
              className="bg-white rounded-lg shadow-xl w-72 overflow-hidden border border-gray-200"
              sideOffset={5}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Rate Information</h3>
                  <Popover.Close className="rounded-full p-1 hover:bg-white/20 focus:outline-none">
                    <X size={14} />
                  </Popover.Close>
                </div>
                <p className="text-xs text-purple-100 mt-1">Last updated: {formatDateFull(mostRecentDate)}</p>
              </div>
              
              <div className="max-h-64 overflow-y-auto p-3">
                <p className="text-xs text-gray-500 mb-2">Individual bank update dates:</p>
                <ul className="space-y-2">
                  {BANK_UPDATE_DATES.sort((a, b) => b.lastUpdated - a.lastUpdated).map((bank) => (
                    <li key={bank.name} className="flex justify-between text-sm py-1 border-b border-gray-100">
                      <span className="font-medium">{bank.name}</span>
                      <span className="text-gray-500">{formatDateAbbr(bank.lastUpdated)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Popover.Content>
          </div>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}; 