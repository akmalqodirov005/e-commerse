import { Table, Button, Popconfirm } from "antd";
import React, { useState } from "react";
import api from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AdminAddUsers from "./AdminAddUsers";

const AdminUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });

  const { mutate: deleteUser, isPending: deleteLoading } = useMutation({
    mutationFn: (id) => {
      setDeleteUserId(id);
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setDeleteUserId(null);
    },
    onError: () => {
      toast.error("Failed to delete user");
      setDeleteUserId(null);
    },
  });

  const columns = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span className="text-gray-600 text-xs md:text-sm">{text}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium inline-block
            ${
              role === "admin"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      width: 120,
      render: () => <span className="text-gray-400 text-sm">••••••••</span>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, data) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setIsModalOpen(true), setUserData(data);
            }}
            type="primary"
            size="small"
            className="!bg-gray-900 !border-none hover:!bg-black transition-all"
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(data.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              loading={deleteLoading && deleteUserId === data.id}
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
      <AdminAddUsers
        userData={userData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Users
        </h1>

        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          className="!bg-gray-900 !border-none hover:!bg-black transition-all rounded-xl px-6 py-2 h-auto w-full sm:w-auto"
        >
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data}
          scroll={{ x: 700 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
