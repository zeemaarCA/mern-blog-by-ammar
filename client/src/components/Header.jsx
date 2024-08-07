import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import {
	clearCart,
	setCartItems,
	selectTotalQuantity,
} from "../redux/cart/cartSlice";

export default function Header() {
	const totalQuantity = useSelector(selectTotalQuantity);
	const path = useLocation().pathname;
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

	useEffect(() => {
		if (currentUser) {
			// Fetch cart items after login
			const fetchCartItems = async () => {
				try {
					const res = await fetch(`/api/cart/${currentUser._id}`);
					const data = await res.json();
					if (res.ok) {
						dispatch(setCartItems(data.cart.items));
					}
				} catch (error) {
					console.log(error.message);
				}
			};
			fetchCartItems();
		}
	}, [currentUser, dispatch]);

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

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	return (
		<Navbar className="border-b-2">
			<Link
				to="/"
				className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
					Ammars
				</span>
				Blog
			</Link>
			<form onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</form>
			<Button className="w-12 h-10 lg:hidden" color="gray" pill>
				<AiOutlineSearch />
			</Button>
			<div className="flex gap-3 items-center md:order-2">
				<Link to="/cart" className="relative">
					<LuShoppingCart className="w-[30px] h-[30px]" />
					<span className="absolute top-[-5px] right-[-5px] inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
						{totalQuantity}
					</span>
				</Link>
				<Button
					className="w-12 h-10 hidden sm:inline"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === "light" ? <FaMoon /> : <FaSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar alt="user" img={currentUser.profilePicture} rounded />
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">@{currentUser.username}</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item>Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button gradientDuoTone="purpleToBlue" outline>
							Sign In
						</Button>
					</Link>
				)}

				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === "/"} as={"div"}>
					<Link to="/">Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={"div"}>
					<Link to="/about">About</Link>
				</Navbar.Link>
				<Dropdown label="Products" inline>
					<Link to={"/products"}>
						<Dropdown.Item>All Products</Dropdown.Item>
					</Link>
					<Link to={"category/mobiles"}>
						<Dropdown.Item>Mobile Phone</Dropdown.Item>
					</Link>
					<Link to={"category/cameras"}>
						<Dropdown.Item>Camera</Dropdown.Item>
					</Link>
					<Link to={"category/laptops"}>
						<Dropdown.Item>Laptop</Dropdown.Item>
					</Link>
					<Link to={"category/computers"}>
						<Dropdown.Item>Computers</Dropdown.Item>
					</Link>
				</Dropdown>
			</Navbar.Collapse>
		</Navbar>
	);
}
