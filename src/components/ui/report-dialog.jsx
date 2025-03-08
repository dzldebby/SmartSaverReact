import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../ToastProvider';

const ISSUE_TYPES = [
  'Interest rate calculation error',
  'Missing bank feature',
  'Missing condition',
  'Outdated information',
  'Other'
];

const BANKS = [
  'DBS',
  'OCBC',
  'UOB',
  'Standard Chartered',
  'Chocolate',
  'BOC'
];

export const ReportCalculationDialog = ({ trigger }) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [bank, setBank] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setIssueType('');
    setDescription('');
    setBank('');
    setIsSuccess(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog is closed
      setTimeout(() => resetForm(), 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store the report in Supabase
      const { data, error } = await supabase
        .from('calculation_reports')
        .insert([
          {
            issue_type: issueType,
            description,
            bank,
            reported_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      // Show success toast
      toast({
        title: 'Report Submitted',
        description: 'Thank you for your feedback. We will look into this issue.',
        type: 'success',
        duration: 5000
      });

      // Show success state in dialog
      setIsSuccess(true);
      
      // Close dialog automatically after 3 seconds
      setTimeout(() => {
        setOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your report. Please try again.',
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Report Calculation Issue</Dialog.Title>
            <Dialog.Close className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </Dialog.Close>
          </div>
          
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Report Submitted!</h3>
              <p className="text-gray-500 mb-6">Thank you for your feedback. We will look into this issue.</p>
              <p className="text-sm text-gray-400">This window will close automatically...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="issueType" className="block text-sm font-medium mb-1">
                  Issue Type *
                </label>
                <select
                  id="issueType"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select an issue type</option>
                  {ISSUE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="bank" className="block text-sm font-medium mb-1">
                  Related Bank *
                </label>
                <select
                  id="bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a bank</option>
                  {BANKS.map((bankName) => (
                    <option key={bankName} value={bankName}>{bankName}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                  placeholder="Please describe the issue in detail. Include any specific numbers or conditions that might be incorrect."
                />
              </div>
              
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="mr-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 