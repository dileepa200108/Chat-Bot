import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("https://backend-test-production-ed922.up.railway.app/api/products", product);
      setMessage("Product added successfully!");
      setProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
      });
    } catch (error) {
      setMessage("Error adding product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Add Product</h2>
        </div>
        {message && (
          <div className={`rounded-md p-4 ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            <p className="text-sm font-medium text-center">{message}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {[
              { id: "name", type: "text", placeholder: "Product Name" },
              { id: "price", type: "number", placeholder: "Price" },
              { id: "description", type: "text", placeholder: "Description" },
              { id: "category", type: "text", placeholder: "Category" },
              { id: "stock", type: "number", placeholder: "Stock" },
            ].map((field, index) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="sr-only">
                  {field.placeholder}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm
                    ${index === 0 ? "rounded-t-md" : ""}
                    ${index === 4 ? "rounded-b-md" : ""}
                  `}
                  placeholder={field.placeholder}
                  value={product[field.id]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;