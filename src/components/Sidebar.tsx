import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/favicon.png';

const Sidebar = () => {
    return (
        <div className="w-60 bg-gray-800 text-white h-full p-6">
            {/* 로고 이미지 - 클릭 시 대시보드로 이동 */}
            <NavLink
                to="/dashboard"
                className="block mb-8 transition-transform duration-300 hover:scale-105"
            >
                <img
                    src={logo}
                    alt="CBOL Logo"
                    className="h-10 w-auto mx-auto"
                />
            </NavLink>

            {/* 메뉴 */}
            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/mypage"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-300 font-semibold' : 'hover:text-blue-200'
                    }
                >
                    마이페이지
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-300 font-semibold' : 'hover:text-blue-200'
                    }
                >
                    사용자 관리
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
