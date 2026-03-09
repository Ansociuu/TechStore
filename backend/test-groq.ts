import axios from 'axios';
axios.post('http://localhost:5000/api/ai/chat/public', { message: 'hello test' })
    .then(r => console.log('OK:', r.data))
    .catch(e => console.error('Error:', e.response?.data || e.message));
