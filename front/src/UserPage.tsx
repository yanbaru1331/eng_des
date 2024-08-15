import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Modal from '../components/Modal';


const UserPage: React.FC = ()=> {
    const { userid } = useParams();
    //modalの表示非表示を管理するstate
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
        <div> 
        <h1>Hello {userid}！</h1>
        <h2>ポートフォリオ一覧</h2>
        <p>アセンブラカレンダー作成</p>
        <p>2022/12/31</p>
        <p>アセンブラを使用してlinuxの標準機能にあるcalコマンドと同様のものを作成</p>
        {/* ポートフォリオの一覧を表示 */}

        {
            //ここでログインしているユーザーが自分自身のページの時だけ管理モードを表示
            //バックとネゴシエーションできたら個々の処理を書き直しておく
            sessionStorage.getItem('AUTHORITY') === userid &&
            <div>
            <Button type="submit" onClick={ShowModal}>登録</Button>
            <Button onClick={Logout}>ログアウト</Button>
            <Modal showFlag={showModal} setShowFlag={setShowModal} type="edit" content="親から渡された値です。"/>
            </div>
        }
        </div>
        
    );
}

export default UserPage;