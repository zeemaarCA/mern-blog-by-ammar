import {
  Badge,
  Button,
  Spinner,
  Table,
  TableCell
} from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Modals from "./Modals";

export default function DashPayments() {
	const { currentUser } = useSelector((state) => state.user);
	const [userPayments, setUserPayments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [paymentIdToDelete, setPaymentIdToDelete] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/payment/allpayments`);
				if (res.ok) {
					const data = await res.json();
					setUserPayments(data);
					// setShowMore(data.length >= 9);
				} else {
					throw new Error("Failed to fetch paymets");
				}
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		if (currentUser) {
			fetchPayments();
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

	const handleDeletePayment = async () => {
		setShowModal(false);
		try {
			const res = await fetch(`/api/order/deleteorder/${paymentIdToDelete}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			}
			if (res.ok) {
				setUserPayments((prev) =>
					prev.filter((order) => order._id !== paymentIdToDelete)
        );
        toast.success("Order deleted successfully");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			<h1 className="text-3xl font-semibold text-center my-6">All Payments</h1>

			<div className="overflow-x-auto w-full">
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<Spinner size="xl" />
					</div>
				) : currentUser && userPayments.length > 0 ? (
					<>
						<Table hoverable>
							<Table.Head>
								{/* <Table.HeadCell>Order Id</Table.HeadCell> */}
								<Table.HeadCell>User Id</Table.HeadCell>
								<Table.HeadCell>Name</Table.HeadCell>
								<Table.HeadCell>Email</Table.HeadCell>
								<Table.HeadCell>Amount</Table.HeadCell>
								<Table.HeadCell>Currency</Table.HeadCell>
								<Table.HeadCell>Payment Method</Table.HeadCell>
								<Table.HeadCell>Status</Table.HeadCell>
								<Table.HeadCell>Payment Date</Table.HeadCell>
								<Table.HeadCell>
									<span>Actions</span>
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y">
								{userPayments.map((payment) => (
									<Table.Row
										key={payment._id}
										className="bg-white dark:border-gray-700 dark:bg-gray-800"
									>

										<TableCell>{payment.userId}</TableCell>
										<TableCell className="whitespace-nowrap">{payment.name}</TableCell>
										<Table.Cell>{payment.user}</Table.Cell>
										<Table.Cell>${formatAmount(payment.amount)}</Table.Cell>
										<Table.Cell>{payment.currency}</Table.Cell>
										<Table.Cell>{payment.paymentMethod}</Table.Cell>
										<Table.Cell><Badge color={payment.status === "paid" ? "success" : "failure"}>{payment.status}</Badge></Table.Cell>
										<Table.Cell>{new Date(payment.createdAt).toLocaleDateString()}</Table.Cell>
										<Table.Cell>
											<div className="flex">
												<Button
													size="xs"
													color="failure"
													onClick={() => {
														setShowModal(true);
														setPaymentIdToDelete(payment._id);
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
					<p className="text-center">You have no payments yet!</p>
				)}
			</div>
			<Modals show={showModal} onClose={() => setShowModal(false)} popup onDeleteConfirm = {handleDeletePayment} />
		</div>
	);
}
