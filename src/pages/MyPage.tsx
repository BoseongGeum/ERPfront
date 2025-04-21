import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import UserModal from '../components/UserModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyInfoModal from "../components/MyInfoModal";

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

const MyPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchUserInfo = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            console.error('유저 정보 조회 실패:', err);
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
            await api.put(`/auth/me`, {
                name,
                englishname,
                username,
                role,
                password: password || null,
                position,
                email,
                phoneNumber,
            });
            toast.success('✅ 사용자 정보가 수정되었습니다!');
            await fetchUserInfo();
            setIsModalOpen(false);
            setIsEditMode(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || '❌ 저장 실패');
        }
    };

    const handleDeleteUser = async () => {
        toast.warn(
            ({ closeToast }) => (
                <div className="toast-confirm">
                    <div>정말 탈퇴하시겠어요? 🥺</div>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('jwt');
                                    await api.delete('/auth/me', {
                                        headers: { Authorization: `Bearer ${token}` },
                                    });
                                    toast.success('✅ 회원 탈퇴가 완료되었습니다!');
                                    localStorage.removeItem('jwt');
                                    window.location.href = '/login';
                                } catch (err) {
                                    toast.error('❌ 탈퇴 실패. 다시 시도해주세요.');
                                }
                                closeToast?.();
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            네
                        </button>
                        <button onClick={closeToast} className="px-3 py-1 bg-gray-300 rounded">
                            아니오
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
            }
        );
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg relative mt-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">마이페이지</h2>
            {user ? (
                <div className="space-y-3 text-gray-700">
                    <p><strong>이름:</strong> {user.name}</p>
                    <p><strong>영문 이름:</strong> {user.englishname}</p>
                    <p><strong>전화번호:</strong> {user.phoneNumber}</p>
                    <p><strong>직책:</strong> {user.position}</p>
                    <p><strong>아이디:</strong> {user.username}</p>
                    <p><strong>이메일:</strong> {user.email}</p>
                    <p><strong>권한:</strong> {user.role}</p>
                </div>
            ) : (
                <p className="text-gray-400">사용자 정보를 불러오는 중입니다...</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => {
                        setIsEditMode(true);
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow"
                >
                    정보 수정
                </button>
                <button
                    onClick={handleDeleteUser}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg shadow"
                >
                    회원 탈퇴
                </button>
            </div>

            {isEditMode && user && (
                <MyInfoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    initialData={{
                        email: user.email,
                        phoneNumber: user.phoneNumber
                    }}
                    onSave={(password, email, phoneNumber) => {
                        // 서버에 수정 요청 보내기
                        console.log(password, email, phoneNumber);
                    }}
                />

            )}
            <ToastContainer position="top-center" />
        </div>
    );
};

export default MyPage;
