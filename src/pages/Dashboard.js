import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Notification from "../components/Dashboard/Notification";
import Subjects from "../components/Dashboard/Subjects";

const Dashboard = () => {

	const { setUserAuth, logout } = useContext(AuthContext);

    const [subjects, setSubjects] = useState([]);
    const [networkError, setNetworkError] = useState("");

    const api = useAxios();

    useEffect( () => {
		getCredentials();
    }, []);

	const getCredentials = async () => {

        try {
            const response = await api.get("/users/authenticated");
			
            setUserAuth( prevState => ({
                ...prevState,
                username: response.data.username,
                emailAddress: response.data.emailAddress,}
            ));
            
        } catch (error) {
            setNetworkError("Unable to verify identity. Loging out...");
            await new Promise(resolve => setTimeout(resolve, 6000));
            setNetworkError("");
            logout();
        }
    }

    useEffect( () => {
        getSubjects();
    }, []);

    const getSubjects = async () => {

        try {
            const response = await api.get("/subjects");
			setSubjects(response.data);
            
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
    }

    return (
        <>
			<Navbar />

            <Subjects 
                subjects={subjects}
                setSubjects={setSubjects} 
            />
            
            {(networkError !== "") &&
            <Notification 
                message={networkError} 
                type={"error"}
            />}
            
        </>
    )
}
 
export default Dashboard;