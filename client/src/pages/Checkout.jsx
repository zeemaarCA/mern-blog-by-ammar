import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import OAuth from "../components/OAuth";
import { Button } from "flowbite-react";
import { setCheckoutFormFilled } from "../redux/checkout/checkoutSlice";
import { selectCartItems } from "../redux/cart/cartSlice"

const Checkout = () => {
	const cartItems = useSelector(selectCartItems); 
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({});

	// console.log(formData);

	useEffect(() => {
    setFormData({
      fullName: '',
      email: currentUser?.email || '',
      phone: '',
      city: '',
      country: '',
      address: '',
    });
	}, [currentUser?.email]);

	useEffect(() => {
    const fetchCustomerData = async () => {
      if (currentUser?.email) {
        try {
          const res = await fetch(`/api/customer/${currentUser?.email}`);
          if (!res.ok) {
            toast("Fill the required fields");
						return;
          }
          const data = await res.json();
          if (data) {
            navigate('/payment');
					}
					console.log(data);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    fetchCustomerData();
  }, [currentUser?.email]);

	const navigate = useNavigate();

	const calculateTotalPrice = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * (item.quantity || 1),
			0
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/customer/addCustomer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message);
				return;
      }

			toast.success("Customer information saved successfully!");
			dispatch(setCheckoutFormFilled(true)); // Update the global state
      // Assuming you have navigate function from react-router
      navigate("/payment");
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
			<form
				onSubmit={handleSubmit}
				className="mx-auto max-w-screen-xl px-4 2xl:px-0"
			>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Checkout
				</h1>
				<div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
					{!currentUser ? (
						<>
							<div className="min-w-0 flex-1 space-y-8 flex flex-col items-center">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
									You need to be logged in to checkout
								</h2>
								<OAuth />
							</div>
						</>
					) : (
						<div className="min-w-0 flex-1 space-y-8">
							<div className="space-y-4">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
									Delivery Details
								</h2>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="your_name"
											className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
										>
											Your name
										</label>
										<input
											type="text"
											id="your_name"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="Bonnie Green"
											required
											onChange={(e) =>
												setFormData({ ...formData, fullName: e.target.value })
											}
										/>
									</div>
									<div>
										<label
											htmlFor="your_email"
											className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
										>
											Your email*
										</label>
										<input
											type="email"
											id="your_email"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="name@flowbite.com"
												required
												value={currentUser.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
										/>
									</div>
									<div>
										<div className="mb-2 flex items-center gap-2">
											<label
												htmlFor="select-country-input-3"
												className="block text-sm font-medium text-gray-900 dark:text-white"
											>
												Country*
											</label>
										</div>
										<input
											type="text"
											id="select-country-input-3"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="Your Country"
											required
											onChange={(e) =>
												setFormData({ ...formData, country: e.target.value })
											}
										/>
									</div>
									<div>
										<div className="mb-2 flex items-center gap-2">
											<label
												htmlFor="select-city-input-3"
												className="block text-sm font-medium text-gray-900 dark:text-white"
											>
												City*
											</label>
										</div>
										<input
											type="text"
											id="select-city-input-3"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="Your City"
											required
											onChange={(e) =>
												setFormData({ ...formData, city: e.target.value })
											}
										/>
									</div>
									<div>
										<label
											htmlFor="phone-input-3"
											className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
										>
											Phone Number*
										</label>
										<input
											type="text"
											id="phone-input-3"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="Your Phone"
											required
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
										/>
									</div>

									<div>
										<label
											htmlFor="address"
											className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
										>
											Address
										</label>
										<input
											type="text"
											id="address"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
											placeholder="Full Address"
											required
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
										/>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Delivery Methods
								</h3>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
										<div className="flex items-start">
											<div className="flex h-5 items-center">
												<input
													id="dhl"
													aria-describedby="dhl-text"
													type="radio"
													name="delivery-method"
													value="dhl"
													onChange={(e) =>
														setFormData({
															...formData,
															deliveryMethod: e.target.value,
														})
													}
													className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
													defaultChecked
												/>
											</div>
											<div className="ms-4 text-sm">
												<label
													htmlFor="dhl"
													className="font-medium leading-none text-gray-900 dark:text-white"
												>
													$15 - DHL Fast Delivery
												</label>
												<p
													id="dhl-text"
													className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
												>
													Get it by Tommorow
												</p>
											</div>
										</div>
									</div>
									<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
										<div className="flex items-start">
											<div className="flex h-5 items-center">
												<input
													id="fedex"
													aria-describedby="fedex-text"
													type="radio"
													value="fedex"
													name="delivery-method"
													onChange={(e) =>
														setFormData({
															...formData,
															deliveryMethod: e.target.value,
														})
													}
													className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
												/>
											</div>
											<div className="ms-4 text-sm">
												<label
													htmlFor="fedex"
													className="font-medium leading-none text-gray-900 dark:text-white"
												>
													Free Delivery - FedEx
												</label>
												<p
													id="fedex-text"
													className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
												>
													Get it by Friday, 13 Dec 2023
												</p>
											</div>
										</div>
									</div>
									<div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
										<div className="flex items-start">
											<div className="flex h-5 items-center">
												<input
													id="express"
													aria-describedby="express-text"
													type="radio"
													value="express"
													name="delivery-method"
													onChange={(e) =>
														setFormData({
															...formData,
															deliveryMethod: e.target.value,
														})
													}
													className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
												/>
											</div>
											<div className="ms-4 text-sm">
												<label
													htmlFor="express"
													className="font-medium leading-none text-gray-900 dark:text-white"
												>
													$49 - Express Delivery
												</label>
												<p
													id="express-text"
													className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
												>
													Get it today
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
						<div className="flow-root">
							<div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
								{cartItems.map((item) => (
									<div key={item.id}>
										<dl className="flex items-center justify-between gap-4 py-3">
											<dt className="text-base font-normal text-gray-500 dark:text-gray-400">
												{item.title}
											</dt>
											<dd className="text-base font-medium text-gray-900 dark:text-white">
												${item.price}
											</dd>
										</dl>
									</div>
								))}

								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-base font-bold text-gray-500 dark:text-gray-400">
										Subtotal
									</dt>
									<dd className="text-base font-medium text-gray-900 dark:text-white">
										${calculateTotalPrice()}
									</dd>
								</dl>
								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-base font-bold text-gray-500 dark:text-gray-400">
										Tax
									</dt>
									<dd className="text-base font-medium text-gray-900 dark:text-white">
										0
									</dd>
								</dl>
								<dl className="flex items-center justify-between gap-4 py-3">
									<dt className="text-xl font-bold text-gray-900 dark:text-white">
										Total
									</dt>
									<dd className="text-xl font-bold text-gray-900 dark:text-white">
										${calculateTotalPrice()}
									</dd>
								</dl>
							</div>
						</div>
						<div className="space-y-3">
							<Button
								type="submit"
								gradientDuoTone="purpleToPink"
								className="w-full"
								{...{ disabled: cartItems.length === 0 || !currentUser }}
							>
								Proceed to Payment
							</Button>
							<p className="text-sm font-normal text-gray-500 dark:text-gray-400">
								<Link
									to="/login"
									className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
								>
									Sign in or create an account now.
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			</form>
		</section>
	);
};

export default Checkout;
