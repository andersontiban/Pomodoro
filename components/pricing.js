'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Stripe Plans
const plans = [
  {
    link: process.env.NODE_ENV === 'development' ? 'https://buy.stripe.com/test_14kbLYeOK2Rjg1O3cc' : '',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1RLsHjPufkxpdRkoDdiBp1Sc' : '',
    price: 5,
    duration: '/month'
  },
  {
    link: process.env.NODE_ENV === 'development' ? 'https://buy.stripe.com/test_6oE5nA5eafE59DqdQR' : '',
    priceId: process.env.NODE_ENV === 'development' ? 'price_1RLsJXPufkxpdRkoFHp8ZvrZ' : '',
    price: 40,
    duration: '/year'
  }
];

const Pricing = () => {
  const [plan, setPlan] = useState(plans[0]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <section id="pricing">
        <div className="py-24 px-8 max-w-5xl mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <p className="font-medium text-primary mb-5">Pricing</p>
            <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
              Choose Your Plan
            </h2>
          </div>

          <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
            <div className="w-full max-w-lg">
              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-xl">
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="plan"
                      className="radio"
                      checked={plan.price === 19}
                      onChange={() => setPlan(plans[0])}
                    />
                    <span>Pay monthly</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="plan"
                      className="radio"
                      checked={plan.price === 40}
                      onChange={() => setPlan(plans[1])}
                    />
                    <span>Pay yearly (60% OFF 💰)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <p className="text-5xl tracking-tight font-extrabold">${plan.price}</p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
                      {plan.duration}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                  {[
                    'NextJS boilerplate',
                    'User auth (Supabase)',
                    'Database access',
                    'Transactional emails',
                    '1 year of updates',
                    '24/7 support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className="w-[18px] h-[18px] opacity-80 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <a
                    className="btn btn-primary btn-block"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={plan.link + '?prefilled_email=' + (userEmail || '')}
                  >
                    Subscribe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="fixed right-8 bottom-8">
        <a
          href="https://shipfa.st?ref=stripe_pricing"
          className="bg-white font-medium inline-block text-sm border border-base-content/20 hover:border-base-content/40 hover:text-base-content/90 hover:scale-105 duration-200 cursor-pointer rounded text-base-content/80 px-2 py-1"
        >
        </a>
      </section>
    </>
  );
};

export default Pricing;
