// Payment.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { Button } from 'flowbite-react';

export default function Payment() {
  const navigate = useNavigate();
  const isCheckoutFormFilled = useSelector((state) => state.checkout.isCheckoutFormFilled);

  const handlePayment = async () => {
    if (isCheckoutFormFilled) {
      try {
        // Fetch the checkout session from your backend
        const cartProducts = Cookies.get('cart');
        const response = await fetch('/api/payment/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: JSON.parse(cartProducts) }), // Replace with how you get the cart products
        });

        const { id } = await response.json();

        // Redirect to Stripe Checkout
        const stripe = window.Stripe('pk_test_FobLVO7JYtSIN9pQD6KNloZK'); // Replace with your Stripe publishable key
        await stripe.redirectToCheckout({ sessionId: id });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      navigate('/checkout');
    }
  };

  useEffect(() => {
    if (!isCheckoutFormFilled) {
      navigate('/checkout');
    }
  }, [isCheckoutFormFilled, navigate]);

  return (
    <div>
      {isCheckoutFormFilled && (
        <div>
          <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
              <div className="mx-auto max-w-5xl">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                  Payment
                </h2>
                {/* Other details */}
                <Button
                  type="button"
                  onClick={handlePayment}
                  gradientDuoTone="purpleToPink"
                >
                  Pay now
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
