import React, { createContext, useEffect, useState, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            if (stompClient) {
                stompClient.deactivate();
                setStompClient(null);
            }
            return;
        }

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {},
            debug: (str) => {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={stompClient}>
            {children}
        </SocketContext.Provider>
    );
};
