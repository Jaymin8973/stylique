import axios from 'axios';
import IpAddress from './Config.json';

const API = axios.create({
        baseURL: `http://${IpAddress.IpAddress}:3000`,
    });

export default API;