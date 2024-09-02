import { Avatar, Button, CardContent, InputAdornment, OutlinedInput, styled } from "@mui/material";
import PropTypes from 'prop-types';
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Styled components using MUI's styled function
const CommentWrapper = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "center",
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  boxShadow: "none",
  color: "white",
}));

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  color: "black",
  backgroundColor: "white",
}));

function CommentForm({ userId, userName, postId, setCommentRefresh }) {
  const [text, setText] = useState("");

  const saveComment = () => {
    fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
        text: text,
      }),
    })
    .then((res) => res.json())
    .catch((err) => console.log("error"));
  };

  const handleSubmit = () => {
    saveComment();
    setText("");
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <CommentWrapper>
      <StyledOutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        value={text}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            <StyledLink to={`/users/${userId}`}>
              <SmallAvatar aria-label="recipe">
                {userName ? userName.charAt(0).toUpperCase() : "U"} {/* Kullanıcı adının ilk harfi */}
              </SmallAvatar>
            </StyledLink>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button
              variant="contained"
              style={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: "white" }}
              onClick={handleSubmit}
            >
              Comment
            </Button>
          </InputAdornment>
        }
      />
    </CommentWrapper>
  );
}

CommentForm.propTypes = {
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  setCommentRefresh: PropTypes.func.isRequired,
};

export default CommentForm;
