import React, { useEffect, useRef, useState} from 'react';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';

interface PasswordVerifyModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

const PasswordVerifyModal: React.FC<PasswordVerifyModalProps> = ({ onSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleVerify = async () => {
        if (!password) {
            toast.warning('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/auth/me/verify', { password });

            if (response.status === 200) {
                toast.success('비밀번호 확인 완료');
                onSuccess();
                onClose();
            } else {
                toast.error('비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            toast.error('비밀번호 확인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">비밀번호 확인</h2>
                <p className="mb-2 text-sm text-gray-600 text-center">현재 비밀번호를 입력해주세요</p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="relative mb-4">
                        <input
                            ref={inputRef}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="현재 비밀번호"
                            className="w-full border px-4 py-2 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={toggleShowPassword}
                        >
                        {showPassword ? '' : ''}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="bg-black text-white w-3/4 py-2 rounded hover:bg-gray-800 transition"
                            onClick={handleVerify}
                            disabled={loading}
                        >
                            {loading ? '확인 중...' : '확인'}
                        </button>
                        <button
                            className="bg-gray-300 text-gray-800 w-1/4 py-2 rounded hover:bg-gray-400 transition"
                            onClick={onClose}
                            disabled={loading}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordVerifyModal;
