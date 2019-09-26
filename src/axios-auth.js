import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ancient-reef-11874.herokuapp.com/api/users'
});

export default instance;

