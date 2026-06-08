const axios = require('axios');
(async () => {
  const api = axios.create({ baseURL: 'http://localhost:5000/api/v1', withCredentials: true });
  try {
    // 1. Get CSRF token
    const res1 = await api.get('/csrf-token');
    const token = res1.data.token;
    const cookies = res1.headers['set-cookie'];
    console.log('Got CSRF Token:', token);
    console.log('Set-Cookie:', cookies);

    // 2. Try POST with token
    const res2 = await api.post('/websites/test/publish', {}, {
      headers: {
        'x-csrf-token': token,
        'Cookie': cookies[0].split(';')[0]
      }
    });
    console.log('Publish result:', res2.status);
  } catch (err) {
    console.log('Error:', err.response?.status, err.response?.data);
  }
})();
