import React, {useState} from "react";
import {Avatar, Menu, MenuItem} from "@mui/material";
import Box from "@mui/material/Box";
import {green} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {User} from "../types.ts";
import {useAppDispatch} from "../app/hooks.ts";
import {logout} from "../features/User/userThunks.ts";
import PersonIcon from '@mui/icons-material/Person';

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {


    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const isOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Avatar
                        onClick={handleClick}
                        sx={{bgcolor: green[500], width: 56, height: 56}}
                    ><PersonIcon/></Avatar>
                    <Typography sx={{color: 'black'}}>{user.displayName}</Typography>
                </Box>
                <Menu
                    open={isOpen}
                    anchorEl={anchorEl}
                    keepMounted={true}
                    onClose={handleClose}
                >
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>My Account {user.username}</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Box>
        </>
    );
};

export default UserMenu;