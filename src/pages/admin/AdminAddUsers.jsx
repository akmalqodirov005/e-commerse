import { Button, Modal } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import api from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// Validation schema
const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user"], { errorMap: () => ({ message: "Select a valid role" }) }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

const AdminAddUsers = ({ isModalOpen, setIsModalOpen, userData }) => {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
      avatarUrl: "",
    },
  });
  console.log(userData);
  
  useEffect(() => {
    if(userData){
      reset({
        name: userData.name,
        avatarUrl: userData.avatar,
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
    }
  }, [userData])

  // Upload + Create
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      for (let key in data) {
        if (data[key]) formData.append(key, data[key]);
      }

      // If file exists, add to formData
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await api[userData ? 'put' : 'post'](`/users/${userData ? userData.id : ''}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${userData ? 'updated' : 'added'} successfully`);
      handleCancel();
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Failed to add user";
      toast.error(message);
    },
  });

  const onSubmit = (data) => mutate(data);

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
    setAvatarFile(null);
    setPreview(null);
  };

  // Preview image
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("avatarUrl", ""); // reset URL input
    }
  };

  return (
    <Modal
      title={<span className="text-xl font-semibold">Add User</span>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-4">
        
        {/* Avatar Preview */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="avatar preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        {/* Avatar File Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Avatar (Upload)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
        </div>

        {/* Avatar URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Avatar URL (optional)
          </label>
          <input
            {...register("avatarUrl")}
            type="text"
            placeholder="https://example.com/avatar.jpg"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.avatarUrl 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
            onInput={() => {
              setAvatarFile(null);
              setPreview(null);
            }}
          />
          {errors.avatarUrl && (
            <p className="text-xs text-red-500 mt-1">{errors.avatarUrl.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Full Name *</label>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g., John Doe"
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

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Email *</label>
          <input
            {...register("email")}
            type="email"
            placeholder="e.g., john@example.com"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.email 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Role *</label>
          <select
            {...register("role")}
            className="border rounded-lg px-4 py-2.5 text-sm bg-white cursor-pointer"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Password *</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Minimum 6 characters"
            className={`border rounded-lg px-4 py-2.5 text-sm transition-all
              ${errors.password 
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200"
              } outline-none`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <Button
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 h-10 rounded-lg border-gray-300"
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            loading={isPending}
            className="flex-1 h-10 !bg-black !border-none hover:!bg-gray-800 rounded-lg"
          >
            {isPending ? "Saving..." : "Save User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminAddUsers;