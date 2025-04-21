import React from 'react';
import { useNavigate } from 'react-router-dom';

// 토큰 파싱 함수
const getUserInfoFromToken = (token: string): { name?: string; englishname?: string; position?: string } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const decoder = new TextDecoder('utf-8');
        const decodedData = decoder.decode(new Uint8Array([...decoded].map(c => c.charCodeAt(0))));
        const payload = JSON.parse(decodedData);

        return {
            name: payload.name,
            englishname: payload.englishname,
            position: payload.position,
        };
    } catch (e) {
        console.error('토큰 파싱 오류:', e);
        return null;
    }
};

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const userInfo = token ? getUserInfoFromToken(token) : null;

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b">
            <h2 className="text-xl font-bold text-gray-800">ERP 시스템</h2>
            <div className="flex items-center gap-4">
                {userInfo && (
                    <span className="text-gray-700">
                        환영합니다, <strong>{userInfo.name}
                        {userInfo.englishname && (
                            <span>({userInfo.englishname}) </span>
                        )}
                        {userInfo.position && (
                            <span>{userInfo.position}</span>
                        )}</strong>님
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
};

export default Header;
