import { Container, CssBaseline, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from '../Avatar/Avatar';

function User() {
  const { userId: userIdParam } = useParams();
  const userId = Number(userIdParam);
  const [userName, setUserName] = useState("");
  const [avatarId, setAvatarId] = useState(null);
  const currentUser = Number(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser === userId) {
      fetch(`/users/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            setUserName(data.userName || "Anonim");
            setAvatarId(data.avatarId || null);
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      console.error("Unauthorized access attempt");
    }
  }, [userId, currentUser]);

  return (
    <div>
      <CssBaseline />
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Kullanıcı Profili
        </Typography>
        {currentUser === userId ? (
          <>
            <Typography variant="body1">
              Kullanıcı ID: {userId}
            </Typography>
            <Avatar userId={userId} userName={userName} avatarId={avatarId} />
          </>
        ) : (
          <Typography variant="body1" color="error">
            Yetkisiz erişim.
          </Typography>
        )}
      </Container>
    </div>
  );
}

export default User;
