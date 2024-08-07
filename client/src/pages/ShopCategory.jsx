import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import AddToCartButton from "../components/AddToCartButton";
import { Spinner } from "flowbite-react";

export default function ShopCategory({ productId, category }) {
	const [products, setProducts] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/product/getproducts`);
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch the products");
					setLoading(false);
					return;
				}
				if (res.ok) {
					setProducts(data.products);
					setLoading(false);
					setError(false);
				}
			} catch (error) {
				setError("An unexpected error occurred. Please try again later.");
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	return (
		<section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
			<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
				<div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
					<div>
						<h2 className="mt-3 text-xl capitalize font-semibold text-gray-900 dark:text-white sm:text-2xl">
							{category}
						</h2>
					</div>
				</div>
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<Spinner size="xl" />
					</div>
				) : products.length > 0 ? (
					<div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
						{products
							.filter(
								(product) =>
									product.category === category							)
							.map((product) => (
								<div key={product._id} className="space-y-6">
									<ProductCard
										key={product._id}
										product={product}
										addToCartButton={<AddToCartButton product={product} />}
									/>
								</div>
							))}
					</div>
				) : (
					<p>No products found.</p>
				)}
				{error && <p>{error}</p>}
			</div>
		</section>
	);
}
