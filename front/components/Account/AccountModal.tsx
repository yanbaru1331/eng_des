import React, { useState } from "react";
import Button from "../Button";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

//url =  http://localhost:3000/api/user
const Modal= (props) => {
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
  const [disabled, setDisabled] = useState(true);
  
  //登録関数
  const submit = () => {
    axios.post("http://localhost:3000/api/user", {
      user: user,
      email: email,
      password: password,
      birth: birth,
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

  const accountCheck = () => {
    if (user !== "" && email !== "" && password !== "" && checkpass !== "" && birth !=="" && password === checkpass){
        setDisabled(true);
      }
      else{
        setDisabled(false);
    }
  }
  return (
    <>
      {props.showFlag ? (
        <div>
        <h1>ユーザ登録画面</h1>

        
        <p>ユーザ名</p>
        <input type="text" value={user} 
        onChange={(e) => {  
        setUser(e.target.value);
        accountCheck();
        }
      } />
        
        <p>email</p>
        <input type="email" value={email} 
        onChange={(e) => {setEmail(e.target.value);
        accountCheck();
        }
        } />

        <p>生年月日</p>
        <input type="date" value={birth}
        onChange={(e) => {setBirth(e.target.value);
        accountCheck();
        }
      } />
        <p>パスワード</p>
        <input type="password" value={password} 
        onChange={(e) => {setPassword(e.target.value);
        accountCheck();
        }
        } />
        <p>パスワード確認用</p>
        <input type="password" value={checkpass}
         onChange={(e) => {setCheckpass(e.target.value);
         accountCheck();
        }
      }/>
      <p></p>
        <Button type="submit" onClick={submit} disabled={disabled}>登録</Button>

      <Button onClick={closeModal}>閉じる</Button>
      </div>
      ) : (
        //showflagがfalseの時は何も表示しない処理
        <></>
      )}
    </>
  );
}


export default Modal;