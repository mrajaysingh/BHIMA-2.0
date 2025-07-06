import React, { useState, useEffect } from 'react';
import { X, Check, Key, ArrowRight, Calendar, CreditCard, HelpCircle, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showRbaModal, setShowRbaModal] = useState(false);
  const [rbaAccessCode, setRbaAccessCode] = useState('');
  const [rbaPrefix, setRbaPrefix] = useState<'MDA' | 'RBM'>('RBM');
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Disable page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showPrefixDropdown && !target.closest('.prefix-dropdown')) {
        setShowPrefixDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPrefixDropdown]);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '$0',
      period: '/month',
      features: [
        '100 messages/month',
        'Basic AI responses',
        'Standard support',
        'Web access only'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: '$19',
      annualPrice: '$190',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Unlimited messages',
        'Advanced AI features',
        'Priority support',
        'Mobile app access',
        'Custom integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      period: '',
      features: [
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics',
        'White-label options',
        'API access'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleGetStarted = () => {
    if (selectedPlan) {
      // Handle plan selection logic here
      console.log('Selected plan:', selectedPlan, 'Billing:', billingCycle);
      onClose();
    }
  };

  const handleRbaAccess = () => {
    if (isValidAccessCode()) {
      // Handle RBA access code logic here
      console.log('RBA Access Code:', `${rbaPrefix}-${rbaAccessCode}`);
      setShowRbaModal(false);
      setRbaAccessCode('');
      setRbaPrefix('RBM');
      setShowPassword(false);
      onClose();
    }
  };

  const handleClearRba = () => {
    setRbaAccessCode('');
    setRbaPrefix('RBM');
    setShowPassword(false);
  };

  const handleBackToPricing = () => {
    setShowRbaModal(false);
    setRbaAccessCode('');
    setRbaPrefix('RBM');
    setShowPrefixDropdown(false);
    setShowPassword(false);
  };

  // Validate and format access code input
  const handleAccessCodeChange = (value: string) => {
    // Remove any non-alphanumeric characters
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '');
    
    // Convert to uppercase
    const upperValue = cleanValue.toUpperCase();
    
    // Get the expected length based on prefix
    const expectedLength = rbaPrefix === 'MDA' ? 7 : 8;
    
    // Limit to expected length
    const limitedValue = upperValue.slice(0, expectedLength);
    
    // Validate format: first 3 should be letters, rest should be numbers
    let formattedValue = '';
    for (let i = 0; i < limitedValue.length; i++) {
      if (i < 3) {
        // First 3 characters must be letters
        if (/[A-Z]/.test(limitedValue[i])) {
          formattedValue += limitedValue[i];
        }
      } else {
        // Rest must be numbers
        if (/[0-9]/.test(limitedValue[i])) {
          formattedValue += limitedValue[i];
        }
      }
    }
    
    setRbaAccessCode(formattedValue);
  };

  // Generate display value with masking
  const getDisplayValue = () => {
    if (!rbaAccessCode) return '';
    
    let display = '';
    for (let i = 0; i < rbaAccessCode.length; i++) {
      const char = rbaAccessCode[i];
      if (/[A-Z]/.test(char)) {
        // Letters are masked with *
        display += '*';
      } else if (/[0-9]/.test(char)) {
        // Numbers are masked with -
        display += '-';
      }
    }
    return display;
  };

  // Validate access code format
  const isValidAccessCode = () => {
    if (!rbaAccessCode) return false;
    
    const expectedLength = rbaPrefix === 'MDA' ? 7 : 8;
    if (rbaAccessCode.length !== expectedLength) return false;
    
    // Check first 3 are letters
    const firstThree = rbaAccessCode.slice(0, 3);
    if (!/^[A-Z]{3}$/.test(firstThree)) return false;
    
    // Check rest are numbers
    const rest = rbaAccessCode.slice(3);
    if (!/^[0-9]+$/.test(rest)) return false;
    
    return true;
  };

  const getPlanPrice = (plan: any) => {
    if (plan.id === 'enterprise') return plan.monthlyPrice;
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getAnnualSavings = (monthlyPrice: string, annualPrice: string) => {
    if (monthlyPrice === '$0' || monthlyPrice === 'Custom') return null;
    const monthly = parseInt(monthlyPrice.replace('$', ''));
    const annual = parseInt(annualPrice.replace('$', ''));
    const savings = (monthly * 12) - annual;
    return savings > 0 ? `Save $${savings}/year` : null;
  };

  // RBA Access Modal
  if (showRbaModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleBackToPricing}
        />
        
        <div className="relative w-full max-w-md rounded-2xl shadow-2xl transition-all duration-300 bg-black text-white border border-white">
          <div className="flex items-center justify-between p-4 border-b border-white">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-white" />
              <h2 className="text-xl font-bold">RBA Access Code</h2>
            </div>
            <button
              onClick={handleBackToPricing}
              className="p-2 rounded-full transition-colors duration-200 hover:bg-white hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-white mb-4">
              Enter your RBA access code to unlock special features and access to the platform.
            </p>
            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/20">
              <h4 className="text-sm font-semibold mb-2">Format Requirements:</h4>
              <ul className="text-xs space-y-1">
                <li>• <strong>MDA:</strong> 7 characters (3 letters + 4 numbers) - Example: ABC1234</li>
                <li>• <strong>RBM:</strong> 8 characters (3 letters + 5 numbers) - Example: ABC1234A</li>
                <li>• Letters are masked with <strong>*</strong>, numbers with <strong>-</strong></li>
                <li>• Only uppercase letters and numbers allowed</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                {/* Prefix Dropdown */}
                <div className="relative prefix-dropdown">
                  <button
                    type="button"
                    onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                    className="flex items-center space-x-2 px-3 py-3 bg-black border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-200 min-w-[80px]"
                  >
                    <span className="text-sm font-medium">{rbaPrefix}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPrefixDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showPrefixDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-black border border-white rounded-lg shadow-lg z-20">
                      <button
                        onClick={() => {
                          if (rbaPrefix !== 'MDA') {
                            setRbaAccessCode('');
                            setShowPassword(false);
                          }
                          setRbaPrefix('MDA');
                          setShowPrefixDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-white hover:text-black transition-colors duration-200 ${
                          rbaPrefix === 'MDA' ? 'bg-white text-black' : 'text-white'
                        }`}
                      >
                        MDA
                      </button>
                      <button
                        onClick={() => {
                          if (rbaPrefix !== 'RBM') {
                            setRbaAccessCode('');
                            setShowPassword(false);
                          }
                          setRbaPrefix('RBM');
                          setShowPrefixDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-white hover:text-black transition-colors duration-200 ${
                          rbaPrefix === 'RBM' ? 'bg-white text-black' : 'text-white'
                        }`}
                      >
                        RBM
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Access Code Input */}
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={showPassword ? rbaAccessCode : getDisplayValue()}
                    onChange={(e) => {
                      if (showPassword) {
                        // When eye is open, directly update the actual code
                        handleAccessCodeChange(e.target.value);
                      } else {
                        // When eye is closed, handle masked input
                        const inputValue = e.target.value;
                        const currentDisplay = getDisplayValue();
                        
                        // If user is typing, add to the actual code
                        if (inputValue.length > currentDisplay.length) {
                          const newChar = inputValue.slice(-1);
                          const newCode = rbaAccessCode + newChar;
                          handleAccessCodeChange(newCode);
                        } else if (inputValue.length < currentDisplay.length) {
                          // If user is deleting, remove from the actual code
                          const newCode = rbaAccessCode.slice(0, -1);
                          setRbaAccessCode(newCode);
                        }
                      }
                    }}
                    placeholder={`${rbaPrefix === 'MDA' ? 'ABC1234' : 'ABC1234A'} (${rbaPrefix === 'MDA' ? '7' : '8'} chars)`}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-black border border-white text-white placeholder-white/50 focus:border-white focus:outline-none transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClearRba}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-black hover:bg-white/80"
                >
                  Clear
                </button>
                <button
                  onClick={handleBackToPricing}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-black hover:bg-white/80"
                >
                  Back
                </button>
                <button
                  onClick={handleRbaAccess}
                  disabled={!isValidAccessCode()}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isValidAccessCode()
                      ? 'bg-white text-black hover:bg-white/80'
                      : 'bg-white/20 text-white/50 cursor-not-allowed'
                  }`}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[95vh] rounded-2xl shadow-2xl transition-all duration-300 bg-black text-white border border-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">Choose Your Plan</h2>
            {/* Billing Toggle */}
            <div className="bg-white rounded-lg p-1 flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-md transition-all duration-300 text-xs sm:text-sm ${
                  billingCycle === 'monthly'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">Monthly</span>
                <span className="sm:hidden">M</span>
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-md transition-all duration-300 text-xs sm:text-sm ${
                  billingCycle === 'annual'
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                <CreditCard className="w-3 h-3" />
                <span className="hidden sm:inline">Annual</span>
                <span className="sm:hidden">A</span>
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-white hover:text-black flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col overflow-y-auto">

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 flex-1">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col ${
                  selectedPlan === plan.id
                    ? 'border-white bg-white/10'
                    : 'border-white hover:border-white/80'
                } ${plan.popular ? 'ring-2 ring-white/20' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white text-black px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-xl sm:text-2xl font-bold">{getPlanPrice(plan)}</span>
                    <span className="text-white/70 text-sm">{plan.period}</span>
                    {plan.id !== 'free' && plan.id !== 'enterprise' && (
                      <div className="text-xs sm:text-sm text-white/70 mt-1">
                        {billingCycle === 'annual' && getAnnualSavings(plan.monthlyPrice, plan.annualPrice)}
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-white/80 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full py-2 px-3 sm:px-4 rounded-lg font-semibold transition-all duration-300 mt-auto text-sm ${
                      selectedPlan === plan.id
                        ? 'bg-white text-black hover:bg-white/80'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan.id);
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            {/* Get Started Button */}
            {selectedPlan && (
              <div className="text-center">
                <button
                  onClick={handleGetStarted}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto bg-white text-black hover:bg-white/80 text-sm sm:text-base"
                >
                  <span>Get Started with {plans.find(p => p.id === selectedPlan)?.name}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-black text-white">
                  OR
                </span>
              </div>
            </div>

            {/* RBA Access Code Section */}
            <div className="p-3 sm:p-4 rounded-xl border-2 border-white bg-white/5">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">Have RBA Access Code?</h3>
                  <div className="relative group flex-shrink-0">
                    <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white/70 cursor-help" />
                    <div className="absolute bottom-full left-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 mb-2 px-2 sm:px-3 py-1 sm:py-2 bg-black border border-white text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-[calc(100vw-2rem)] sm:max-w-xs break-words">
                      If you have an RBA access code, click below to enter it and unlock special features and access.
                      <div className="absolute top-full left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowRbaModal(true)}
                className="w-full px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-white text-black hover:bg-white/80 text-sm"
              >
                Have RBA Access Code?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal; 