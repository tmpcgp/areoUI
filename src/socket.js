import * as io from 'socket.io-client';

const PORT      = 5_001;
const URL       = "http://localhost:" + PORT;
const BASE_PATH = '/socket.io';
const config    = {
  path : BASE_PATH,
  autoConnect : false,
};

export const socket = io ( URL, config ); 
