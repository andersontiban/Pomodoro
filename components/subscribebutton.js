// components/SubscribeButton.js
"use client";

import { useRouter } from 'next/navigation'; // Changed from require
import { useTransition } from 'react';      // Changed from require
import { subscribeAction } from '@/actions/stripe'; // Changed from require, ensure path is correct

export default function SubscribeButton({ userId, plan, className }) { // Added plan and className props
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Determine button text and styling based on the plan
    let buttonText = "Subscribe";
    let defaultButtonClasses = "w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";

    if (plan === "pro_monthly") {
        buttonText = "Subscribe to Pro Monthly";
    } else if (plan === "pro_annually") {
        buttonText = "Subscribe to Pro Annually";
        // Optionally change class for annual plan button
        defaultButtonClasses = "w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";
    }

    const handleClickSubscribeButton = async () => {
        if (!userId) {
            console.error("User ID is required to subscribe.");
            // Optionally redirect to login or show an error
            router.push('/login');
            return;
        }
        startTransition(async () => {
            try {
                const result = await subscribeAction({ userId, planId: plan }); // Pass planId or relevant plan identifier
                if (result && result.url) {
                    router.push(result.url); // Redirect to Stripe Checkout or other URL
                } else {
                    console.error("Failed to create subscription session or no URL returned", result?.error || result?.errorMessage);
                    // TODO: Show an error message to the user (e.g., using a toast notification)
                    alert(result?.error || result?.errorMessage || "Could not initiate subscription. Please try again.");
                }
            } catch (e) {
                console.error("Error during subscribeAction:", e);
                alert("An unexpected error occurred. Please try again.");
            }
        });
    };

    return (
        <button
            disabled={isPending || !userId} // Disable if pending or no userId
            onClick={handleClickSubscribeButton}
            className={className || defaultButtonClasses} // Use passed className or default
        >
            {isPending ? (
                <svg className="animate-spin mx-auto h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                buttonText
            )}
        </button>
    );
}
