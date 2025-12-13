import { Button, Modal } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// Validation schema
const locationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const AdminAddLocations = ({ isModalOpen, setIsModalOpen, locationsData }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      image: "",
    },
  });

  // useEffect(() => {
  //   reset({
  //     name: locationsData.name,
  //     description: locationsData.description
  //   })
  // }, locationsData)

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api[locationsData? 'put' : 'post'](`/locations/${locationsData ? locationsData.id : ''}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location added successfully");
      setIsModalOpen(false);
      reset();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add location";
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
      title={<span className="text-xl font-semibold">Add Location</span>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Location Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="e.g., Tashkent City Center"
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

        {/* Slug Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            {...register("slug")}
            placeholder="e.g., tashkent-city-center"
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

        {/* Address Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("address")}
            placeholder="e.g., Amir Temur Avenue, Tashkent"
            rows={3}
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all resize-none
              ${errors.address 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Image URL Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            {...register("image")}
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
            {isPending ? "Saving..." : "Save Location"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminAddLocations;