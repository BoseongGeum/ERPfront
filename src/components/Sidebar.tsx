import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/favicon.png';

const Sidebar = () => {
    return (
        <div className="w-60 bg-black text-white h-full p-6">
            {/* 로고 이미지 - 클릭 시 대시보드로 이동 */}
            <NavLink
                to="/home"
                className="block mb-8 transition-transform duration-300 hover:scale-125"
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
                    to="/users"
                    className="text-white hover:text-gray-400"
                >
                    {({ isActive }) => (
                        <div className="inline-flex items-center font-bold space-x-2">
                            <span className={isActive ? 'text-gray-400' : ''}>사용자 관리</span>
                            {isActive && <span className="text-gray-400">✔</span>}
                        </div>
                    )}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
