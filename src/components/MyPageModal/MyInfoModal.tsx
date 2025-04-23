import React, {useState, useEffect, useRef} from "react";
import { toast } from "react-toastify";

interface MyInfoModalProps {
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
        phoneNumber: string,
    ) => void;
    initialData?: {
        name: string;
        englishname: string;
        username: string;
        password: string;
        role: string;
        position: string;
        email: string;
        phoneNumber: string;
    };
}

const MyInfoModal: React.FC<MyInfoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState('');
    const [englishname, setEnglishname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');

    useEffect(() => {
        if (initialData) {
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
            setPassword('');
            setRole('');
            setPosition('');
            setEmail('');
            setPhone1('');
            setPhone2('');
        }
        inputRef.current?.focus();
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [initialData, isOpen]);

    const phone2Ref = React.useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const handleUsernameChange = (value: string) => {
        setUsername(value);
        setEmail(`${value}@cbol.com`);
    };

    const handleSave = () => {
        if (name.trim() === '' || username.trim() === '') {
            toast.error("이름과 아이디는 필수 입력 항목입니다.");
            return;
        }

        const fullPhone = `010-${phone1}-${phone2}`;
        onSave(name, englishname, username, password, role, position, email, fullPhone);
        onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[440px] shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800">정보 수정</h2>

                {/* 이름 */}
                <div className="mb-2">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium w-20">이름</label>
                        <input
                            ref={inputRef}
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

                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyInfoModal;