import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Modal from '../components/Modal';
import axios from "axios";


const UserPage: React.FC = () => {
    const { userid } = useParams();
    //modalの表示非表示を管理するstate
    const [showModal, setShowModal] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const navigate = useNavigate();
    const Logout = () => {
        sessionStorage.removeItem('userId');
        navigate(`/`);
    };
    const [userName, setUserNmae] = useState("");
    const [isChartFlag, isChart] = useState(false);
    const [createdChartName, setCreatedChartName] = useState("");
    const [createdChartDate, setcreatedChartDate] = useState("");
    useEffect(() => {
        if (sessionStorage.getItem('userId') === null) {
            alert("ログインしてください");
            navigate(`/`);
        }
        const getUsername = async () => {
            const res = await axios.get("http://localhost:3000/api/user?user_id=" + location.pathname.split("/")[2]);
            console.log(res.data.data.username);
            setUserNmae(res.data.data.username);
        }
        const getChart = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/portfolio/chart/all_view_format?user_id=" + location.pathname.split("/")[2],)

                console.log(res.data.data.charts[0].title);
                console.log(res.data.data.pages.created_at);
                const createdDate = res.data.data.pages.created_at.slice(0, 10)
                console.log(createdDate);
                setCreatedChartName(res.data.data.charts[0].title)
                setcreatedChartDate(createdDate)
                isChart(true);
            } catch (error) {
                console.log("error", error)
            }
        }
        getUsername();
        getChart();
    },);
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
                setDeleteFlag(true);
                isChart(false);
            })
    }


    return (
        <div>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-3xl font-bold text-gray-900">Hello {userName}!</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="gap-8">
                        {
                            isChartFlag &&
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">作成されたチャート</h2>
                                <div className="flex justify-center items-center gap-4 pb-4">
                                    <table className="table-fixed mx-auto">
                                        <thead>
                                            <tr>
                                                <th className="text-left pr-6">タイトル</th>
                                                <th className="text-left">作成日</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-left pr-6">{createdChartName}</td>
                                                <td className="text-left">{createdChartDate}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <Button onClick={viewChart}>チャート表示</Button>
                                </div>
                            </>
                        }

                        {deleteFlag && <p className="pb-9 text-red-500">チャートデータを削除しました</p>}

                        {
                            !isChartFlag && !showModal &&
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">まだチャートが作られていないようです</h2>
                        }
                        {
                            //ここでログインしているユーザーが自分自身のページの時だけ管理モードを表示
                            //バックとネゴシエーションできたら個々の処理を書き直しておく
                            sessionStorage.getItem('userId') === location.pathname.split("/")[2] &&
                            <>
                                <div className="flex justify-center items-center gap-4 pb-4">
                                    {!showModal &&
                                        <Button type="submit" onClick={ShowModal}>チャート作成・編集</Button>
                                    }

                                    {
                                        isChartFlag &&
                                        <Button type="submit" onClick={delChart}>チャート削除</Button>
                                    }
                                </div>
                                <Modal showFlag={showModal} setShowFlag={setShowModal} type="edit" />
                                <div className="pt-20">
                                    <Button onClick={Logout} >ログアウト</Button>
                                </div>
                            </>
                        }
                    </div>
                </main>
            </div>
        </div>
    );
}

export default UserPage;