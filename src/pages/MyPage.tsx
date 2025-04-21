import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';

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

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api.get('/auth/me');
            setUser(res.data);
        };
        fetchUser();
    }, []);

    return (
        <div>
            <h2>마이페이지</h2>
            {user ? (
                <ul>
                    <li>이름: {user.name}</li>
                    <li>영문이름: {user.englishname}</li>
                    <li>이메일: {user.email}</li>
                    <li>전화번호: {user.phoneNumber}</li>
                    <li>아이디: {user.username}</li>
                </ul>
            ) : (
                <p>불러오는 중...</p>
            )}
        </div>
    );
};

export default MyPage;
