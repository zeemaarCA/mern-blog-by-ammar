import {
  Badge,
  Button,
  Label,
  Select,
  Spinner,
  Table,
  TableCell
} from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import Modals from "./Modals";

export default function DashOrders() {
	const { currentUser } = useSelector((state) => state.user);
	const [userOrders, setUserOrders] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [orderIdToDelete, setOrderIdToDelete] = useState("");
	const [loading, setLoading] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/order/allorders`);
				if (res.ok) {
					const data = await res.json();
					setUserOrders(data);
					// setShowMore(data.length >= 9);
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

	const handleStatusChange = async (orderId, orderStatus) => {
		// console.log(orderId, status);
		try {
			const res = await fetch(`/api/order/updatestatus/${orderId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderStatus,
				}),
			});
			if (res.ok) {
				const updatedOrder = await res.json();
				setUserOrders((prevOrders) =>
					prevOrders.map((order) =>
						order._id === updatedOrder._id
							? { ...order, orderStatus: updatedOrder.orderStatus }
							: order
					)
        );
        toast.success("Order status updated successfully");
				setActiveDropdown(null);
				setLoading(false);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteOrder = async () => {
		setShowModal(false);
		try {
			const res = await fetch(`/api/order/deleteorder/${orderIdToDelete}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			}
			if (res.ok) {
				setUserOrders((prev) =>
					prev.filter((order) => order._id !== orderIdToDelete)
        );
        toast.success("Order deleted successfully");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			<h1 className="text-3xl font-semibold text-center my-6">All Orders</h1>

			<div className="overflow-x-auto w-full">
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<Spinner size="xl" />
					</div>
				) : currentUser && userOrders.length > 0 ? (
					<>
						<Table hoverable>
							<Table.Head>
								{/* <Table.HeadCell>Order Id</Table.HeadCell> */}
								<Table.HeadCell>Product Name</Table.HeadCell>
								<Table.HeadCell>Quantity</Table.HeadCell>
								<Table.HeadCell>Customer Name</Table.HeadCell>
								<Table.HeadCell>Customer Email</Table.HeadCell>
								<Table.HeadCell>Payment Stauts</Table.HeadCell>
								<Table.HeadCell>Amount</Table.HeadCell>
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
													<p className="text-center">{product.quantity}</p>
												</div>
											))}
										</Table.Cell>

										<TableCell className="whitespace-nowrap">{order.name}</TableCell>
										<TableCell>{order.user}</TableCell>
										<Table.Cell>
											<Badge color="success" className="inline capitalize">
												{order.paymentStatus}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<span className="font-medium text-gray-900 dark:text-white">
												${formatAmount(order.amount)}
											</span>
										</Table.Cell>
										<Table.Cell className="whitespace-nowrap">
											{activeDropdown === order._id ? (
												<div className="max-w-md">
													<Select
														id="orderStatus"
														required
														onChange={(e) =>
															handleStatusChange(order._id, e.target.value)
														}
													>
														<option>--Select--</option>
														<option>Pending</option>
														<option>Processing</option>
														<option>Shipped</option>
														<option>Delivered</option>
														<option>Cancelled</option>
													</Select>
												</div>
											) : (
												<Badge className="justify-center inline" color={`${
														order.orderStatus === "Processing"
															? "warning"
															: order.orderStatus === "Shipped"
															? "indigo"
															: order.orderStatus === "Delivered"
															? "success"
															: order.orderStatus === "Cancelled"
															? "failure"
															: order.orderStatus === "Pending"
															? "dark"
															: "dark"
													}`}
												>
													{order.orderStatus || "Processing"}
												</Badge>
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
												<Button
													size="xs"
													color="failure"
													onClick={() => {
														setShowModal(true);
														setOrderIdToDelete(order._id);
													}}
												>
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
			<Modals show={showModal} onClose={() => setShowModal(false)} popup onDeleteConfirm = {handleDeleteOrder} />
		</div>
	);
}
