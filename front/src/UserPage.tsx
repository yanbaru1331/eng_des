import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Modal from '../components/Modal';

const UserPage: React.FC = () => {
    const { userid } = useParams();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const Logout = () => {
        sessionStorage.removeItem('AUTHORITY');
        navigate(`/`);
    };

    const ShowModal = () => {
        setShowModal(true);
      };

      return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Hello {userid}！</h1>

            <h2 className="text-2xl mb-4">ポートフォリオ一覧</h2>
            <ul className="space-y-4">
                <li className="flex justify-between">
                    <span>アセンブラカレンダー作成</span>
                    <span>2022/12/31</span>
                </li>
                {/* 他のポートフォリオも同様に追加 */}
            </ul>

            {sessionStorage.getItem('AUTHORITY') === userid && (
                <div className="flex justify-end">
                    <Button onClick={ShowModal} className="mr-2">登録</Button>
                    <Button onClick={Logout}>ログアウト</Button>
                </div>
            )}

            <Modal showFlag={showModal} setShowFlag={setShowModal} type="edit" content="親から渡された値です。" />
        </div>
    );
};

export default UserPage;
