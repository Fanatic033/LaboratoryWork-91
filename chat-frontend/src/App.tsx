import './App.css'
import {Route, Routes} from "react-router-dom";
import Register from "./features/User/Register.tsx";
import Login from "./features/User/Login.tsx";
import ResponsiveAppBar from "./UI/AppToolBar.tsx";
import Typography from "@mui/material/Typography";
import Chat from "./features/Chat/Chat.tsx";

const App = () => (
    <>
        <header>
            <ResponsiveAppBar/>
        </header>
        <Routes>
            <Route path={'/'} element={<Chat/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route
                path="*"
                element={<Typography variant="h1">Not found</Typography>}
            />
        </Routes>
    </>
);

export default App
