import { HR, Label, Sidebar } from "flowbite-react";
export default function ProductFilters({
	selectedCategory,
	setSelectedCategory,
	selectedPrice,
	setSelectedPrice,
}) {
	return (
		<Sidebar className="w-full md:w-56 bg-white">
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<h1 className="text-lg font-semibold mb-4">Categories</h1>
					<HR />
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productCategory"
								id="all"
								checked={selectedCategory === "all"}
								onChange={() => setSelectedCategory("all")}
								className="text-pink-500"
							/>
							<Label htmlFor="all">All Products</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productCategory"
								id="mobile"
								checked={selectedCategory === "mobile"}
								onChange={() => setSelectedCategory("mobile")}
								className="text-pink-500"
							/>
							<Label htmlFor="mobile">Mobiles</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productCategory"
								id="computer"
								checked={selectedCategory === "computer"}
								onChange={() => setSelectedCategory("computer")}
								className="text-pink-500"
							/>
							<Label htmlFor="computer">Computer</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productCategory"
								id="laptop"
								checked={selectedCategory === "laptop"}
								onChange={() => setSelectedCategory("laptop")}
								className="text-pink-500"
							/>
							<Label htmlFor="laptop">Laptop</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productCategory"
								id="camera"
								checked={selectedCategory === "camera"}
								onChange={() => setSelectedCategory("camera")}
								className="text-pink-500"
							/>
							<Label htmlFor="camera">Camera</Label>
						</div>
					</Sidebar.Item>
				</Sidebar.ItemGroup>
				<Sidebar.ItemGroup>
					<h1 className="text-lg font-semibold mb-4">Price</h1>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productPrice"
								id="six"
								checked={selectedPrice === "six"}
								onChange={() => setSelectedPrice("six")}
								className="text-pink-500"
							/>
							<Label htmlFor="six">Under $600</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productPrice"
								id="eight"
								checked={selectedPrice === "eight"}
								onChange={() => setSelectedPrice("eight")}
								className="text-pink-500"
							/>
							<Label htmlFor="eight">Under $800</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productPrice"
								id="ten"
								checked={selectedPrice === "ten"}
								onChange={() => setSelectedPrice("ten")}
								className="text-pink-500"
							/>
							<Label htmlFor="ten">Under $1K</Label>
						</div>
					</Sidebar.Item>
					<Sidebar.Item>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								name="productPrice"
								id="fifteen"
								checked={selectedPrice === "fifteen"}
								onChange={() => setSelectedPrice("fifteen")}
								className="text-pink-500"
							/>
							<Label htmlFor="fifteen">Under $1.5K</Label>
						</div>
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
