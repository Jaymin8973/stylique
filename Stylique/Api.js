import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IpAddress from './Config.json';

const API = axios.create({
  baseURL: `http://${IpAddress.IpAddress}:5001`,
});

API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default API;