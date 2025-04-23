import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import MyInfoModal from "../components/MyPageModal/MyInfoModal";
import PasswordVerifyModal from "../components/PasswordVerifyModal";
import ChangePasswordModal from "../components/MyPageModal/ChangePasswordModal"; // 비밀번호 변경 모달 추가
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    englishname: string;
    username: string;
    password: string;
    role: string;
    position: string;
    phoneNumber: string;
    email: string;
}

const MyPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);  // 비밀번호 변경 모달 상태 추가

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
            toast.success('사용자 정보가 수정되었습니다!');
            await fetchUserInfo();
            setIsModalOpen(false);
            setIsEditMode(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || '저장 실패. 다시 시도해주세요.');
        }
    };

    const handleDeleteAccount = async (closeToast: () => void) => {
        try {
            const token = localStorage.getItem('jwt');
            await api.delete('/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('회원 탈퇴가 완료되었습니다!');
            localStorage.removeItem('jwt');
            window.location.href = '/login';
        } catch (err) {
            toast.error('탈퇴 실패. 다시 시도해주세요.');
        } finally {
            closeToast();
        }
    };

    const DeleteConfirmToast = ({ closeToast }: { closeToast: () => void }) => (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="text-lg font-semibold mb-4 text-gray-800 text-center">
                정말 탈퇴하시겠어요?
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => handleDeleteAccount(closeToast)}
                    className="px-5 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition shadow"
                >
                    네, 탈퇴할래요
                </button>
                <button
                    onClick={closeToast}
                    className="px-5 py-2 rounded-lg font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition shadow"
                >
                    아니오
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        if (isVerified) {
            fetchUserInfo();
        }
    }, [isVerified]);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg relative mt-10">
            {/* 인증 모달 */}
            {!isVerified && showVerifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <PasswordVerifyModal
                            onSuccess={() => {
                                setIsVerified(true);
                                setShowVerifyModal(false);
                            }}
                            onClose={() => setShowVerifyModal(false)}
                        />
                    </div>
                </div>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-6">마이페이지</h2>
            {user && isVerified ? (
                <>
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full bg-white text-left">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-6 text-sm font-bold text-gray-700">항목</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-700">내용</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">이름</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.name}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">영문 이름</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.englishname}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">전화번호</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.phoneNumber}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">직책</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.position}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">아이디</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.username}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">이메일</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.email}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3 px-6 text-sm text-gray-700">권한</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{user.role}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)} // 비밀번호 변경 모달 열기
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-5 py-2 rounded-lg shadow"
                        >
                            비밀번호 변경
                        </button>
                        <button
                            onClick={() => {
                                setIsEditMode(true);
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg shadow"
                        >
                            정보 수정
                        </button>
                        <button
                            onClick={() => toast(<DeleteConfirmToast closeToast={toast.dismiss} />, {
                                autoClose: false, // ⛔ 시간 제한 없음
                                closeOnClick: false,
                                closeButton: false,
                                draggable: false,
                            })}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg shadow"
                        >
                            회원 탈퇴
                        </button>
                    </div>

                    <MyInfoModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setIsEditMode(false);
                        }}
                        initialData={isEditMode ? user ?? undefined : undefined}
                        onSave={handleSaveUser}
                    />
                </>
            ) : (
                <p className="text-gray-400">인증을 완료하면 마이페이지를 확인할 수 있어요.</p>
            )}

            {/* 비밀번호 변경 모달 */}
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSave={() => {
                    // 비밀번호 변경 후 추가 작업 처리
                    toast.success("비밀번호가 성공적으로 변경되었습니다.");
                    setIsPasswordModalOpen(false);
                }}
            />
        </div>
    );
};

export default MyPage;
