
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import Account from "../components/Account";
import axios from "axios";

const ViewChart: React.FC = ()=> {
    const [checkPublic, setCheckPublic] = useState<boolean>(false);
    useEffect(() => {
        const checkUser = async () => {
        const res = await axios.get("http://localhost:3000/api/portfolio/page?user_id=1")
            setCheckPublic(res.data.published);
            if (res.data.published === true){
                console.log("1=",getChart());
            }
            
    }
        const getChart = async () => { 
            const res = await axios.get("http://localhost:3000/api/portfolio/chart?user_id=1")
            .then((res) => {
                console.log(res);
                return res.data;
                });
            return [];

        }
        checkUser();
    }, []);
    return(
        <div>aaaaa</div>
    );
}

export default ViewChart;