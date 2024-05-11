import React from "react";
import { useParams } from "react-router-dom";

const UserPage: React.FC= ()=> {
    const { userid } = useParams();

    return (
        <div> User ID: {userid} 
        <h1>Hello World</h1>
        </div>
    );
}

export default UserPage;