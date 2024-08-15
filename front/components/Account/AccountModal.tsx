import React, { useState } from "react";
import Button from "../Button";

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
  const [disabled, setDisabled] = useState(true);
  //登録関数
  const submit = () => {
    console.log("submit")
  }

  const accountCheck = () => {
    if (user !== "" && email !== "" && password !== "" && checkpass !== "" && password === checkpass){
        setDisabled(false);
      }
      else{
        setDisabled(true);
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