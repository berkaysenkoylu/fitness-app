import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://ancient-reef-11874.herokuapp.com/api/exercise-routine'
});

export default instance;