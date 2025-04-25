import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import UserModal from '../components/UserModal';
import { toast } from 'react-toastify';

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

const getRoleFromToken = (token: string): string | null => {
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid token format');

        const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodedPayload);

        return payload?.role ?? null;
    } catch (e) {
        console.error('토큰 파싱 오류:', e);
        return null;
    }
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [selectedUsernames, setSelectedUsernames] = useState<Set<string>>(new Set());

    const token = localStorage.getItem("jwt"); // 관리자 여부 확인용
    const role = token ? getRoleFromToken(token) : null;
    const isAdmin = role === 'ADMIN';

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch (err) {
            console.error('유저 목록 조회 실패:', err);
        }
    };

    const withAdminCheck = <T extends (...args: any[]) => void>(callback: T): T => {
        return ((...args: any[]) => {
            if (!isAdmin) {
                toast.warning('권한이 없습니다', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                return;
            }
            callback(...args);
        }) as T;
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
                toast.success('사용자 정보가 수정되었습니다.');
            } else {
                await api.post('/auth/register', {
                    name, englishname, username, password, role, position, email, phoneNumber
                });
                toast.success('새 사용자가 등록되었습니다.');
            }

            await fetchUsers();
            setIsModalOpen(false);
            setSelectedUser(null);
            setIsEditMode(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || '저장에 실패했습니다.');
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

    const handleDeleteSelected = async (closeToast: () => void) => {
        if (selectedUsernames.size === 0) {
            toast.info('삭제할 사용자를 선택하세요.');
            return;
        }

        try {
            await api.put('/auth/resign', Array.from(selectedUsernames));
            toast.success('선택한 사용자가 삭제되었습니다.');
            await fetchUsers();
            setSelectedUserIds(new Set());
            setSelectedUsernames(new Set());
        } catch (err) {
            console.error('삭제 실패:', err);
            toast.error('삭제에 실패했습니다.');
        } finally {
            closeToast();
        }
    };

    const DeleteConfirmToast = ({ closeToast }: { closeToast: () => void }) => (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="text-lg font-semibold mb-4 text-gray-800 text-center">
                정말 삭제하시겠어요?
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => handleDeleteSelected(closeToast)}
                    className="px-5 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition shadow"
                >
                    네, 삭제할래요
                </button>
                <button
                    onClick={closeToast}
                    className="px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition shadow"
                >
                    아니오
                </button>
            </div>
        </div>
    );

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
                            if (selectedUserIds.size !== 0) {
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
                        {selectedUserIds.size !== 0 ? '전체 해제' : '전체 선택'}
                    </button>
                        <button
                            onClick={withAdminCheck(() => {
                                setIsModalOpen(true);
                                setIsEditMode(false);
                                setSelectedUser(null);
                            })}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow"
                        >
                            + 사용자 등록
                        </button>
                </div>
            </div>

            {selectedUserIds.size > 0 && (
                <div className="fixed top-0 left-0 right-0 z-10 font-bold bg-black text-xl text-white pl-10 pr-4 py-2 rounded shadow mb-4 flex justify-between items-center">
                    <span><strong>{selectedUserIds.size}</strong> 명 선택됨</span>
                    <button
                        onClick={withAdminCheck(() => {
                            toast(<DeleteConfirmToast closeToast={toast.dismiss} />, {
                                autoClose: false,
                                closeOnClick: false,
                                closeButton: false,
                                draggable: false,
                            });
                        })}
                        className="bg-red-600 hover:bg-red-700 px-5 py-2 text-base rounded-lg shadow"
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
                        <th className="px-6 py-3 border-b font-bold">이름</th>
                        <th className="px-6 py-3 border-b font-bold">영문이름</th>
                        <th className="px-6 py-3 border-b font-bold">직급</th>
                        <th className="px-6 py-3 border-b font-bold">이메일</th>
                        <th className="px-6 py-3 border-b font-bold">전화번호</th>
                        <th className="px-6 py-3 border-b font-bold">아이디</th>
                        <th className="px-6 py-3 border-b font-bold">권한</th>
                        <th className="px-6 py-3 border-b"></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => toggleSelectUser(user.id)}
                            className={`border-b text-gray-700 cursor-pointer transition-colors duration-150 ${
                                selectedUserIds.has(user.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                            }`}
                        >
                            <td className="px-4 py-4">
                                {selectedUserIds.has(user.id) ? (
                                    <span className="text-blue-500 font-bold">✔</span>
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
                                            e.stopPropagation();  // 수정 버튼 클릭 시 이벤트 전파 막기
                                            withAdminCheck((e) => {
                                                handleEditClick(user);
                                            })(e);
                                        }}
                                    >
                                        수정
                                    </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={9} className="px-6 py-6 text-gray-400">
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
