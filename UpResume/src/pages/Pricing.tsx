import React from 'react';

const PricingCard = ({ 
  duration, 
  price, 
  features, 
  isPopular 
}: { 
  duration: string; 
  price: number; 
  features: string[]; 
  isPopular?: boolean; 
}) => {
  return (
    <div className={`rounded-2xl p-6 ${isPopular ? 'bg-[#3868F9] text-white' : 'bg-black/30 text-white/90'} backdrop-blur-md border border-white/[0.08]`}>
      <h3 className="text-xl font-semibold mb-2">{duration} Plan</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-sm opacity-80">/{duration.toLowerCase()}</span>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-6 w-full py-2 px-4 rounded-full ${isPopular ? 'bg-white text-[#3868F9]' : 'bg-[#3868F9] text-white'} font-medium hover:opacity-90 transition duration-200`}>
        Choose Plan
      </button>
    </div>
  );
};

export default function Pricing() {
  const plans = [
    {
      duration: '3 Months',
      price: 29,
      features: [
        'AI Resume Analysis',
        'Basic Template Access',
        'Email Support',
        '2 Resume Versions'
      ]
    },
    {
      duration: '6 Months',
      price: 49,
      features: [
        'Everything in 3 Months',
        'Premium Templates',
        'Priority Support',
        'Unlimited Resume Versions',
        'Cover Letter Generator'
      ],
      isPopular: true
    },
    {
      duration: 'Yearly',
      price: 89,
      features: [
        'Everything in 6 Months',
        'Custom Branding',
        '24/7 Support',
        'LinkedIn Profile Optimization',
        'Interview Preparation Tools'
      ]
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Select the perfect plan for your career journey. All plans include our core AI-powered resume optimization features.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}