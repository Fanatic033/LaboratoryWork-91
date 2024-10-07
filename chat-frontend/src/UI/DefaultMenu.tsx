import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const DefaultMenu = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <Box>
                <Button
                    component={NavLink}
                    to="/register"
                    color="primary"
                    variant="outlined"
                >
                    Зарегистрироваться
                </Button>
            </Box>
            <Box>
                <Button
                    component={NavLink}
                    to="/login"
                    color="primary"
                    variant="contained"
                >
                    Войти
                </Button>
            </Box>
        </div>
    );
};

export default DefaultMenu;