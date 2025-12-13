import { Button, Popconfirm, Table } from "antd";
import { useState } from "react";
import api from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AdminAddLocations from "./AdminAddLocations";

const AdminLocations = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [locationsData, setLocationsData] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await api.get("/locations");
      return res.data;
    },
  });

  const { mutate: deleteLocation, isPending: deleteLoading } = useMutation({
    mutationFn: (id) => {
      setDeleteLocationId(id);
      return api.delete(`/locations/${id}`);
    },
    onSuccess: () => {
      toast.success("Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      setDeleteLocationId(null);
    },
    onError: () => {
      toast.error("Failed to delete location");
      setDeleteLocationId(null);
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
          alt="location"
          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <span className="text-gray-500 line-clamp-2 text-sm">
          {text || "—"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setLocationsData(record);
              setIsModalOpen(true);
            }}
            type="primary"
            size="small"
            className="!bg-gray-900 !text-white !border-none hover:!bg-black transition-all"
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete location"
            description="Are you sure you want to delete this location?"
            onConfirm={() => deleteLocation(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              loading={deleteLoading && deleteLocationId === record.id}
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
      <AdminAddLocations
        locationsData={locationsData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Locations
        </h1>

        <Button
          type="primary"
          onClick={() => {
            setLocationsData(null);
            setIsModalOpen(true);
          }}
          className="!bg-gray-900 !border-none !text-white hover:!bg-black transition-all rounded-xl px-6 py-2 h-auto w-full sm:w-auto"
        >
          Add Location
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} locations`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminLocations;