import React, { useState } from 'react';
import { IConversationItem } from './types';

const ChatBox = () => {
    const [chatLog, setchatLog] = useState<IConversationItem[]>([]);
    return (
        <div>
            
        </div>
    );
};

export default ChatBox;