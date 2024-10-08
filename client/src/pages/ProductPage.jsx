import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import ProductCard from "../components/ProductCard";
import AddToCartButton from "../components/AddToCartButton"; // Import the new component

export default function ProductPage() {
	const { productSlug } = useParams();
	const [product, setProduct] = useState(null);
	const [error, setError] = useState(false);
	const [recentProducts, setRecentProducts] = useState(null);
	const [loading, setLoading] = useState(false);


	// Function to handle adding to cart

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/product/getproducts?slug=${productSlug}`);
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch the product");
					setLoading(false);
					return;
				}
				setProduct(data.products[0]);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError("An unexpected error occurred. Please try again later.");
				setLoading(false);
			}
		};
		fetchProduct();
	}, [productSlug]);

	useEffect(() => {
		const fetchRecentProducts = async () => {
			try {
				const res = await fetch("/api/product/getproducts?limit=3");
				const data = await res.json();
				if (res.ok) {
					setRecentProducts(data.products);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		fetchRecentProducts();
	}, []);

	return (
		<div>
			{loading ? (
				<div className="flex justify-center items-center min-h-screen">
					<Spinner size="xl" />
				</div>
			) : error ? (
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
										src={`${product && product.image}`}
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
										<AddToCartButton product={product} />
									</div>
									<hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
									<div className="mb-6 text-gray-500 dark:text-gray-400">
										<div
											className="mx-auto w-full mb-7 post-content prose dark:prose-invert"
											dangerouslySetInnerHTML={{
												__html: product && product.description,
											}}
										></div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</>
			)}

			<div className="flex flex-col justify-center items-center mb-5">
				<h1 className="text-xl mt-5">Recent Products</h1>
				<div className="flex flex-wrap gap-5 mt-5 justify-center">
					{recentProducts &&
						recentProducts.map((recentProduct) => (
							<ProductCard
								key={recentProduct._id}
								product={recentProduct}
								addToCartButton={<AddToCartButton product={product} />}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
