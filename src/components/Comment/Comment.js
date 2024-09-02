import { Avatar, CardContent, InputAdornment, OutlinedInput } from "@mui/material";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from "react";
import { Link } from "react-router-dom";

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    boxShadow: "none",
    color: "inherit",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 24,
    height: 24,
}));

function Comment({ text, userId, userName = "Unknown User" }) {
    const displayName = userName ? userName.charAt(0).toUpperCase() : "";

    return (
        <StyledCardContent>
            <OutlinedInput
                disabled
                multiline
                inputProps={{ maxLength: 25 }}
                fullWidth
                value={text || ''} // Boş string kullanarak hatayı önleyebilirsiniz
                startAdornment={
                    <InputAdornment position="start">
                        <StyledLink to={`/users/${userId}`}>
                            <StyledAvatar aria-label="recipe">
                                {displayName}
                            </StyledAvatar>
                        </StyledLink>
                    </InputAdornment>
                }
                sx={{ color: 'black', backgroundColor: 'white' }}
            />
        </StyledCardContent>
    );
}

Comment.propTypes = {
    text: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    userName: PropTypes.string,
};

export default Comment;
