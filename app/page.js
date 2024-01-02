"use client"
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import Loader from '@/components/Loader';

export default function Home() {
	const [productForm, setProductForm] = useState({})
	const [products, setProducts] = useState([])
	const [alert, setAlert] = useState('')
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(false)
	const [loadingaction, setLoadingaction] = useState(false)
	const [dropdown, setDropdown] = useState([])

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await fetch('/api/product')
			let rjson = await response.json()
			setProducts(rjson.products)
		}
		fetchProducts()
	}, [])

	const addProduct = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('/api/product', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productForm),
			});

			if (response.ok) {
				// Product added successfully, you can update the UI or perform additional actions.
				console.log('Product added successfully');
				setAlert('Your Product has been Added!')
				setProductForm({})
			} else {
				// Handle errors here
				console.error('Failed to add product');
			}
		} catch (error) {
			console.error('Error:', error);
		}

		// Fetch all the products again to sync back
		const response = await fetch('/api/product')
		let rjson = await response.json()
		setProducts(rjson.products)
	};

	const handleChange = (e) => {
		setProductForm({ ...productForm, [e.target.name]: e.target.value })
	}

	const onDropdownEdit = async (e) => {
		let value = e.target.value
		setQuery(value)
		if (value.length > 3) {
			setLoading(true)
			setDropdown([])
			const response = await fetch('/api/search?query=' + query)
			let rjson = await response.json()
			setDropdown(rjson.products)
			setLoading(false)
		}
		else {
			setDropdown([])
		}
	}

	const buttonAction = async (action, slug, initialQuantity) => {
		// Immediately change the quantity of the product with given slug in products
		let index = products.findIndex((item) => item.slug == slug)
		let newProducts = JSON.parse(JSON.stringify(products))
		if (action == "plus") {
			newProducts[index].quantity = parseInt(initialQuantity) + 1
		}
		else {
			newProducts[index].quantity = parseInt(initialQuantity) - 1
		}
		setProducts(newProducts)

		// Immediately change the quantity of the product with given slug in dropdown
		let indexdrop = dropdown.findIndex((item) => item.slug == slug)
		let newDropdown = JSON.parse(JSON.stringify(dropdown))
		if (action == "plus") {
			newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
			console.log(newDropdown[indexdrop].quantity)
		}
		else {
			newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
		}
		setDropdown(newDropdown)


		console.log(action, slug);
		setLoadingaction(true);

		const response = await fetch('/api/action', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ action, slug, initialQuantity }),
		});
		let r = await response.json()
		console.log(r)
		setLoadingaction(false)
	};


	return (
		<>
			<Header />
			<div className='text-green-800 text-center'>{alert}</div>
			{/* Search Section */}
			<div className="container mx-auto p-4 md:w-[70%] w-[90%] mb-6">
				<h1 className="text-3xl font-semibold mb-4">Search a Product</h1>

				{/* Search Input and Dropdown */}
				<div className="flex items-center mb-2">
					<input
						// onBlur={() => { setDropdown([]) }}
						type="text"
						placeholder="Enter product name..."
						onChange={onDropdownEdit}
						className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline mr-2" />
					<select
						className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
						<option value="">All</option>
						<option value="c1">Select Category</option>
						<option value="c2">Select Category</option>
					</select>
				</div>
				{loading && <Loader />}
				<div className="dropcontainer absolute w-[65vw]  border-1 bg-slate-200 rounded-xl">
					{dropdown.map(item => {
						return <div key={item.slug} className='container flex justify-between  my-1 p-2 border-b-2 border-slate-200 '>
							<span className="slug">{item.slug} ({item.quantity} available for ₹ {item.price})</span>

							<div className="mx-5 ">
								<button
									onClick={() => { buttonAction("minus", item.slug, item.quantity) }}
									disabled={loadingaction} // Ensure loadingaction is used to disable the button
									className="substract bg-slate-400 text-gray-800 px-4 py-2 rounded-full shadow-md cursor-pointer hover:scale-105 transform transition-transform disabled:bg-slate-300"> -</button>


								<span className="qualtity inline-block min-w-3  mx-3">{item.quantity}</span>

								<button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add bg-slate-400 text-gray-800 px-4 py-2 rounded-full shadow-md cursor-pointer hover:scale-105 transform transition-transform disabled:bg-slate-300">+</button>



							</div>
						</div>
					})}
				</div>
			</div >


			{/* Display Current Stock */}
			<div div className="container bg-[#FFFAFA] p-4 mx-auto md:w-[70%] w-[90%]" >

				<h1 className="text-3xl font-semibold mb-4">Add a Product</h1>

				{/* Input Form */}
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Product Slug</label>
					<input
						onChange={handleChange}
						type="text"
						name="slug"
						value={productForm?.slug || ''}
						className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
					<input
						onChange={handleChange}
						type="number"
						name="quantity"
						value={productForm?.quantity || ''}
						className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
					<input
						onChange={handleChange}
						type="number"
						step="0.01"
						name="price"
						value={productForm?.price || ''}
						className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
					/>
				</div>
				<button
					onClick={addProduct}
					className="bg-gradient-to-r from-gray-800 to-slate-700 hover:from-slate-700 hover:to-gray-900 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-gray-400">
					Add Product
				</button>






				<div className="container bg-[#FFFFF0] mx-auto md:w-[70%] w-[90%] my-8">
					<h1 className="text-3xl font-bold mb-4">Display Current Stock</h1>

					{/* Table to display stock */}
					<table className="table-auto w-full mt-4">
						<thead>
							<tr>
								<th className="px-4 py-2">Product Name</th>
								<th className="px-4 py-2">Quantity</th>
								<th className="px-4 py-2">Price</th>
							</tr>
						</thead>
						<tbody>
							{products.map(product => {
								return <tr key={product.slug}>
									<td className="border px-4 py-2">{product.slug}</td>
									<td className="border px-4 py-2">{product.quantity}</td>
									<td className="border px-4 py-2">₹ {product.price}</td>
								</tr>
							})}

						</tbody>
					</table>


				</div>
			</div>
		</>
	);
}