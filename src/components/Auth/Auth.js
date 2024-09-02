import { Button, FormControl, FormHelperText, Input, InputLabel, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostWithoutAuth = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }

  return response;
};

function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const sendRequest = async (path) => {
    try {
      const response = await PostWithoutAuth(`/auth/${path}`, {
        userName: username,
        password: password,
      });

      const result = await response.json();

      localStorage.setItem('tokenKey', result.accessToken);
      localStorage.setItem('refreshKey', result.refreshToken);
      localStorage.setItem('currentUser', result.userId);
      localStorage.setItem('userName', username);

      navigate('/'); // Başarılı işlem sonrası Home sayfasına yönlendirme
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleButton = () => {
    sendRequest(authMode);
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Typography variant="h6" align="center" gutterBottom>
        {authMode === 'login' ? 'Login' : 'Register'}
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input id="username" value={username} onChange={handleUsername} />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={handlePassword}
        />
      </FormControl>
      <Button
        variant="contained"
        style={{
          marginTop: 24,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}
        onClick={handleButton}
      >
        {authMode === 'login' ? 'Login' : 'Register'}
      </Button>
      <FormHelperText style={{ marginTop: 16, textAlign: 'center' }}>
        {authMode === 'login' ? 'Not registered yet?' : 'Already registered?'}
        <Button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
          {authMode === 'login' ? 'Register' : 'Login'}
        </Button>
      </FormHelperText>
    </div>
  );
}

export default Auth;
