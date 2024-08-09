import { Badge, Button, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modals from "./Modals";

export default function DashProducts() {
	const { currentUser } = useSelector((state) => state.user);
	const [products, setProducts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [productIdToDelete, setProductIdToDelete] = useState("");
	const [loading, setLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const res = await fetch(
					`/api/product/getproducts?userId=${currentUser._id}`
				);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setProducts(data.products);
					if (data.products.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				setLoading(false);
				console.log(error.message);
			}
		};
		if (currentUser) {
			fetchProducts();
		}
	}, [currentUser]);

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

	const handleDeleteProduct = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			}
			if (res.ok) {
				setProducts((prev) =>
					prev.filter((product) => product._id !== productIdToDelete)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="w-full">
			<h1 className="text-3xl font-semibold text-center my-6">Products</h1>

			<div className="overflow-x-auto w-full">
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<Spinner size="xl" />
					</div>
				) : currentUser && products.length > 0 ? (
					<>
						<Table hoverable className="text-center">
							<Table.Head>
								{/* <Table.HeadCell>Order Id</Table.HeadCell> */}
								<Table.HeadCell>Product Image</Table.HeadCell>
								<Table.HeadCell>Product Name</Table.HeadCell>
								<Table.HeadCell>Price</Table.HeadCell>
								<Table.HeadCell>Category</Table.HeadCell>
								<Table.HeadCell>
									<span className="sr-only">Edit</span>
								</Table.HeadCell>
								<Table.HeadCell>
									<span className="sr-only">Delete</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y">
								{products.map((product) => (
									<Table.Row
										key={product._id}
										className="bg-white dark:border-gray-700 dark:bg-gray-800"
									>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											<img src={product.image} className="w-12" alt="" />
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											{product.title}
										</Table.Cell>
										<Table.Cell>{product.price}</Table.Cell>
										<Table.Cell>
											<Badge color="success" className="inline">
												{product.category}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<Link
												className="text-teal-500 hover:underline"
												to={`/update-product/${product._id}`}
											>
												<span>Edit</span>
											</Link>
										</Table.Cell>
										<Table.Cell>
											<span
												onClick={() => {
													setShowModal(true);
													setProductIdToDelete(product._id);
												}}
												className="font-medium text-red-500 hover:underline cursor-pointer"
											>
												Delete
											</span>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
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
					</>
				) : (
					<p>You have no orders yet!</p>
				)}
			</div>
			<Modals
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				onDeleteConfirm={handleDeleteProduct}
			/>
		</div>
	);
}
