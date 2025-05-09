import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import MyPage from "./pages/MyPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <Router>
            <>
                <Routes>
                    {/* 공개 페이지 */}
                    <Route path="/login" element={<Login />} />

                    {/* 보호된 레이아웃 내부 라우팅 */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }>
                        <Route path="home" element={<Home />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="mypage" element={<MyPage />} />
                    </Route>

                    {/* 루트 접근 시 자동 리디렉션 */}
                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {/* 존재하지 않는 경로는 로그인으로 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>

                {/* 토스트 컨테이너 추가 */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
        </Router>
    );
};

export default App;
