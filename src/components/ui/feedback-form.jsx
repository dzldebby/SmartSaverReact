import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ThumbsUp } from 'lucide-react';

export const FeedbackForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [satisfaction, setSatisfaction] = useState(0);
  const [npsScore, setNpsScore] = useState(null);
  const [openFeedback, setOpenFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleSubmit = async (e) => {
    console.log('Submit button clicked');
    e.preventDefault();
    console.log('Current state:', { satisfaction, npsScore, openFeedback });
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Submit feedback to Supabase
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { 
            satisfaction, 
            nps_score: npsScore, 
            open_feedback: openFeedback 
          }
        ]);
      
      if (error) {
        console.error('Error submitting feedback:', error);
        setSubmitError('Failed to submit feedback. Please try again.');
        return;
      }
      
      console.log('Feedback submitted successfully:', data);
      setSubmitted(true);
      console.log('Submitted state set to true');
      
      // Increased timeout to 3 seconds for better visibility
      setTimeout(() => {
        console.log('Closing feedback form');
        setIsVisible(false);
        setSubmitted(false);
        setSatisfaction(0);
        setNpsScore(null);
        setOpenFeedback('');
        setSubmitError(null);
      }, 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={() => {
          console.log('Opening feedback form');
          setIsVisible(true);
        }}
        className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-2"
      >
        <ThumbsUp size={20} />  Rate your experience
      </button>

      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            ref={formRef}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
          >
            {!submitted ? (
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Your Feedback</h2>
                
                {/* Satisfaction Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How satisfied are you with our calculator?
                  </label>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={(e) => {
                          console.log(`Rating ${rating} selected`);
                          setSatisfaction(rating);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          satisfaction === rating
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Not satisfied</span>
                    <span>Very satisfied</span>
                  </div>
                </div>

                {/* NPS Score */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How likely are you to recommend our calculator to others? (0-10)
                  </label>
                  <div className="flex flex-wrap justify-between gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={(e) => {
                          console.log(`NPS score ${score} selected`);
                          setNpsScore(score);
                        }}
                        className={`w-9 h-9 rounded flex items-center justify-center border ${
                          npsScore === score
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>
                </div>

                {/* Open-ended Feedback */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Any other feedback (Optional)?
                  </label>
                  <textarea
                    value={openFeedback}
                    onChange={(e) => setOpenFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Share your thoughts..."
                  />
                </div>

                {submitError && (
                  <div className="text-red-500 text-sm mt-2">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm font-medium text-white rounded ${
                      satisfaction === 0 || npsScore === null || isSubmitting
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={satisfaction === 0 || npsScore === null || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-500 text-4xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank you for your feedback!</h3>
                <p className="text-gray-600">Your input helps us improve our calculator.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 