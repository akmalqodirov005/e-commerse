import { Table, Button, Popconfirm } from "antd";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminAddProduct from "./AdminAddProduct";
import { useState } from "react";
import { toast } from "sonner";

const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [productData, setProductData] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get(`/products/`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: deleteProduct, isPending: deleteLoading } = useMutation({
    mutationFn: (id) => {
      setDeleteProductId(id);
      return api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setDeleteProductId(null);
    },
    onError: () => {
      toast.error("Failed to delete product");
      setDeleteProductId(null);
    },
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="text-gray-800 font-medium text-sm md:text-base">
          {text}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span className="text-gray-700 text-sm md:text-base">${text}</span>
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="text-gray-500 line-clamp-2 text-sm">
          {text || "—"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, data) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setProductData(data);
                setIsModalOpen(true);
              }}
              type="primary"
              size="small"
              className="!bg-gray-900 !border-none hover:!bg-black transition-all"
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete product"
              description="Are you sure you want to delete this product?"
              onConfirm={() => deleteProduct(data.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                danger
                loading={deleteLoading && data.id === deleteProductId}
                className="hover:!border-red-400 transition-all"
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminAddProduct
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        productData={productData}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Products
        </h1>

        <Button
          type="primary"
          className="!bg-gray-900 !border-none hover:!bg-black transition-all rounded-xl px-6 py-2 h-auto w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
