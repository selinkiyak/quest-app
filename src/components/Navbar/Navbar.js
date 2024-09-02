import LockOpen from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'static',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LeftSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const RightSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'white',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const MenuButton = styled(MenuIcon)(({ theme }) => ({
  color: 'white',
}));

function Navbar() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  useEffect(() => {
    // `localStorage`'daki değişiklikleri dinleyin
    const handleStorageChange = () => {
      setCurrentUser(localStorage.getItem("currentUser"));
    };

    window.addEventListener('storage', handleStorageChange);

    // Temizlik işlevi
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setCurrentUser(localStorage.getItem("currentUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate('/'); // Ana sayfaya yönlendirme
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        <LeftSection>
          <MenuButton />
          <StyledLink to="/">Home</StyledLink>
        </LeftSection>
        <RightSection>
          {currentUser ? (
            <>
              <StyledLink to={`/users/${currentUser}`}>
                Profile
              </StyledLink>
              <Button color="inherit" onClick={handleLogout}>
                <LockOpen />
              </Button>
            </>
          ) : (
            <StyledLink to="/auth">Login/Register</StyledLink>
          )}
        </RightSection>
      </StyledToolbar>
    </StyledAppBar>
  );
}

export default Navbar;
