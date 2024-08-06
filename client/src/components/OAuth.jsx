import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import {app} from '../firebase.js'
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { setCartItems } from "../redux/cart/cartSlice.js";
export default function OAuth() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({
			prompt: "select_account",
		});
		try {
			const resultFromGoogle = await signInWithPopup(auth, provider);
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: resultFromGoogle.user.displayName,
					email: resultFromGoogle.user.email,
					googlePhotoUrl: resultFromGoogle.user.photoURL,
				}),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
			}

			// Fetch cart items (if applicable)
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
			console.log(error);
		}
	};

	return (
		<Button
			type="button"
			gradientDuoTone="pinkToOrange"
			outline
			onClick={handleGoogleClick}
		>
			<AiFillGoogleCircle className="w-6 h-6 mr-2" />
			Continue with Google
		</Button>
	);
}
