import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import UserModal from '../components/UserModal';

interface User {
    id: number;
    name: string;
    englishname: string;
    username: string;
    role: string;
    position: string;
    phoneNumber: string;
    email: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [selectedUsernames, setSelectedUsernames] = useState<Set<string>>(new Set());

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error('유저 목록 조회 실패:', err);
        }
    };

    const handleSaveUser = async (
        name: string,
        englishname: string,
        username: string,
        password: string,
        role: string,
        position: string,
        email: string,
        phoneNumber: string,
    ) => {
        try {
            if (isEditMode && selectedUser) {
                await api.put(`/auth/modify/${selectedUser.username}`, {
                    name,
                    englishname,
                    username,
                    role,
                    password: password || null,
                    position,
                    email,
                    phoneNumber,
                });
            } else {
                await api.post('/auth/register', { name, englishname, username, password, role, position, email, phoneNumber });
            }

            await fetchUsers();
            setIsModalOpen(false);
            setSelectedUser(null);
            setIsEditMode(false);
        } catch (err: any) {
            alert(err.response?.data?.message || '저장 실패');
        }
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const toggleSelectUser = (id: number) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });

        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUsernames(prev => {
                const newSet = new Set(prev);
                if (newSet.has(user.username)) {
                    newSet.delete(user.username);
                } else {
                    newSet.add(user.username);
                }
                return newSet;
            });
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedUsernames.size === 0) {
            alert('삭제할 사용자를 선택하세요.');
            return;
        }

        const confirmed = window.confirm('선택한 사용자를 삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            await api.delete('/auth/delete', {
                data: Array.from(selectedUsernames), // ["admin", "tester"]
            });
            await fetchUsers();
            setSelectedUserIds(new Set());
            setSelectedUsernames(new Set());
        } catch (err) {
            console.error('삭제 실패:', err);
            alert('삭제에 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg relative">
            <div className="flex justify-between items-center mb-2 mt-2">
                <h2 className="text-3xl font-semibold text-gray-800">사용자 관리</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (selectedUserIds.size === users.length) {
                                setSelectedUserIds(new Set());
                                setSelectedUsernames(new Set());
                            } else {
                                const ids = new Set(users.map(user => user.id));
                                const usernames = new Set(users.map(user => user.username));
                                setSelectedUserIds(ids);
                                setSelectedUsernames(usernames);
                            }
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg shadow"
                    >
                        {selectedUserIds.size === users.length ? '전체 해제' : '전체 선택'}
                    </button>
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setIsEditMode(false);
                            setSelectedUser(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow"
                    >
                        + 사용자 등록
                    </button>
                </div>
            </div>

            {selectedUserIds.size > 0 && (
                <div className="sticky top-0 z-10 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded shadow mb-4 flex justify-between items-center">
                    <span>{selectedUserIds.size}명 선택됨</span>
                    <button
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow"
                    >
                        선택 삭제
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 border-b w-12"></th>
                        <th className="px-6 py-3 border-b">이름</th>
                        <th className="px-6 py-3 border-b">영문이름</th>
                        <th className="px-6 py-3 border-b">직급</th>
                        <th className="px-6 py-3 border-b">이메일</th>
                        <th className="px-6 py-3 border-b">전화번호</th>
                        <th className="px-6 py-3 border-b">아이디</th>
                        <th className="px-6 py-3 border-b">권한</th>
                        <th className="px-6 py-3 border-b"></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => toggleSelectUser(user.id)}
                            className={`border-b text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                                selectedUserIds.has(user.id) ? 'bg-red-100' : ''
                            }`}
                        >
                            <td className="px-4 py-4">
                                {selectedUserIds.has(user.id) ? (
                                    <span className="text-red-500 font-bold">✔</span>
                                ) : (
                                    ''
                                )}
                            </td>
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.englishname}</td>
                            <td className="px-6 py-4 border-b">{user.position}</td>
                            <td className="px-6 py-4 border-b">{user.email}</td>
                            <td className="px-6 py-4 border-b">{user.phoneNumber}</td>
                            <td className="px-6 py-4">{user.username}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <button
                                    className="text-blue-500 hover:underline font-bold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(user);
                                    }}
                                >
                                    수정
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-6 text-gray-400">
                                등록된 사용자가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setSelectedUser(null);
                }}
                onSave={handleSaveUser}
                initialData={isEditMode ? selectedUser ?? undefined : undefined}
                isEdit={isEditMode}
            />
        </div>
    );
};

export default UserManagement;
