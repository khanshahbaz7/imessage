import {create} from 'zustand';
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
