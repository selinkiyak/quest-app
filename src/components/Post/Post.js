import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse, Container, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'; // PropTypes'ı ekleyin
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Comment from '../Comment/Comment';
import CommentForm from '../Comment/CommentForm';

// Stil tanımlamaları
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
}));

function Post(props) {
  const [expanded, setExpanded] = useState(false);
  const { title, text, userId, userName, postId, likes = [] } = props; // likes'a varsayılan bir boş dizi atanıyor
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeId, setLikeId] = useState(null);

  const checkLikes = useCallback(() => {
    const likeControl = likes.find(like => like.userId === userId);
    if (likeControl != null) {
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  }, [likes, userId]);

  useEffect(() => {
    checkLikes();
  }, [checkLikes]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      saveLike();
      setLikeCount(likeCount + 1);
    } else {
      deleteLike();
      setLikeCount(likeCount - 1);
    }
  }

  const handleExpandClick = () => {
    if (!expanded) {
      refreshComments();
    }
    setExpanded(!expanded);
  };

  const saveLike = () => {
    fetch('/likes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }

  const deleteLike = () => {
    if (likeId) {
      fetch(`/likes/${likeId}`, { // Template string için backtick kullanın
        method: "DELETE",
        headers: {
          "Authorization" : localStorage.getItem("tokenKey"),
        },
      })
        .then((res) => {
          if (res.ok) {
            setLikeId(null); // Başarıyla silindikten sonra likeId'yi null yap
          } else {
            console.log("Error deleting like");
          }
        })
        .catch((err) => console.log("error"));
    }
  }
  
  const refreshComments = () => {
    if (!postId) {
      console.error('postId is undefined');
      setCommentList([]);
      return;
    }

    fetch(`/comments?postId=${postId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(
        (result) => {
          setIsLoaded(true);
          if (Array.isArray(result)) {
            setCommentList(result);
          } else {
            console.error('Fetched data is not an array:', result);
            setCommentList([]);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          setCommentList([]);
        }
      );
  };

  return (
    <Card sx={{ maxWidth: 800, width: '100%', minHeight: 300, margin: 'auto', textAlign: 'left' }}>
      <CardHeader
        avatar={
          <Link
            to={`/users/${userId}`}
            style={{
              textDecoration: 'none',
              boxShadow: 'none',
              color: 'inherit',
            }}
          >
            <Avatar
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              }}
              aria-label="recipe"
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        }
        title={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} aria-label="add to favorites">
          <FavoriteIcon style={isLiked ? { color: 'red' } : null} />
        </IconButton>
        <Typography variant="body2" color="text.secondary" component="span">
          {likeCount}
        </Typography>
        <IconButton 
        onClick={handleLike}
        aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed sx={{ padding: 2 }}>
          {error ? (
            "Yorumlar yüklenirken hata oluştu"
          ) : (
            isLoaded && commentList.map(comment => (
              <Comment key={comment.id} userId={69} userName={"user"} text={comment.text} />
            ))
          )}
          <CommentForm userId={69} userName={"user"} postId={postId} text={" "}  setCommentRefresh={refreshComments} />
        </Container>
      </Collapse>
    </Card>
  );
}

// PropTypes tanımlamaları
Post.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  likes: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired
  }))
};

export default Post;

