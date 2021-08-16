import axios from 'axios';

export default axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  // Netlify Fix: for some reason Netlify changed the BaseURL to netlify URL!!
  baseURL: 'https://paylessflooring.com.au/wp-json/wc/v3/',
  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD
  }
});


