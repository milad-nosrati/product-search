import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD
  }
  
});



