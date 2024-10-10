import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Account from "../components/Account";
import axios from "axios";

const UserPage: React.FC = () => {


    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const Login = () => {
        sessionStorage.getItem('userId') ? navigate(`/userpage/${sessionStorage.getItem('userId')}`) : navigate(`/login`);
    };

    const account = () => {
        sessionStorage.getItem('userId') ? navigate(`/userpage/${sessionStorage.getItem('userId')}`) : (setShowModal(true));
    };

    const Search = () => {
        axios.get("http://localhost:3000/api/portfolio/page?user_name=" + search)
            .then((res) => {
                console.log(res);
                navigate(`/userpage/${res.data.data.user_id}/chart/view`);
            })
            .catch((error) => {
                setErrorMessage(true);
            });

        console.log(search)
    }

    return (
        /* 変更前のコード。一応コメントで残しておく */
        // <div>
        //     <h1>トップページ</h1>

        //     <p>ユーザ登録</p>
        //     <Button type="submit" onClick={account}>ユーザ登録</Button>
        //     <Account showFlag={showModal} setShowFlag={setShowModal} />
        //     <Button onClick={Login}>ログイン</Button>

        //     <p>検索</p>
        //     <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        //     <Button onClick={Search}>検索</Button>
        //     {errorMessage && <p>ユーザーが見つかりません</p>}
        // </div>

        <div>
            <h1>トップページ</h1>

            <div className="flex flex-col space-y-4">
                <p className="text-lg">ユーザ登録</p>
                <Button type="submit" onClick={account} className="w-full">
                    ユーザ登録
                </Button>
                <Account showFlag={showModal} setShowFlag="setShowModal" />
                <Button onClick={Login} className="w-full">
                    ログイン
                </Button>
            </div>
            
            <div>
                <p className="text-lg">検索</p>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={Search} className="w-auto">
                        検索
                    </Button>
                    {errorMessage && <p>ユーザが見つかりません</p>}
                </div>
            </div>
        </div>

    );
}

export default UserPage;