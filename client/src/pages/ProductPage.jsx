/* eslint-disable react/no-unescaped-entities */
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Link, useParams } from "react-router-dom";
// import CallToAction from "../components/CallToAction";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import ProductCard from "../components/ProductCard";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductPage() {
	const { productSlug } = useParams();
	const [product, setProduct] = useState(null);
	const [error, setError] = useState(false);
	const [isAddedToCart, setIsAddedToCart] = useState(false);
	const [recentProducts, setRecentProducts] = useState(null);
	const { updateCart } = useContext(CartContext);
	const [loading, setLoading] = useState(false);

	const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/product/getproducts?slug=${productSlug}`);
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch the post");
					setLoading(false);
					return;
				}
				if (res.ok) {
					setProduct(data.products[0]);
					setLoading(false);
					setError(false);
				}
			} catch (error) {
				setError("An unexpected error occurred. Please try again later.");
				setLoading(false);
			}
		};
		fetchProduct();
	}, [productSlug]);

	useEffect(() => {
		try {
			const fetchRecentProducts = async () => {
				const res = await fetch("/api/product/getproducts?limit=3");
				const data = await res.json();
				if (res.ok) {
					setRecentProducts(data.products);
				}
			};
			fetchRecentProducts();
		} catch (error) {
			console.log(error.message);
		}
	}, []);

	const handleAddToCart = () => {
		// Retrieve existing cart items from cookies
		const existingCart = Cookies.get("cart");
		const cart = existingCart ? JSON.parse(existingCart) : [];

		// Add the new product to the cart
		const newProduct = {
			userId: currentUser._id || "",
			id: product._id,
			title: product.title,
			price: product.price,
			image: product.image,
			slug: product.slug,
			category: product.category
		};

		// Check if the product is already in the cart
		const productIndex = cart.findIndex((item) => item.id === newProduct.id);
		if (productIndex > -1) {
			// Update quantity if needed
			// cart[productIndex].quantity = (cart[productIndex].quantity || 0) + 1;
			setIsAddedToCart(true);
			toast.success(`${product.title} already added to cart!`);
		} else {
			// Add new product
			newProduct.quantity = 1;
			cart.push(newProduct);
			toast.success(`${product.title} added to cart!`);
			setIsAddedToCart(true);
		}

		// Update cart context
		updateCart(cart);
		// Save updated cart back to cookies
		Cookies.set("cart", JSON.stringify(cart), { expires: 7 }); // Cart will expire in 7 days

		// Optionally, you can show a confirmation message or redirect the user
	};

	return (
		<div>
			{/* product detail page */}
			{loading ? (
				<div className="flex justify-center items-center min-h-screen">
					<Spinner size="xl" />
				</div>
			) : false}
			{error ? (
				<Alert color="failure" className="mt-5">
					{error}
				</Alert>
			) : (
				<>
					<section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
						<div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
							<div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
								<div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
									<img
										className="w-full dark:hidden"
										src={`/${product && product.image}`}
										alt={product && product.title}
									/>
									<img
										className="w-full hidden dark:block"
										src={`/${product && product.image}`}
										alt={product && product.title}
									/>
								</div>
								<div className="mt-6 sm:mt-8 lg:mt-0">
									<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
										{product && product.title.toUpperCase()}
									</h1>
									<div className="mt-4 sm:items-center sm:gap-4 sm:flex">
										<p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
											${product && product.price}
										</p>
									</div>
									<div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
										<Button gradientDuoTone="purpleToBlue">
											<CiHeart className="mr-2 h-5 w-5" />
											Add to favorites
										</Button>
										<Button
											gradientDuoTone="pinkToOrange"
											onClick={handleAddToCart}
											disabled={isAddedToCart}
										>
											<MdOutlineShoppingCart className="mr-2 h-5 w-5" />
											{isAddedToCart ? "Added to cart" : "Add to cart"}
										</Button>
									</div>
									<hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
									<p className="mb-6 text-gray-500 dark:text-gray-400">
										<div
											className="mx-auto w-full mb-7 post-content prose dark:prose-invert"
											dangerouslySetInnerHTML={{
												__html: product && product.description,
											}}
										></div>
									</p>
								</div>
							</div>
						</div>
					</section>
				</>
			)}

			{/* product detail page */}
			<div className="flex flex-col justify-center items-center mb-5">
				<h1 className="text-xl mt-5">Recent Products</h1>
				<div className="flex flex-wrap gap-5 mt-5 justify-center">
					{recentProducts &&
						recentProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
				</div>
			</div>
		</div>
	);
}
