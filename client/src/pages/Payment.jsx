import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const isCheckoutFormFilled = useSelector(
    (state) => state.checkout.isCheckoutFormFilled
  );
  const currentUser = useSelector((state) => state.user.currentUser); // Assuming you're storing the user ID in Redux auth state
  const [cartProducts, setCartProducts] = useState(null);

  const userId = currentUser ? currentUser._id : null;

  console.log(isCheckoutFormFilled);
  console.log(userId);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/cart/${userId}`);
          if (response.ok) {
            const data = await response.json();
            setCartProducts(data.cart.items); // Assuming your cart response has an 'items' array
            console.log(data.cart.items);
          } else {
            console.error('Error fetching cart data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    if (isCheckoutFormFilled) {
      fetchCartProducts();
    }
  }, [isCheckoutFormFilled, userId]);

  const handlePayment = async () => {
    if (isCheckoutFormFilled && cartProducts) { // Check if cartProducts is available
      try {
        const response = await fetch('/api/payment/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }), // Only sending userId to the backend
        });

        const { id } = await response.json();

        const stripe = window.Stripe('pk_test_FobLVO7JYtSIN9pQD6KNloZK');
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
