import { Link, useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../redux/cart/cartSlice";
import OAuth from "../components/OAuth";
import toast from "react-hot-toast";

function SignIn() {
	const [formdata, setFormdata] = useState({});
	// eslint-disable-next-line no-unused-vars
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleChange = (e) => {
		setFormdata({ ...formdata, [e.target.id]: e.target.value.trim() });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formdata.email || !formdata.password) {
			return dispatch(signInFailure("All fields are required"));
		}
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formdata),
			});
			const data = await res.json();
			if (data.success === false) {
				if (data.success === false) {
					dispatch(signInFailure(data.message));
					if (data.verifyLink) {
						// Include the verification link in the error message
						toast.error(
							<>
								{data.message} <Link to={data.verifyLink} className="text-pink-500 font-semibold underline ml-3">Verify your email</Link>
							</>
						);
					} else {
						toast.error(data.message);
					}
					return;
				}

				dispatch(signInFailure(data.message));
			}
			if (res.ok) {
				dispatch(signInSuccess(data));
				navigate("/");
			}

			try {
				const cartRes = await fetch(`/api/cart/${data._id}`); // Replace with your actual cart endpoint
				if (cartRes.ok) {
					const cartItemsData = await cartRes.json();
					dispatch(setCartItems(cartItemsData.cart.items)); // Store cart items in Redux
				}
			} catch (error) {
				console.error("Error fetching cart items:", error.message);
			}
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};
	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link to="/" className="font-bold dark:text-white text-4xl">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
							Ammar
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						This is a demo project. You can sign up with your email and password
						or with Google.
					</p>
				</div>
				{/* right */}

				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your email" />
							<TextInput
								type="email"
								placeholder="name@company.com"
								id="email"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your password" />
							<TextInput
								type="password"
								placeholder="Password"
								id="password"
								onChange={handleChange}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3">Loading...</span>
								</>
							) : (
								"Sign In"
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-5">
						<span>Do not have an account?</span>
						<Link to="/sign-up" className="text-blue-500">
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
