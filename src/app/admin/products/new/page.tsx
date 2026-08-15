import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export const metadata = {
  title: "Add Product | Admin",
};

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Add Product</h1>
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </div>
  );
}
