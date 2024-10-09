import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../components/Account";
import Button from '../components/Button';

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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-gray-900">トップページ</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">アカウント</h2>
                        <div className="space-y-4">
                            <Button onClick={account} className="w-full">
                                ユーザ登録
                            </Button>
                            <Button onClick={Login} className="w-full">
                                ログイン
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">検索</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="ユーザー名を入力"
                                className="w-full text-lg py-2"
                            />
                            <Button onClick={Search} className="w-full">
                                検索
                            </Button>
                            {errorMessage && <p>ユーザーが見つかりません</p>}
                        </div>
                    </div>
                </div>
            </main>

            <Account showFlag={showModal} setShowFlag={setShowModal} />
        </div>


    );
}

export default UserPage;