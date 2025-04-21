import axios from 'axios';

// 기본 인스턴스 생성
const api = axios.create({
    baseURL: '/api',
});

// ✅ 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 - 401 에러 시 로그아웃 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 토큰 제거
            localStorage.removeItem('jwt');

            // 로그인 페이지로 강제 이동
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
