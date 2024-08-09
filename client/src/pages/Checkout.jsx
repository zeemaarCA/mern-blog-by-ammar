import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import OAuth from "../components/OAuth";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { setCheckoutFormFilled } from "../redux/checkout/checkoutSlice";
import { selectCartItems } from "../redux/cart/cartSlice";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";

const Checkout = () => {
	const cartItems = useSelector(selectCartItems);
	const { currentUser } = useSelector((state) => state.user);
	const userId = currentUser?._id;
	// const customerData = useSelector(getCustomerData);
	const [formData, setFormData] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	// const isCheckoutFormFilled = useSelector((state) => state.checkout.isCheckoutFormFilled);

	// if (isCheckoutFormFilled) {
	// 	navigate("/payment");
	// }

	useEffect(() => {
		if (currentUser) {
			// If customerData exists in Redux, update the formData state
			setFormData({
				fullName: currentUser.fullName || "",
				email: currentUser.email || "",
				phone: currentUser.phone || "",
				city: currentUser.city || "",
				country: currentUser.country || "",
				address: currentUser.address || "",
			});
		} else {
			// If no customerData in Redux, use default values
			setFormData({
				fullName: "",
				email: currentUser?.email || "",
				phone: "",
				city: "",
				country: "",
				address: "",
			});
		}
	}, [currentUser?.email]);

	useEffect(() => {
		const fetchCustomerData = async () => {
			if (userId) {
				try {
					const res = await fetch(`/api/user/${userId}`);
					if (!res.ok) {
						toast("Fill the required fields");
						return;
					}
					const data = await res.json();
					if (data) {
						// navigate("/payment");
					}
				} catch (error) {
					toast.error(error.message);
				}
			}
		};

		fetchCustomerData();
	}, [userId, navigate]);

	const calculateTotalPrice = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * (item.quantity || 1),
			0
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateStart());
			setLoading(true);
			const res = await fetch(`/api/user/update/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (!res.ok) {
				dispatch(updateFailure(data.message));
				toast.error(data.message);
				setLoading(false);
				return;
			}
			dispatch(updateSuccess(data));
			toast.success("Customer information saved successfully!");

			dispatch(setCheckoutFormFilled(true));
			setLoading(false);
			navigate("/payment");
		} catch (error) {
			dispatch(updateFailure(error.message));
			toast.error(error.message);
			setLoading(false);
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
										<div className="mb-2 block">
											<Label htmlFor="name" value="Your name" />
										</div>
										<TextInput
											id="name"
											type="text"
											placeholder="name@name.com"
											required
											value={formData.fullName}
											onChange={(e) =>
												setFormData({ ...formData, fullName: e.target.value })
											}
										/>
									</div>

									<div>
										<div className="mb-2 block">
											<Label htmlFor="email" value="Your Email*" />
										</div>
										<TextInput
											id="email"
											type="email"
											placeholder=""
											required
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											disabled
										/>
									</div>

									<div>
										<div className="mb-2 block">
											<Label htmlFor="country" value="Country*" />
										</div>
										<TextInput
											id="country"
											type="text"
											placeholder="Your Country"
											required
											value={formData.country}
											onChange={(e) =>
												setFormData({ ...formData, country: e.target.value })
											}
										/>
									</div>

									<div>
										<div className="mb-2 block">
											<Label htmlFor="city" value="Your City" />
										</div>
										<TextInput
											id="city"
											type="text"
											placeholder="Your City"
											required
											value={formData.city}
											onChange={(e) =>
												setFormData({ ...formData, city: e.target.value })
											}
										/>
									</div>

									<div>
										<div className="mb-2 block">
											<Label htmlFor="phone" value="Phone No." />
										</div>
										<TextInput
											id="phone"
											type="text"
											placeholder="Phone No."
											required
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
										/>
									</div>

									<div>
										<div className="mb-2 block">
											<Label htmlFor="address" value="Your Address" />
										</div>
										<TextInput
											id="address"
											type="text"
											placeholder="Your Address"
											required
											value={formData.address}
											onChange={(e) =>
												setFormData({ ...formData, address: e.target.value })
											}
										/>
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
							{loading ? (
								<Button color="gray" className="w-full">
									<Spinner
										aria-label="Spinner button example"
										size="sm"
									/>
									<span className="pl-3">Loading...</span>
								</Button>
							) : (
								<Button
									type="submit"
									gradientDuoTone="purpleToPink"
									className="w-full"
									{...{ disabled: cartItems.length === 0 || !currentUser }}
								>
									Proceed to Payment
								</Button>
							)}

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
