'use client';
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchBox from "../search/SearchBox";

const ManageUsers = ({ u }) => {
    const user = useSelector((state) => state.user.userData);
    const [users, setUsers] = useState(u);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        setUsers(u);
    }, [u]);

    const handleRoleChange = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`/api/puts/change-role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: selectedUser._id, role: newRole, updatedBy: user.email }),
            });

            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.message || "Role updated successfully");
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === selectedUser._id ? { ...u, role: newRole } : u
                    )
                );
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update role");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred");
        } finally {
            setShowModal(false);
            setSelectedUser(null);
            setNewRole("");
        }
    };

    const confirmRoleChange = (user, role) => {
        setSelectedUser(user);
        setNewRole(role);
        setShowModal(true);
    };

    const userRows = useMemo(() => {
        return users.map((user) => (
            <tr
                key={user._id}
                className="border-b odd:bg-gray-100 dark:odd:bg-gray-700 even:bg-white dark:even:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
                <td className="py-2 px-4 text-sm">{user.name}</td>
                <td className="py-2 px-4 text-sm">{user.email}</td>
                <td className="py-2 px-4 text-sm">{user.role}</td>
                <td className="py-2 px-4 text-sm">{user.status}</td>
                <td className="py-2 px-4 text-sm">
                    {user.role === "user" ? (
                        <button
                            onClick={() => confirmRoleChange(user, "admin")}
                            className="bg-green-500 min-w-[150px] text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Promote to Admin
                        </button>
                    ) : (
                        <button
                            onClick={() => confirmRoleChange(user, "user")}
                            className="bg-red-500 min-w-[150px] text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Demote to User
                        </button>
                    )}
                </td>
            </tr>
        ));
    }, [users]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">Manage Users</h1>
            <SearchBox placeholder={"search with name or email"} />
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead className="bg-slate-200 dark:bg-slate-600">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium min-w-[160]">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Email</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Role</th>
                            <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                            <th className="py-3 px-4 md:text-left text-center text-sm font-medium min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>{userRows}</tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-600 rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirm Role Change</h2>
                        <p className="text-gray-700 dark:text-white mb-6">
                            Are you sure you want to change the role of{" "}
                            <strong>{selectedUser.name}</strong> to{" "}
                            <strong>{newRole}</strong>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={handleRoleChange}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;