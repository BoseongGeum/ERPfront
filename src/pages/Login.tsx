import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            toast.warning('아이디와 비밀번호를 입력해 주세요.');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/login', form);
            localStorage.setItem('jwt', res.data.token);
            toast.success('로그인에 성공했습니다!');  // 로그인 성공 메시지 수정
            navigate('/home');
        } catch (err: any) {
            const msg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || '로그인 정보가 올바르지 않습니다.';  // 실패 메시지 수정
            toast.error(msg);  // 실패 메시지 표시
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-sm w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">로그인</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">아이디</label>
                        <input
                            ref={inputRef}
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <a href="/forgot-password" className="hover:text-blue-500 transition duration-300">비밀번호를 잊으셨나요?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
