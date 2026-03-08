import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testCartRefactor() {
    console.log('--- Testing Cart Refactor ---');
    try {
        // Test old endpoint (should fail or be 404/moved)
        try {
            await axios.post(`${API_URL}/cart/add`, { productId: 1, quantity: 1 });
            console.log('FAIL: Old /cart/add still works');
        } catch (e: any) {
            console.log('PASS: Old /cart/add not found or error as expected');
        }

        // Test new endpoint (requires auth, so 401)
        try {
            await axios.post(`${API_URL}/cart/items`, { productId: 1, quantity: 1 });
        } catch (e: any) {
            if (e.response.status === 401) {
                console.log('PASS: New /cart/items requires auth');
            } else {
                console.log('FAIL: New /cart/items unexpected error:', e.response.status);
            }
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

async function testValidation() {
    console.log('\n--- Testing Validation ---');
    try {
        // Test invalid login (missing email)
        try {
            await axios.post(`${API_URL}/auth/login`, { password: '123' });
        } catch (e: any) {
            if (e.response.status === 400 && e.response.data.details) {
                console.log('PASS: Validation caught missing email');
                console.log('Details:', JSON.stringify(e.response.data.details));
            } else {
                console.log('FAIL: Validation did not catch error correctly');
            }
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCartRefactor();
testValidation();
