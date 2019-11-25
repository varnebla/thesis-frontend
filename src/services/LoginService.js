require('dotenv').config();


//const BASE_URL = process.env.DEVELOPING_BASE_URL;
const BASE_URL = 'http://localhost:5000';

export const sendLoginUser = (loginObject) => {
  const options = {
    method: 'POST', 
    body: JSON.stringify(loginObject), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  };
  return fetch(`${BASE_URL}/login`, options)
    .then(response => response.json())
    .catch(error=> console.error(error)); //eslint-disable-line no-console
};