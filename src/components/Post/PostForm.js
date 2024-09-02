import { Avatar, Button, Card, CardContent, CardHeader, Container, CssBaseline, InputAdornment, Alert as MuiAlert, OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Alert bileşeni için styled kullanımı
const Alert = styled(MuiAlert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Stil tanımlamaları için styled kullanımı
const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 800,
  margin: theme.spacing(2.5),
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 200, // Minimum yükseklik, postların eşit boyutta görünmesini sağlar
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  boxShadow: 'none',
  color: 'inherit',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
}));

function PostForm(props) {
  const { userId, userName, refreshPosts } = props;
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [alert, setAlert] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (title.trim() === '' || text.trim() === '') {
      setAlert({ type: 'error', message: 'Başlık ve metin alanları boş olamaz.' });
      return;
    }

    fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        userId: userId,
        text: text,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(() => {
      setTitle('');
      setText('');
      refreshPosts();
      setAlert({ type: 'success', message: 'Post başarıyla kaydedildi!' });
    })
    .catch((err) => {
      console.error('Error:', err);
      setAlert({ type: 'error', message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <CssBaseline />
      <Container maxWidth="md"> {/* Daha geniş bir container kullanımı */}
        <StyledCard>
          <form onSubmit={handleSubmit}>
            <CardHeader
              avatar={
                <StyledLink to={`/users/${userId}`}>
                  <StyledAvatar>
                    {userName ? userName.charAt(0).toUpperCase() : '?'}
                  </StyledAvatar>
                </StyledLink>
              }
              title={
                <OutlinedInput
                  id="outlined-title-input"
                  value={title}
                  multiline
                  placeholder="Title"
                  inputProps={{ maxLength: 2500 }}
                  fullWidth
                  onChange={(e) => setTitle(e.target.value)}
                />
              }
            />
            <CardContent>
              <OutlinedInput
                id="outlined-text-input"
                value={text}
                multiline
                placeholder="Text"
                inputProps={{ maxLength: 2500 }}
                fullWidth
                onChange={(e) => setText(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <StyledButton
                      variant="contained"
                      type="submit"
                    >
                      POST
                    </StyledButton>
                  </InputAdornment>
                }
                sx={{ color: "black", backgroundColor: 'white' }} // MUI v5 için sx prop'u
              />
            </CardContent>
          </form>
        </StyledCard>
        {alert && (
          <Alert severity={alert.type}>
            {alert.message}
          </Alert>
        )}
      </Container>
    </div>
  );
}

PostForm.propTypes = {
  userId: PropTypes.number.isRequired, // Burada number olarak ayarlandı
  userName: PropTypes.string.isRequired,
  refreshPosts: PropTypes.func.isRequired,
};

export default PostForm;
