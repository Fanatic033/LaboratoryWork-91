import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";
import DefaultMenu from "./DefaultMenu.tsx";
import UserMenu from "./UserMenu.tsx";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/User/userSlice.ts";

const ResponsiveAppBar = () => {
    const user = useAppSelector(selectUser);

    return (
        <AppBar position="static" sx={{bgcolor: "orange"}}>
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{display: "flex", justifyContent: "space-between"}}
                >
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to={"/"}
                            sx={{
                                mr: 2,
                                display: {xs: "none", md: "flex"},
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".2rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Chat
                        </Typography>
                    </div>

                    <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: {xs: "flex", md: "none"},
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        LOGO
                    </Typography>
                    {user ? <UserMenu user={user}/> : <DefaultMenu/>}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;