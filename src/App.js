import './App.css';
import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard";
import Homepage from "./Homepage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import AssignmentView from "./AssignmentView";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";
import CodeReviewerDashboard from "./CodeReviewerDashboard";
import CodeReviewAssignmentView from "./CodeReviewAssignmentView";
import {useUser} from "./UserProvider";


function App() {
    const [roles, setRoles] = useState([]);
    const user = useUser();

    useEffect(() => {
        console.log("JWT has changed");
        setRoles(getRolesFromJWT());
    }, [user.jwt]);

    function getRolesFromJWT() {
        if (user.jwt) {
            const decodedJwt = jwt_decode(user.jwt);
            return decodedJwt.authorities;
        } else {
            return [];
        }
    }

    return (
            <Routes>
                <Route path="/dashboard" element={
                    roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
                        <PrivateRoute>
                            <CodeReviewerDashboard/>
                        </PrivateRoute>
                    ) : (
                        <PrivateRoute>
                            <Dashboard/>
                        </PrivateRoute>
                    )
                }/>
                <Route
                    path="/assignments/:id"
                    element={
                        roles.find((role) => role === "ROLE_CODE_REVIEWER") ? (
                            <PrivateRoute>
                                <CodeReviewAssignmentView/>
                            </PrivateRoute>
                        ) : (
                            <PrivateRoute>
                                <AssignmentView/>
                            </PrivateRoute>
                        )
                    }
                />
                <Route path="/" element={<Homepage/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
    );
}

export default App;
