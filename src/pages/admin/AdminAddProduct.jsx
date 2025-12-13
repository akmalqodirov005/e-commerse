import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { Button, Modal } from "antd";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// Validation schema
const productScheme = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive("Price must be positive"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  categoryId: z.number({ invalid_type_error: "Category is required" }).positive("Please select a category"),
  image1: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image2: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image3: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const AdminAddProduct = ({ isModalOpen, setIsModalOpen, productData }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productScheme),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      slug: "",
      categoryId: "",
      image1: "",
      image2: "",
      image3: "",
    },
  });

  useEffect(() => {
    console.log(productData);
    
    if(productData){
      reset({
        slug: productData.slug,
        id: productData.id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        categoryId: productData.category.id,
        image1: productData.images?.[0] || "",
        image2: productData.images?.[1] || "",
        image3: productData.images?.[2] || "",
      })
    }
  }, [productData])

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      // Collect all non-empty image URLs
      const images = [data.image1, data.image2, data.image3].filter(img => img && img.trim() !== "");
      
      const res = await api[productData ? 'put' : 'post'](`/products/${productData ? productData.id : ''}`, {
        title: data.title,
        price: data.price,
        description: data.description,
        slug: data.slug,
        categoryId: data.categoryId,
        images: images,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Product ${productData ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      reset();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add product";
      toast.error(message);
    },
  });

  const onSubmit = (data) => mutate(data);

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">{productData ? 'Edit Product' : 'Add Product'}</span>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
        {/* Title Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            type="text"
            placeholder="e.g., iPhone 15 Pro"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.title 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Price Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="e.g., 999.99"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.price 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Slug Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            {...register("slug")}
            type="text"
            placeholder="e.g., iphone-15-pro"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all font-mono
              ${errors.slug 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Category Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all bg-white cursor-pointer
              ${errors.categoryId 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe your product..."
            rows={4}
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all resize-none
              ${errors.description 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Image URLs Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            Product Images (Up to 3)
          </label>

          {/* Image 1 */}
          <div className="flex flex-col gap-1.5">
            <input
              {...register("image1")}
              type="text"
              placeholder="Image 1 URL: https://example.com/image1.jpg"
              className={`border rounded-lg px-4 py-2.5 text-sm transition-all
                ${errors.image1 
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                  : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
                } outline-none`}
            />
            {errors.image1 && (
              <p className="text-xs text-red-500 mt-1">{errors.image1.message}</p>
            )}
          </div>

          {/* Image 2 */}
          <div className="flex flex-col gap-1.5">
            <input
              {...register("image2")}
              type="text"
              placeholder="Image 2 URL: https://example.com/image2.jpg"
              className={`border rounded-lg px-4 py-2.5 text-sm transition-all
                ${errors.image2 
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                  : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
                } outline-none`}
            />
            {errors.image2 && (
              <p className="text-xs text-red-500 mt-1">{errors.image2.message}</p>
            )}
          </div>

          {/* Image 3 */}
          <div className="flex flex-col gap-1.5">
            <input
              {...register("image3")}
              type="text"
              placeholder="Image 3 URL: https://example.com/image3.jpg"
              className={`border rounded-lg px-4 py-2.5 text-sm transition-all
                ${errors.image3 
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                  : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
                } outline-none`}
            />
            {errors.image3 && (
              <p className="text-xs text-red-500 mt-1">{errors.image3.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-2">
          <Button
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 h-10 rounded-lg border-gray-300 hover:!border-gray-400 transition-all"
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={isPending}
            className="flex-1 h-10 !bg-black !border-none hover:!bg-gray-800 rounded-lg transition-all"
          >
            {isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminAddProduct;