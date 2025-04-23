import React, {useState, useEffect, useRef} from "react";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        newPassword: string,
        currentPassword: string
    ) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onSave,
                                                                 }) => {
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isMatch, setIsMatch] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [isDifferent, setIsDifferent] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsMatch(true);
            setIsValid(true);
            setIsDifferent(true);
            inputRef.current?.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        setIsDifferent(currentPassword !== newPassword);
        setIsMatch(newPassword === confirmPassword);
        setIsValid(validatePassword(newPassword));
    }, [currentPassword, newPassword, confirmPassword]);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    };

    const handleSave = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("모든 필드를 입력해주세요.");
            return;
        }

        if (!isDifferent) {
            toast.error("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
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

        try {
            await api.put("/auth/me/password", { currentPassword, newPassword });
            onSave(currentPassword, newPassword);
            onClose();
        } catch (error) {
            toast.error("비밀번호 변경에 실패했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        placeholder="현재 비밀번호 입력"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        placeholder="새 비밀번호 입력"
                    />
                </div>

                {!isDifferent && currentPassword && newPassword && (
                    <p className="text-red-500 text-sm mb-2">
                        새 비밀번호는 현재 비밀번호와 달라야 합니다.
                    </p>
                )}

                {!isValid && newPassword && (
                    <p className="text-red-500 text-sm mb-2">
                        비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                        placeholder="비밀번호 재입력"
                    />
                </div>

                {!isMatch && confirmPassword && (
                    <p className="text-red-500 text-sm mb-2">비밀번호가 일치하지 않습니다.</p>
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

export default ChangePasswordModal;
