import { useState, useEffect } from "react";
import { Button, Checkbox, Label, Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import AddToCartButton from "../components/AddToCartButton";
import ProductFilters from "../components/ProductFilters";

export default function Products({ productId }) {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
	const [error, setError] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const [showMorebuttonLoading, setShowMoreButtonLoading] = useState({});
	const [loading, setLoading] = useState(false);

	const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				// const res = await fetch("https://dummyjson.com/products");
				const res = await fetch("/api/product/getproducts");
				const data = await res.json();
				if (!res.ok) {
					setError(data.message || "Failed to fetch the products");
					setLoading(false);
					return;
				}
				if (res.ok) {
					setProducts(data.products);
					setError(false);
					setLoading(false);
				}
			} catch (error) {
				setError("An unexpected error occurred. Please try again later.");
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);


	useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const filtered = products.filter((product) =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
			setFilteredProducts(filtered);
    } else {
			setFilteredProducts(products); // Show all products if no category is selected
		}
  }, [selectedCategory, products]);


	const handleShowMore = async () => {
		const startIndex = products.length;

		try {
			setShowMoreButtonLoading(true);
			const res = await fetch(
				`/api/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setShowMoreButtonLoading(false);
				console.log(data.products);
				setProducts((prev) => [...prev, ...data.products]);
				if (data.products.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
			setShowMoreButtonLoading(false);
		}
	};

	return (
		<section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-12">
			<div className="px-4 2xl:px-0 mx-auto">
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
			</div>
			<div className="min-h-screen flex flex-col md:flex-row">
			<div className='md:w-56'>
        <ProductFilters
            selectedCategory={selectedCategory} // Pass the selected category
						setSelectedCategory={setSelectedCategory} // Pass the state setter
						selectedPrice={selectedPrice} // Pass the selected price
						setSelectedPrice={setSelectedPrice} // Pass the state setter
          />
      </div>
				<div className="mx-auto max-w-screen-xl px-4 2xl:px-0 flex-1">
					{loading ? (
						<div className="flex justify-center items-center min-h-screen">
							<Spinner size="xl" />
						</div>
					) : filteredProducts.length > 0 ? (
						<div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
							{filteredProducts.map((product) => (
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

					<div className="w-full text-center">
						{showMore && (
							<Button
								onClick={handleShowMore}
								className="bg-slate-200 my-7 mx-auto"
								color="gray"
								{...(showMorebuttonLoading ? { isProcessing: true } : {})}
							>
								Show more
							</Button>
						)}
					</div>
					{error && <p>{error}</p>}
				</div>
			</div>
		</section>
	);
}
