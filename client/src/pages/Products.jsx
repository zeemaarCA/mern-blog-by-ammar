import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { MdOutlineShoppingCart } from "react-icons/md";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useSelector } from "react-redux";
export default function Products() {
	const { updateCart } = useContext(CartContext);
	const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [addedProducts, setAddedProducts] = useState({});
  const [showMore, setShowMore] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch("/api/product/getproducts");
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch the products");
					return;
				}
				if (res.ok) {
					setProducts(data.products);
					setError(false);
				}
			} catch (error) {
				setError("An unexpected error occurred. Please try again later.");
			}
		};
		fetchProducts();
	}, []);

	const handleAddToCart = (productId) => {
		console.log("Product ID:", productId);
		// Use `_id` to find the product
		const product = products.find((p) => p._id === productId);
		if (!product) {
			alert("Product not found");
			return;
		}

		// Retrieve existing cart items from cookies
		const existingCart = Cookies.get("cart");
		const cart = existingCart ? JSON.parse(existingCart) : [];

		// Check if the product is already in the cart
		const productIndex = cart.findIndex((item) => item.id === product._id);
    if (productIndex > -1) {
      setAddedProducts((prev) => ({
        ...prev,
        [productId]: true,
      }));
			// Update quantity if needed
      // cart[productIndex].quantity = (cart[productIndex].quantity || 0) + 1;
      toast.success("Product already in cart!");
		} else {
			// Add new product
      const newProduct = {
        userId: currentUser._id || "",
				id: product._id,
				title: product.title,
				price: product.price,
				image: product.image,
        slug: product.slug,
        category: product.category,
				quantity: 1,
			};
			cart.push(newProduct);
      toast.success(`${product.title} added to cart!`);
		}

		// Update cart context
    updateCart(cart);
    setAddedProducts((prev) => ({
      ...prev,
      [productId]: true,
    }));

		// Save updated cart back to cookies
		Cookies.set("cart", JSON.stringify(cart), { expires: 7 }); // Cart will expire in 7 days

		// Optionally, you can show a confirmation message or redirect the user
  };

  const handleShowMore = async () => {
		const startIndex = products.length;

		try {
			setButtonLoading(true);
			const res = await fetch(
				`/api/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setButtonLoading(false);
				setProducts((prev) => [...prev, ...data.products]);
				if (data.products.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
			setButtonLoading(false);
		}
	};

	return (
		<section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
			<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
				{/* Heading & Filters */}
				<div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
					<div>
						<nav className="flex" aria-label="Breadcrumb">
							<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
								<li className="inline-flex items-center">
									<a
										href="#"
										className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
									>
										<svg
											className="me-2.5 h-3 w-3"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
										</svg>
										Home
									</a>
								</li>
								<li aria-current="page">
									<div className="flex items-center">
										<svg
											className="h-5 w-5 text-gray-400 rtl:rotate-180"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											width={24}
											height={24}
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="m9 5 7 7-7 7"
											/>
										</svg>
										<span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ms-2">
											Products
										</span>
									</div>
								</li>
							</ol>
						</nav>
						<h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
							Electronics
						</h2>
					</div>
				</div>
				{products.length > 0 ? (
					<div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
						{products.map((product) => (
							<div key={product._id} className="space-y-6">
								<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
									<div className="h-56 w-full">
										<a href="#">
											<img
												className="mx-auto h-full dark:hidden"
												src={product.image}
											/>
											<img
												className="mx-auto hidden h-full dark:block"
												src={product.image}
											/>
										</a>
									</div>
									<div className="pt-6">
										<div className="mb-4 flex items-center justify-between gap-4">
											<span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
												{product.category}
											</span>
											<div className="flex items-center justify-end gap-1"></div>
										</div>
										<Link to={`/product/${product.slug}`}
											className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
										>
											{product.title}
										</Link>
										<div className="mt-4 flex items-center justify-between gap-4">
											<p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
												${product.price}
											</p>
											<Button
												gradientDuoTone="pinkToOrange"
                        onClick={() => handleAddToCart(product._id)}
                        disabled={!!addedProducts[product._id]}
											>
												<MdOutlineShoppingCart className="mr-2 h-5 w-5" />
												{addedProducts[product._id] ? "Added to cart" : "Add to cart"}
											</Button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No products found.</p>
				)}

				<div className="w-full text-center">
        {showMore && (
						<Button
							onClick={handleShowMore}
							className="bg-slate-200 my-7 mx-auto"
								color="gray"
								{...(buttonLoading ? { isProcessing: true } : {})}
						>
							Show more
						</Button>
					)}
        </div>
        {error && <p>{error}</p>}
			</div>
		</section>
	);
}