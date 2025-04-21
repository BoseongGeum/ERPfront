import React, { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        name: string,
        englishname: string,
        username: string,
        password: string,
        role: string,
        position: string,
        email: string,
        phoneNumber: string
    ) => void;
    initialData?: {
        name: string;
        englishname: string;
        username: string;
        role: string;
        position: string;
        email: string;
        phoneNumber: string;
    };
    isEdit?: boolean;
}

const UserModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData, isEdit }) => {
    const [name, setName] = useState('');
    const [englishname, setEnglishname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('cbol123');
    const [role, setRole] = useState('');
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');

    useEffect(() => {
        if (initialData && isEdit) {
            setName(initialData.name || '');
            setEnglishname(initialData.englishname || '');
            setUsername(initialData.username || '');
            setRole(initialData.role || '');
            setPosition(initialData.position || '');
            setEmail(initialData.email || '');
            const [_, p1, p2] = (initialData.phoneNumber || '010--').split('-');
            setPhone1(p1 || '');
            setPhone2(p2 || '');
        } else {
            setName('');
            setEnglishname('');
            setUsername('');
            setPassword('cbol123');
            setRole('');
            setPosition('');
            setEmail('');
            setPhone1('');
            setPhone2('');
        }
    }, [initialData, isEdit, isOpen]);

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        setEmail(`${value}@cbol.com`);
    };

    const handlePhoneInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
        maxLength: number,
        nextRef?: React.RefObject<HTMLInputElement | null>
    ) => {
        if (e.target.value.length >= maxLength && nextRef?.current) {
            nextRef.current.focus();
        }
        setter(e.target.value);
    };

    const phone2Ref = React.useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const fullPhone = `010-${phone1}-${phone2}`;
        onSave(name, englishname, username, password, role, position, email, fullPhone);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{isEdit ? '사용자 수정' : '사용자 등록'}</h3>

                {/* 등록 시에만 표시 */}
                {!isEdit && (
                    <>
                        {/* 이름 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">이름</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 p-2 border rounded"
                                />
                            </div>
                            {name === '' && <p className="text-red-500 text-sm ml-24 mt-1">필수 입력 항목입니다</p>}
                        </div>

                        {/* 영문 이름 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">영문이름</label>
                                <input
                                    type="text"
                                    value={englishname}
                                    onChange={(e) =>
                                        setEnglishname(
                                            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                                        )
                                    }
                                    className="flex-1 p-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* 아이디 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">아이디</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    className="flex-1 p-2 border rounded"
                                />
                            </div>
                            {username === '' && <p className="text-red-500 text-sm ml-24 mt-1">필수 입력 항목입니다</p>}
                        </div>

                        {/* 이메일 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">이메일</label>
                                <input
                                    type="text"
                                    value={email}
                                    readOnly
                                    className="flex-1 p-2 border rounded bg-gray-100"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">비밀번호</label>
                                <input
                                    type="text"
                                    value="cbol123"
                                    readOnly
                                    className="flex-1 p-2 border rounded bg-gray-100"
                                />
                            </div>
                            <p className="text-sm text-gray-500 ml-24 mt-1">초기 비밀번호는 'cbol123'입니다</p>
                        </div>

                        {/* 전화번호 */}
                        <div className="mb-2">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium w-20">전화번호</label>
                                <div className="flex gap-2 flex-1">
                                    <span className="p-2">010</span>
                                    <input
                                        type="text"
                                        value={phone1}
                                        onChange={(e) => handlePhoneInput(e, setPhone1, 4, phone2Ref)}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                    <input
                                        type="text"
                                        value={phone2}
                                        onChange={(e) => handlePhoneInput(e, setPhone2, 4)}
                                        ref={phone2Ref}
                                        className="w-1/2 p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* 직급 */}
                <div className="mb-2">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium w-20">직급</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="flex-1 p-2 border rounded"
                        >
                            <option value="">선택</option>
                            <option value="인턴">인턴</option>
                            <option value="수습">수습</option>
                            <option value="사원">사원</option>
                            <option value="주임">주임</option>
                            <option value="대리">대리</option>
                            <option value="과장">과장</option>
                            <option value="차장">차장</option>
                            <option value="부장">부장</option>
                            <option value="소장">소장</option>
                        </select>
                    </div>
                </div>

                {/* 권한 */}
                <div className="mb-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium w-20">권한</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex-1 p-2 border rounded"
                        >
                            <option value="">선택</option>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    {role === '' && <p className="text-red-500 text-sm ml-24 mt-1">필수 입력 항목입니다</p>}
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        닫기
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {isEdit ? '수정' : '등록'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
