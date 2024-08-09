import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
	HiUser,
	HiArrowSmRight,
	HiDocumentText,
	HiOutlineUserGroup,
	HiAnnotation,
	HiChartPie,
} from "react-icons/hi";
import { TfiPackage } from "react-icons/tfi";
import { IoBagAdd } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";
import { MdPayment } from "react-icons/md";

export default function DashSidebar() {
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	const location = useLocation();
	const [tab, setTab] = useState("");
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");

		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	const handleSignOut = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(clearCart()); // Clear cart data
				// dispatch(clearCustomerData()); // Clear customer data
				dispatch(signoutSuccess()); // signout user
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Sidebar className="w-full md:w-56">
			<Sidebar.Items>
				<Sidebar.ItemGroup className="flex flex-col gap-1">
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=dash">
							<Sidebar.Item
								active={tab === "dash" || !tab}
								icon={HiChartPie}
								as="div"
							>
								Dashboard
							</Sidebar.Item>
						</Link>
					)}
					<Link to="/dashboard?tab=profile">
						<Sidebar.Item
							active={tab === "profile"}
							icon={HiUser}
							label={currentUser.isAdmin ? "Admin" : "User"}
							labelColor="dark"
							as="div"
						>
							Profile
						</Sidebar.Item>
					</Link>
					<Link to="/dashboard?tab=orders">
						<Sidebar.Item
							active={tab === "orders"}
							icon={IoBagAdd}
							labelColor="dark"
							as="div"
						>
							Orders
						</Sidebar.Item>
					</Link>
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=posts">
							<Sidebar.Item
								active={tab === "posts"}
								icon={HiDocumentText}
								as="div"
							>
								Posts
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=products">
							<Sidebar.Item
								active={tab === "products"}
								icon={TfiPackage}
								as="div"
							>
								Products
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=allorders">
							<Sidebar.Item
								active={tab === "allorders"}
								icon={IoBagAdd}
								as="div"
							>
								All Orders
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=payments">
							<Sidebar.Item
								active={tab === "payments"}
								icon={MdPayment}
								as="div"
							>
								Payments
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/create-product">
							<Sidebar.Item icon={AiOutlineProduct} as="div">
								Add Product
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=users">
							<Sidebar.Item
								active={tab === "users"}
								icon={HiOutlineUserGroup}
								as="div"
							>
								Users
							</Sidebar.Item>
						</Link>
					)}
					{currentUser.isAdmin && (
						<Link to="/dashboard?tab=comments">
							<Sidebar.Item
								active={tab === "comments"}
								icon={HiAnnotation}
								as="div"
							>
								Comments
							</Sidebar.Item>
						</Link>
					)}
					<Sidebar.Item
						icon={HiArrowSmRight}
						className="cursor-pointer"
						onClick={handleSignOut}
					>
						Sign Out
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
