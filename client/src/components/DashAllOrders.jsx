import { Badge, Button, Label, Modal, Select, Spinner, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { MdDelete, MdOutlineEdit } from "react-icons/md";

export default function DashOrders() {
	const { currentUser } = useSelector((state) => state.user);
	const [userOrders, setUserOrders] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState("");
	const [loading, setLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/order/allorders`);
				if (res.ok) {
					const data = await res.json();
					setUserOrders(data);
					setShowMore(data.length >= 9);
				} else {
					throw new Error("Failed to fetch orders");
				}
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		if (currentUser) {
			fetchOrders();
		}
	}, [currentUser]);

	const formatAmount = (amount) => {
		if (amount === undefined || amount === null) return "0";

		// Convert amount to number if it's a string
		const numericAmount =
			typeof amount === "string" ? parseInt(amount, 10) : amount;

		// Convert amount from cents to dollars (if needed) and format
		const formattedAmount = (numericAmount / 100).toFixed(2);

		// Format the amount with commas as thousand separators
		return new Intl.NumberFormat().format(formattedAmount);
  };

  const handleDropdownToggle = (orderId) => {
		// If the clicked dropdown is already active, close it; otherwise, open it
		setActiveDropdown(activeDropdown === orderId ? null : orderId);
	};

	return (
		<div className="w-full">
			<h1 className="text-3xl font-semibold text-center my-6">Orders</h1>

			<div className="overflow-x-auto w-full">
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<Spinner size="xl" />
					</div>
				) : currentUser && userOrders.length > 0 ? (
					<>
						<Table hoverable className="text-center">
							<Table.Head>
								{/* <Table.HeadCell>Order Id</Table.HeadCell> */}
								<Table.HeadCell>Product Name</Table.HeadCell>
								<Table.HeadCell>Quantity</Table.HeadCell>
								<Table.HeadCell>Color</Table.HeadCell>
								<Table.HeadCell>Payment Stauts</Table.HeadCell>
								<Table.HeadCell>Payment Stauts</Table.HeadCell>
								<Table.HeadCell>Status</Table.HeadCell>
								<Table.HeadCell>
									<span>Actions</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y">
								{userOrders.map((order) => (
									<Table.Row
										key={order._id}
										className="bg-white dark:border-gray-700 dark:bg-gray-800"
									>
										{/* <Table.Cell>{order.orderId}</Table.Cell> */}
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											{/* You need to extract and render product details here */}
											{order.products.map((product) => (
												<div key={product._id}>
													<p>{product.title}</p>
												</div>
											))}
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
											{/* You need to extract and render product details here */}
											{order.products.map((product) => (
												<div key={product._id}>
													<p>{product.quantity}</p>
												</div>
											))}
										</Table.Cell>
										<Table.Cell>{order.currency}</Table.Cell>
										<Table.Cell>
											<Badge color="success" className="inline">
												{order.paymentStatus}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<span className="font-medium text-gray-900 dark:text-white">
												${formatAmount(order.amount)}
											</span>
										</Table.Cell>
										<Table.Cell>
                    {activeDropdown === order._id ? (
												<div className="max-w-md">
													<div className="mb-2 block">
														<Label
															htmlFor="status"
															value="Select status"
														/>
													</div>
													<Select id="status" required>
														<option>Processing</option>
														<option>Shipped</option>
														<option>Delivered</option>
														<option>Cancelled</option>
													</Select>
												</div>
											) : (
												<span className="font-medium text-gray-900 dark:text-white">
													{order.status || "Processing"}
												</span>
											)}
										</Table.Cell>
										<Table.Cell>
											<div className="flex gap-2">
												<Button
													size="xs"
													color="gray"
													onClick={() => handleDropdownToggle(order._id)}
												>
													<MdOutlineEdit />
												</Button>
												<Button size="xs" color="failure">
													<MdDelete />
												</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</>
				) : (
					<p className="text-center">You have no orders yet!</p>
				)}
			</div>
		</div>
	);
}
