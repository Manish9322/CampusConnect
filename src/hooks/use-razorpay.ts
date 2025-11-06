
import { useEffect, useState } from 'react';

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error('Razorpay script failed to load.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const displayRazorpay = async (options: any) => {
    if (!isLoaded) {
      console.error('Razorpay SDK not loaded yet.');
      return;
    }
    
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { isLoaded, displayRazorpay };
};

export { useRazorpay };
