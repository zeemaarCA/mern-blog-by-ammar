import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { useSelector } from "react-redux";

export default function PaymentComplete() {
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Processing payment...");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser ? currentUser._id : null;

  useEffect(() => {
    const fetchOrderAndPaymentDetails = async () => {
      if (!userId) {
        setStatusMessage("No user ID found.");
        return;
      }

      try {
        // Fetch order details
        const res = await fetch(`/api/order/${userId}`);
        const orderData = await res.json();
        if (res.ok) {
					setOrder(orderData);
					// console.log(orderData);

        } else {
          setStatusMessage("Failed to retrieve order details.");
        }

        // Fetch payment details
        const paymentResponse = await fetch(`/api/payment/${userId}`);
        const paymentData = await paymentResponse.json();
        if (paymentResponse.ok) {
					setPayment(paymentData);
					console.log(paymentData);
        } else {
          setStatusMessage("Failed to retrieve payment details.");
        }

        // Clear cart from Redux state
        dispatch(clearCart());
      } catch (error) {
        setStatusMessage("An error occurred while fetching order and payment details.");
        console.error("Fetch order and payment details error:", error);
      }
    };

    fetchOrderAndPaymentDetails();
  }, [userId, dispatch]);

// Format amount function
const formatAmount = (amount) => {
  if (amount === undefined || amount === null) return '0';

  // Convert amount to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;

  // Convert amount from cents to dollars (if needed) and format
  const formattedAmount = (numericAmount / 100).toFixed(2);

  // Format the amount with commas as thousand separators
  return new Intl.NumberFormat().format(formattedAmount);
};

  if (!order || !payment) {
    return <div>{statusMessage}</div>;
  }
	return (
		<div>
			<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
				<div className="mx-auto max-w-2xl px-4 2xl:px-0">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
						Thanks for your order!
					</h2>
					<p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
						Your order{" "}
						<a
							href="#"
							className="font-medium text-gray-900 dark:text-white hover:underline"
						>
							#{order.orderId}
						</a>{" "}
						will be processed within 24 hours during working days. We will
						notify you by email once your order has been shipped.
					</p>
					<div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
						<dl className="sm:flex items-center justify-between gap-4">
							<dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
								Date
							</dt>
							<dd className="font-medium text-gray-900 dark:text-white sm:text-end">
								{new Date(order.createdAt).toLocaleDateString()}
							</dd>
						</dl>
						<dl className="sm:flex items-center justify-between gap-4">
							<dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
								Payment Method
							</dt>
							<dd className="font-medium text-gray-900 dark:text-white sm:text-end">
								{payment.paymentMethod}
							</dd>
						</dl>
						<dl className="sm:flex items-center justify-between gap-4">
							<dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
								Name
							</dt>
							<dd className="font-medium text-gray-900 dark:text-white sm:text-end">
								{order.name}
							</dd>
						</dl>
						<dl className="sm:flex items-center justify-between gap-4">
							<dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
								Amount
							</dt>
							<dd className="font-medium text-gray-900 dark:text-white sm:text-end">
							${formatAmount(payment.amount)}
							</dd>
						</dl>
						<dl className="sm:flex items-center justify-between gap-4">
							<dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
								Phone
							</dt>
							<dd className="font-medium text-gray-900 dark:text-white sm:text-end">
								{order.phone}
							</dd>
						</dl>
					</div>
					<div className="flex items-center space-x-4">
						<a
							href="#"
							className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
						>
							Track your order
						</a>
						<a
							href="#"
							className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
						>
							Return to shopping
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
