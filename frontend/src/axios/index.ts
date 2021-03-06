import axios from 'axios';

const production = process.env.NODE_ENV === 'production';

const baseURL = production ? process.env.PRODUCTION_API_URL : process.env.DEVELOPMENT_API_URL;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});


export default axiosInstance;
export const CancelToken = axios.CancelToken;