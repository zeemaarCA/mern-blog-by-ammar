import { Button, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import Modals from "./Modals";

export default function DashPosts() {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState("");
	const [loading, setLoading] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setLoading(false);
					setUserPosts(data.posts);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				setLoading(false);
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	const handleShowMore = async () => {
		const startIndex = userPosts.length;

		try {
			setButtonLoading(true);
			const res = await fetch(
				`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setButtonLoading(false);
				setUserPosts((prev) => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error.message);
			setButtonLoading(false);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			}
			if (res.ok) {
				setUserPosts((prev) =>
					prev.filter((post) => post._id !== postIdToDelete)
				);
				toast.success("Post deleted successfully");
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
			) : currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Date updated</Table.HeadCell>
							<Table.HeadCell>Post image</Table.HeadCell>
							<Table.HeadCell>Post title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map((post) => (
							<Table.Body className="divide-y" key={post._id}>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell>
										{new Date(post.updatedAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img
												src={post.image}
												alt={post.title}
												className="w-20 h-10 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="font-medium text-gray-900 dark:text-white"
											to={`/post/${post.slug}`}
										>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setPostIdToDelete(post._id);
											}}
											className="font-medium text-red-500 hover:underline cursor-pointer"
										>
											Delete
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="text-teal-500 hover:underline"
											to={`/update-post/${post._id}`}
										>
											<span>Edit</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
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
				<p>You have no posts yet!</p>
			)}
			<Modals
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				onDeleteConfirm={handleDeletePost}
			/>
		</div>
	);
}
