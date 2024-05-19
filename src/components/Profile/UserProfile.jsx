import { useEffect, useState } from "react";

const UserProfile = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUserName(userInfo.name); // Assuming 'name' is a property of the user info
        }
    }, []);

    return (
        <div>
            {userName ? <h1>Welcome, {userName}!</h1> : <h1>Welcome!</h1>}
        </div>
    );
};

export default UserProfile;