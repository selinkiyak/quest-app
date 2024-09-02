import { Alert, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import PostForm from '../Post/PostForm';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f0f5ff",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
}));

const HeaderSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postList, setPostList] = useState([]);

  const refreshPost = () => {
    fetch("/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(
        (result) => {
          if (Array.isArray(result)) {
            setIsLoaded(true);
            setPostList(result);
          } else {
            throw new Error('Unexpected data format');
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    refreshPost();
  }, []);

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error">Error: {error.message}</Alert>
      </StyledContainer>
    );
  } else if (!isLoaded) {
    return (
      <StyledContainer>
        <Typography variant="h6">Loading...</Typography>
      </StyledContainer>
    );
  } else {
    return (
      <StyledContainer>
        <HeaderSection>
          <Typography variant="h4" component="h1" gutterBottom>
            Home
          </Typography>
        </HeaderSection>
        <PostForm userId={1} userName={"dd"} refreshPosts={refreshPost} />
        {postList.map((post) => {
          // Props için varsayılan değerler belirleyin ve null kontrolü yapın
          const { id, userId, userName, title, text } = post;

          return (
            <Post
              key={id}
              postId={id}
              userId={typeof userId === 'number' ? userId : parseInt(userId, 10)} // Dönüştürme
              userName={userName || 'Anonymous'}
              title={title || 'No Title'}
              text={text || 'No Text'}
            />
          );
        })}
      </StyledContainer>
    );
  }
}

export default Home;
