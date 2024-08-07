/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";

export default function ProductCard({
	product,
	buttonLoading = {},  // Default to empty object
	addedProducts = {}   // Default to empty object
}) {

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<div className="h-56 w-full">
				<Link to={`/product/${product.slug}`}>
					<img
						className="mx-auto h-full dark:hidden"
						src={product.image}
						loading="lazy"
					/>
					<img
						className="mx-auto hidden h-full dark:block"
						src={product && product.image}
					/>
				</Link>
			</div>
			<div className="pt-6">
				<div className="mb-4 flex items-center justify-between gap-4">
					<span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
						{product.category}
					</span>
				</div>
				<Link
					to={`/product/${product.slug}`}
					className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
				>
					{product.title}
				</Link>
				<div className="mt-4 flex items-center justify-between gap-4">
					<p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
						${product.price}
					</p>

					<AddToCartButton
						product={product}
						isLoading={buttonLoading[product._id] || false}  // Default to false if undefined
						isAdded={addedProducts[product._id] || false}    // Default to false if undefined
					/>
				</div>
			</div>
		</div>
	);
}
