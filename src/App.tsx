import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import MyPage from "./pages/MyPage";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* 공개 페이지 */}
                <Route path="/login" element={<Login />} />

                {/* 보호된 레이아웃 내부 라우팅 */}
                <Route path="/" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="mypage" element={<MyPage />} />
                </Route>

                {/* 루트 접근 시 자동 리디렉션 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 존재하지 않는 경로는 로그인으로 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
