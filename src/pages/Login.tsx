import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', form);
            localStorage.setItem('jwt', res.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            const msg = typeof err.response?.data === 'string'
                ? err.response.data
                : err.response?.data?.message || '로그인 실패';
            setError(msg);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">로그인</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">아이디</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                    로그인
                </button>
            </form>
        </div>
    );
};

export default Login;
