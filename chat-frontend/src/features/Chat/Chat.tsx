import React, {useState, useEffect} from 'react';
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import MessageForm from "./components/Message.tsx";
import {Message} from "../../types.ts";
import {selectUser} from "../User/userSlice.ts";

const ChatWindow: React.FC = () => {
    const token = useSelector(selectUser)?.token;
    const [messages, setMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/chat');

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'LOAD_MESSAGES') {
                setMessages(message.payload);
            } else if (message.type === 'NEW_MESSAGE') {
                setMessages((prevMessages) => [...prevMessages, message.payload]);
            } else if (message.type === 'ONLINE_USERS') {
                setOnlineUsers(message.payload);
            }
        };

        socket.onopen = () => {
            if (token) {
                socket.send(JSON.stringify({type: 'LOGIN', payload: token}));
            }
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, [token]);

    const sendMessage = (message: string) => {
        if (ws) {
            ws.send(JSON.stringify({type: 'SEND_MESSAGE', payload: message}));
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="90vh" p={2}>
            <Box display="flex" flexGrow={1} mb={2}>
                <Box width="200px" mr={2} bgcolor="#f0f0f0" borderRadius="4px">
                    <Typography variant="h6" p={1}>Online users</Typography>
                    <List>
                        {onlineUsers.map((user, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={user}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box flexGrow={1} bgcolor="#ffffff" borderRadius="4px" border="1px solid #ddd">
                    <Box p={2} flexGrow={1} overflow="auto" height="600px">
                        {messages.map((message, index) => (
                            <Typography key={index} variant="body2" sx={{mb: 1}}>
                                <strong>{message.author?.displayName} :</strong> {message.message}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>

            <MessageForm onSubmit={sendMessage}/>
        </Box>
    );
};

export default ChatWindow;
