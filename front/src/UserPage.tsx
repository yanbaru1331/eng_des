import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from "axios";


const UserPage: React.FC = () => {
    const { userid } = useParams();
    //modalの表示非表示を管理するstate
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const Logout = () => {
        sessionStorage.removeItem('userId');
        navigate(`/`);
    };

    const ShowModal = () => {
        axios.get("http://localhost:3000/api/portfolio/page?user_id=" + sessionStorage.getItem('userId'))
            .then(() => {
                console.log("success");
                navigate(`/userpage/${sessionStorage.getItem('userId')}/chart`);
            })
            .catch(() => {
                setShowModal(true);
            });
    };

    const viewChart = () => {
        navigate(`/userpage/${sessionStorage.getItem('userId')}/chart/view`);
    }

    const delChart = () => {
        axios.delete("http://localhost:3000/api/portfolio/page",
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { user_id: Number(sessionStorage.getItem('userId')) }
            })
            .then((res) => {
                console.log(res);
            })
    }


    return (
        <div>
            <h1>Hello {userid}!</h1>
            <Button onClick={viewChart}>チャートを標示</Button>
            {
                //ここでログインしているユーザーが自分自身のページの時だけ管理モードを表示
                //バックとネゴシエーションできたら個々の処理を書き直しておく
                sessionStorage.getItem('AUTHORITY') !== "" &&
                <div>
                    <Button type="submit" onClick={ShowModal}>チャート登録・編集</Button>
                    <Button type="submit" onClick={delChart}>チャート削除</Button>

                    <Button onClick={Logout}>ログアウト</Button>
                    <Modal showFlag={showModal} setShowFlag={setShowModal} type="edit" />
                </div>
            }
        </div>

    );
}

export default UserPage;