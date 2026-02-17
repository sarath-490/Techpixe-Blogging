const login = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@techpixe.com',
                password: 'password123'
            })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Login Successful!');
            console.log('Token received:', data.token ? 'Yes' : 'No');
            console.log('User Role:', data.user ? data.user.role : 'Unknown');
        } else {
            console.error('❌ Login Failed:', data);
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error testing login:', error.message);
        process.exit(1);
    }
};

login();
