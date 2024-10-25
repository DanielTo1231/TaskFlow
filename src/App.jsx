import "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageConnexion from "./Auth/PageConnexion";
import Register from "./Auth/Register";
import Dashboard from "./Dashboard/Dashboard";
import PageDetails from "./Dashboard/PageDetails";
import PrivateRoute from "./Auth/RouteProteger.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<PageConnexion />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/task/:taskId"
                    element={
                        <PrivateRoute>
                            <PageDetails />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
