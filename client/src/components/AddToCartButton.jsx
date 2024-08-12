import { useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { MdOutlineShoppingCart } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";

/* eslint-disable react/prop-types */
export default function AddToCartButton({ product, isLoading, isAdded }) {
  const [loading, setLoading] = useState(isLoading || false);
  const [added, setAdded] = useState(isAdded || false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const newProduct = {
      userId: currentUser._id,
      id: product._id,
      // id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      slug: product.slug,
      category: product.category,
      quantity: 1,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/cart/addcart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        dispatch(addItem(newProduct));
        toast.success(`${product.title} added to cart!`);
        setAdded(true);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add item to cart.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      gradientDuoTone="purpleToBlue"
      onClick={handleAddToCart}
      disabled={loading || added}
    >
      {loading ? (
        <>
          <Spinner aria-label="Spinner button example" color={"white"} size="sm" />
          <span className="pl-3">Adding...</span>
        </>
      ) : added ? (
        "Added"
      ) : (
        <>
          <MdOutlineShoppingCart className="mr-2 h-5 w-5" />
          Add to cart
        </>
      )}
    </Button>
  );
}
