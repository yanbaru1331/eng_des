import React, { useState } from "react";
import Button from "../Button";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useMemo } from 'react';

//url =  http://localhost:3000/api/user
const Modal = (props) => {
  const closeModal = () => {
    props.setShowFlag(false);
  };
  //prposで渡された値は変数を書く
  //ex showFlag={showModal} の時showModalじゃなくてshowFlag
  //そうしないとshowModalがわからなくて動かない


  //入力フォームの各入力値
  //editの時は初期値を参照できるようにしておく
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpass, setCheckpass] = useState("");
  const [birth, setBirth] = useState("");

  const [errorMessage, setErrorMessage] = useState(false);
  //const [disabled, setDisabled] = useState(true);
  const registerDisabled = useMemo(() => {
    return !(user !== "" && email !== "" && password !== "" && checkpass !== "" && birth !== "" && password === checkpass)
  },
    [user, email, password, checkpass, birth],
  );

  //登録関数
  const submit = () => {
    axios.post("http://localhost:3000/api/user", {
      username: user,
      email: email,
      password: password,
      date_of_birth: birth,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      closeModal();
    }).catch((error) => {
      console.log(error);
    });
  }

  // const accountCheck = () => {
  //   console.log(user
  //     , email
  //     , password
  //     , checkpass
  //     , birth);

  //   if (user !== "" && email !== "" && password !== "" && checkpass !== "" && birth !== "" && password === checkpass) {
  //     setDisabled(false);
  //   }
  //   else {
  //     setDisabled(true);
  //   }
  // }
  return (
    <>
      {props.showFlag ? (
            <div className="bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">ユーザ登録</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      ユーザ名
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      メール
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="birth" className="block text-sm font-medium text-gray-700 mb-1">
                      生年月日
                    </label>
                    <input
                      id="birth"
                      type="date"
                      value={birth}
                      onChange={(e) => setBirth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkpass" className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード確認
                    </label>
                    <input
                      id="checkpass"
                      type="password"
                      value={checkpass}
                      onChange={(e) => setCheckpass(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  {
                    errorMessage &&
                    <p className="px-4 py-2">エラーが発生しました</p>
                  }
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    閉じる
                  </button>
                  <button
                    onClick={submit}
                    disabled={registerDisabled}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    登録
                  </button>

                </div>
              </div>
            </div>
          </div>
        // <div>
        //   <h1>ユーザ登録画面</h1>


        //   <p>ユーザ名</p>
        //   <input type="text" value={user}
        //     onChange={(e) => {
        //       setUser(e.target.value);
        //       // accountCheck();
        //     }
        //     } />

        //   <p>email</p>
        //   <input type="email" value={email}
        //     onChange={(e) => {
        //       setEmail(e.target.value);
        //       // accountCheck();
        //     }
        //     } />

        //   <p>生年月日</p>
        //   <input type="date" value={birth}
        //     onChange={(e) => {
        //       setBirth(e.target.value);
        //       // accountCheck();
        //     }
        //     } />
        //   <p>パスワード</p>
        //   <input type="password" value={password}
        //     onChange={(e) => {
        //       setPassword(e.target.value);
        //       // accountCheck();
        //     }
        //     } />
        //   <p>パスワード確認用</p>
        //   <input type="password" value={checkpass}
        //     onChange={(e) => {
        //       setCheckpass(e.target.value);
        //       // accountCheck();
        //     }
        //     } />
        //   <p></p>
        //   <Button type="submit" onClick={submit} disabled={registerDisabled}>登録</Button>

        //   <Button onClick={closeModal}>閉じる</Button>
        // </div>
      ) : (
        //showflagがfalseの時は何も表示しない処理
        <></>
      )}
    </>


  );
}

export default Modal