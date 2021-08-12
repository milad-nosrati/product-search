import axios from 'axios';

export default axios.create({
  baseURL: `https://paylessflooring.com.au/wp-json/wc/v3/`,
  auth: {
    username: 'ck_cd592c36fde76f821b3da5f04c8f909eb55cada8',
    password: 'cs_50dd90f8e2478971d1954834beb92fa2c6373ee7'
  }
});