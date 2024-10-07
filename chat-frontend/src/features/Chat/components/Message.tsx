import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

interface MessageFormProps {
    onSubmit: (message: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSubmit }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (message.trim()) {
            onSubmit(message);
            setMessage('');
        }
    };

    return (
        <Box display="flex" alignItems="center" mt={2}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
            />
            <Button onClick={handleSubmit} variant="contained" sx={{ ml: 2 }}>
                Send
            </Button>
        </Box>
    );
};

export default MessageForm;
