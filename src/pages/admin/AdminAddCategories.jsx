import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Validation schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const AdminAddCategories = ({ isModalOpen, setIsModalOpen, categoryData }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  // Slug generator
  const createSlug = (name) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    if(categoryData){
      reset({
        name: categoryData.name,
        image: categoryData.image
      })
    }
  }, [categoryData])
  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api[categoryData ? 'put' : 'post'](`/categories/${categoryData ? categoryData.id : ''}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Category ${categoryData ? 'updated' : 'added'} successfully`);
      setIsModalOpen(false);
      reset();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add category";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    const slug = createSlug(data.name);
    mutate({ ...data, slug });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">Add Category</span>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g., Electronics"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.name 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Image URL Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            {...register("image")}
            type="text"
            placeholder="https://example.com/image.jpg"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.image 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
          )}
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
            {isPending ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminAddCategories;