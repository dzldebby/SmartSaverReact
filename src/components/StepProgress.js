export default function StepProgress({ currentStep }) {
    const steps = [
      { id: 1, name: 'Enter Details' },
      { id: 2, name: 'View Results' }
    ];
    
    return (
      <div className="w-full mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} relative`}>
                <div className="flex items-center">
                  <div
                    className={`${
                      step.id <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    } h-8 w-8 rounded-full flex items-center justify-center`}
                  >
                    <span>{step.id}</span>
                  </div>
                  <span
                    className={`ml-4 text-sm font-medium ${
                      step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full flex">
                    <div
                      className={`h-0.5 ${
                        steps[stepIdx + 1].id <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  }