import { Button, Popconfirm, Table } from "antd";
import React, { useState } from "react";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AdminAddCategories from "./AdminAddCategories";

const AdminCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryData, setCategoryData] = useState(null)

  const queryClient = useQueryClient();
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  const { mutate: deleteCategory, isPending: deleteLoading } = useMutation({
    mutationFn: (id) => {
      setDeleteCategoryId(id);
      return api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      setDeleteCategoryId(null);
    },
    onError: () => {
      toast.error("Failed to delete category");
      setDeleteCategoryId(null);
    },
  });

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (img) => (
        <img
          src={img}
          alt="category"
          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="text-gray-800 font-medium text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => (
        <span className="text-gray-600 text-xs md:text-sm font-mono">
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, data) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setIsModalOpen(true),
              setCategoryData(data)
            }}
            type="primary"
            size="small"
            className="!bg-gray-900 !border-none hover:!bg-black transition-all"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => deleteCategory(data.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              loading={deleteLoading && data.id === deleteCategoryId}
              className="hover:!border-red-400 transition-all"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Categories
        </h1>
        <AdminAddCategories categoryData={categoryData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        <Button
          onClick={() => setIsModalOpen(true)}
          type="primary"
          className="!bg-gray-900 !border-none hover:!bg-black transition-all rounded-xl px-6 py-2 h-auto w-full sm:w-auto"
        >
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data}
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminCategories;