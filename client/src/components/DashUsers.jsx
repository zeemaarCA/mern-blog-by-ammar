import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modals from "./Modals";

export default function DashUsers() {
	const { currentUser } = useSelector((state) => state.user);
	const [users, setUsers] = useState([]);
	const [showMore, setShowMore] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState("");
	const [warning, setWarning] = useState("");
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/user/getusers`);
				const data = await res.json();
				if (res.ok) {
					setUsers(data.users);
					setLoading(false);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
					if (data.posts.length === 0) {
						setWarning("You have no users yet!");
					}
				}
			} catch (error) {
				console.log(error.message);
				setLoading(false);
			}
		};
		if (currentUser.isAdmin) {
			fetchUsers();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = users.length;

		try {
			const res = await fetch(
				`/api/user/getusers?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUsers((prev) => [...prev, ...data.users]);
				if (data.users.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeleteUser = async () => {
		setShowModal(false);
		try {
			const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message);
			}
			if (res.ok) {
				setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
				toast.success("User deleted successfully");
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
			{loading ? (
				<div className="flex justify-center items-center min-h-screen">
					<Spinner size="xl" />
				</div>
			) : currentUser.isAdmin && users.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date created</Table.HeadCell>
							<Table.HeadCell>User image</Table.HeadCell>
							<Table.HeadCell>Username</Table.HeadCell>
							<Table.HeadCell>Email</Table.HeadCell>
							<Table.HeadCell>Admin</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						{users.map((user) => (
							<Table.Body className="divide-y" key={user._id}>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell>
										{new Date(user.updatedAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${user.slug}`}>
											<img
												src={user.profilePicture}
												alt={user.username}
												className="w-20 h-10 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>{user.username}</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										{user.isAdmin ? (
											<FaCheck className="text-green-500" />
										) : (
											<FaTimes className="text-red-500" />
										)}
									</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setUserIdToDelete(user._id);
											}}
											className="font-medium text-red-500 hover:underline cursor-pointer"
										>
											Delete
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-teal-500 hover:underline"
											to={`/update-post/${user._id}`}
										>
											<span>Edit</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7"
						>
							Show more
						</button>
					)}
				</>
			) : (
				<>{warning ? <p>{warning}</p> : ""}</>
			)}
			<Modals
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				onDeleteConfirm={handleDeleteUser}
			/>
		</div>
	);
}
