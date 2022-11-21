import axios from 'axios';

const { REACT_APP_PORT_API } = process.env;


const api = axios.create({
  baseURL: `http://localhost:${REACT_APP_PORT_API}`,
});

export default api;
