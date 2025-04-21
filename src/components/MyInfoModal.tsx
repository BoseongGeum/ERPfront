import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface MyInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newPassword: string) => void;
}

const MyInfoModal: React.FC<MyInfoModalProps> = ({ isOpen, onClose, onSave }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isMatch, setIsMatch] = useState(true);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        setIsMatch(newPassword === confirmPassword);
        setIsValid(validatePassword(newPassword));
    }, [newPassword, confirmPassword]);

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    };

    const handleSave = () => {
        if (!newPassword || !confirmPassword) {
            toast.error("모든 필드를 입력해주세요.");
            return;
        }

        if (!isValid) {
            toast.error("비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
            return;
        }

        if (!isMatch) {
            toast.error("비밀번호가 일치하지 않습니다.");
            return;
        }

        onSave(newPassword);
        toast.success("비밀번호가 변경되었습니다.");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1">새 비밀번호</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="새 비밀번호 입력"
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>

                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="비밀번호 재입력"
                    />
                </div>

                {!isMatch && confirmPassword && (
                    <p className="text-red-500 text-sm mb-2">비밀번호가 일치하지 않습니다.</p>
                )}

                {!isValid && newPassword && (
                    <p className="text-red-500 text-sm mb-2">
                        비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyInfoModal;