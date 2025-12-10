// components/Layout/TabNavigation.jsx
import React, { useState } from 'react';
import { Check } from 'lucide-react';

const TabNavigation = ({ 
  tabs = [], 
  activeTab, 
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false
}) => {
  const sizes = {
    sm: 'text-sm py-2 px-3',
    md: 'text-base py-3 px-4',
    lg: 'text-lg py-4 px-6'
  };

  // Default variant - underline style
  if (variant === 'default') {
    return (
      <div className="border-b border-gray-700/50">
        <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                disabled={tab.disabled}
                className={`
                  flex items-center gap-2 ${sizes[size]} font-medium 
                  transition-all whitespace-nowrap border-b-2 -mb-px
                  ${isActive
                    ? 'text-red-500 border-red-500'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                  }
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${fullWidth ? 'flex-1' : ''}
                `}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full font-semibold
                    ${isActive 
                      ? 'bg-red-600/20 text-red-500' 
                      : 'bg-gray-700 text-gray-400'
                    }
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // Pills variant
  if (variant === 'pills') {
    return (
      <nav className="flex gap-2 overflow-x-auto scrollbar-hide p-1 bg-gray-800/50 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex items-center gap-2 ${sizes[size]} rounded-lg
                transition-all whitespace-nowrap font-medium
                ${isActive
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${fullWidth ? 'flex-1' : ''}
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-semibold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-600 text-gray-300'
                  }
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex flex-col items-center gap-3 p-4 rounded-xl
                transition-all border-2
                ${isActive
                  ? 'bg-red-600/10 border-red-600 shadow-lg'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-red-500" />
                </div>
              )}
              {Icon && (
                <div className={`
                  p-3 rounded-lg
                  ${isActive ? 'bg-red-600/20' : 'bg-gray-700'}
                `}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
              )}
              <div className="text-center">
                <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {tab.label}
                </div>
                {tab.description && (
                  <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                )}
              </div>
              {tab.badge !== undefined && (
                <span className={`
                  absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-bold
                  ${isActive 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300'
                  }
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  // Segments variant (iOS style)
  if (variant === 'segments') {
    return (
      <div className="inline-flex bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex items-center gap-2 ${sizes[size]} rounded-md
                transition-all whitespace-nowrap font-medium
                ${isActive
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Vertical variant
  if (variant === 'vertical') {
    return (
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex items-center gap-3 ${sizes[size]} rounded-lg
                transition-all font-medium text-left
                ${isActive
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {Icon && (
                <div className={`
                  p-2 rounded-lg
                  ${isActive ? 'bg-white/10' : 'bg-gray-700'}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <div className="flex-1">
                <div>{tab.label}</div>
                {tab.description && (
                  <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                    {tab.description}
                  </div>
                )}
              </div>
              {tab.badge !== undefined && (
                <span className={`
                  text-xs px-2 py-1 rounded-full font-semibold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  return null;
};

// Tab Panel Component
export const TabPanel = ({ children, value, activeTab }) => {
  if (value !== activeTab) return null;

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
};

// Complete Tab System with Panels
export const TabSystem = ({ 
  tabs = [], 
  defaultTab,
  variant = 'default',
  renderContent
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="space-y-6">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant={variant}
      />
      <div>
        {renderContent(activeTab)}
      </div>
    </div>
  );
};

// Animated Tab Indicator (for custom implementations)
export const TabIndicator = ({ tabs, activeIndex }) => {
  return (
    <div className="relative">
      <div className="flex border-b border-gray-700">
        {tabs.map((tab, index) => (
          <div key={index} className="flex-1 text-center py-3">
            {tab}
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-0 h-0.5 bg-red-600 transition-all duration-300"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(activeIndex * 100) / tabs.length}%`
        }}
      />
    </div>
  );
};

// Step Navigation (for wizards/multi-step forms)
export const StepNavigation = ({ steps, currentStep, onStepClick }) => {
  return (
    <nav className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;
        const isClickable = step.clickable !== false;

        return (
          <React.Fragment key={index}>
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center gap-2 
                ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-bold transition-all
                ${isCompleted 
                  ? 'bg-green-600 text-white' 
                  : isActive 
                    ? 'bg-red-600 text-white ring-4 ring-red-600/30' 
                    : 'bg-gray-700 text-gray-400'
                }
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`
                text-sm font-medium whitespace-nowrap
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}>
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4
                ${isCompleted ? 'bg-green-600' : 'bg-gray-700'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default TabNavigation;