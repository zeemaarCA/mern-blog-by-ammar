import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import { setLoading, setCartItems, updateItemQuantity, removeItem } from "../redux/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const [recentProducts, setRecentProducts] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        dispatch(setLoading(true));
        const res = await fetch(`/api/cart/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          dispatch(setCartItems(data.cart.items));
        }
      } catch (error) {
        console.log(error.message);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCartItems();
  }, [currentUser, dispatch]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch("/api/product/getproducts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentProducts(data.products);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentProducts();
  }, []);

	const updateCartItemQuantity = async (itemId, newQuantity) => {
		try {
			// Create a new cart with updated item quantity
			const updatedCartItems = cartItems.map((item) =>
				item.id === itemId ? { ...item, quantity: newQuantity } : item
			);

			// Send the entire cart data to the server
			const res = await fetch(`/api/cart/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ items: updatedCartItems }),
			});

			if (res.ok) {
				const data = await res.json();
				dispatch(updateItemQuantity({ id: itemId, quantity: newQuantity }));
				dispatch(setCartItems(data.cart.items));
				// toast.success('Item quantity updated');
			} else {
				throw new Error('Failed to update item quantity');
			}
		} catch (error) {
			console.log(error.message);
			dispatch(setError(error.message));
		}
	};

  const incrementQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = (item.quantity || 1) + 1;
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const decrementQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await fetch(`/api/cart/${currentUser._id}/${itemId}`, { method: 'DELETE' });
      dispatch(removeItem(itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>

          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            {cartItems.length > 0 ? (
              <>
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="space-y-6">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <a href="#" className="shrink-0 md:order-1">
                            <img
                              className="h-20 w-20 dark:hidden"
                              src={item.image}
                              alt="Product image"
                            />
                            <img
                              className="hidden h-20 w-20 dark:block"
                              src={item.image}
                              alt="Product image"
                            />
                          </a>
                          <label htmlFor="counter-input" className="sr-only">
                            Choose quantity:
                          </label>
                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                id="decrement-button"
                                data-input-counter-decrement="counter-input"
                                onClick={() => decrementQuantity(item.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="text"
                                id="counter-input"
                                data-input-counter
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                type="button"
                                id="increment-button"
                                data-input-counter-increment="counter-input"
                                onClick={() => incrementQuantity(item.id)}
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                              >
                                <FaPlus />
                              </button>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <a
                              href="#"
                              className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                            >
                              {item.title}
                              {item.category}
                            </a>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Order summary
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Original price
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            ${calculateTotalPrice()}
                          </dd>
                        </dl>
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Savings
                          </dt>
                          <dd className="text-base font-medium text-green-600">
                            0
                          </dd>
                        </dl>
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Tax
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            0
                          </dd>
                        </dl>
                      </div>
                      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">
                          Total
                        </dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">
                          ${calculateTotalPrice()}
                        </dd>
                      </dl>
                    </div>
                    <Link
                      to={"/checkout"}
                      className="w-full mt-5 block text-center bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-sm py-3 px-4 rounded-md text-white"
                    >
                      Proceed to Checkout
                    </Link>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {" "}
                        or{" "}
                      </span>
                      <Link to={"/products"}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                      >
                        Continue Shopping
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Your cart is empty.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-xl mt-5">Recent Products</h1>
            <div className="flex flex-wrap gap-5 mt-5 justify-center">
              {recentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
