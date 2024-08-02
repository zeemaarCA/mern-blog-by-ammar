import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const UpdatePost = lazy(() => import("./pages/UpdatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));
const Search = lazy(() => import("./pages/Search"));
const CreateProduct = lazy(() => import("./pages/CreateProduct"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Products = lazy(() => import("./pages/Products"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));

import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import PaymentComplete from "./pages/PaymentComplete";
function App() {
	return (
		<>
			<BrowserRouter>
				<CartProvider>
					<ScrollToTop />
					<Header />
					<Suspense fallback={<Loader />}>
						<Routes>
							<Route path="/" element={<Home />}></Route>
							<Route path="/about" element={<About />}></Route>
							<Route path="/projects" element={<Projects />}></Route>
							<Route path="/sign-in" element={<SignIn />}></Route>
							<Route path="/sign-up" element={<SignUp />}></Route>
							<Route path="/search" element={<Search />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/products" element={<Products />} />
							<Route path="/checkout" element={<Checkout />} />
							<Route path="/payment" element={<Payment />} />
							<Route element={<PrivateRoute />}>
								<Route path="/dashboard" element={<Dashboard />}></Route>
								<Route
									path="/payment-complete/:sessionId"
									element={<PaymentComplete />}
								></Route>
							</Route>
							<Route element={<OnlyAdminPrivateRoute />}>
								<Route path="/create-post" element={<CreatePost />}></Route>
								<Route
									path="/create-product"
									element={<CreateProduct />}
								></Route>
								<Route
									path="/update-post/:postId"
									element={<UpdatePost />}
								></Route>
							</Route>
							<Route path="/post/:postSlug" element={<PostPage />}></Route>
							<Route
								path="/product/:productSlug"
								element={<ProductPage />}
							></Route>
						</Routes>
					</Suspense>
					<Toaster
						position="top-center"
						toastOptions={{
							// Define default options
							className: "",
							duration: 5000,
							style: {
								background: "#363636",
								color: "#fff",
							},

							// Default options for specific types
							success: {
								duration: 3000,
								theme: {
									primary: "green",
									secondary: "black",
								},
							},
						}}
					/>
					<FooterCom />
				</CartProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
