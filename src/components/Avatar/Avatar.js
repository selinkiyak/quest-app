import { Box, Button, Card, CardContent, CardMedia, FormControl, Input, InputLabel, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { PutWithAuth } from '../../components/Services/HttpService';

const Avatar = ({ userId, userName }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    // Kullanıcı profili yüklendiğinde mevcut bilgileri al
    fetch(`/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setName(data.name || '');
          setSurname(data.surname || '');
          setBirthDate(data.birthDate || '');
          setZodiac(data.zodiac || '');
          if (data.avatarId) {
            setProfileImageUrl(`/avatars/${data.avatarId}`);
          }
        }
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [userId]);

  const saveAvatar = async () => {
    const formData = new FormData();
    formData.append('userName', userName); // userName parametresinin eklendiğinden emin olun
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('birthDate', birthDate);
    formData.append('zodiac', zodiac);
  
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }
  
    try {
      const response = await PutWithAuth(`/users/${userId}`, formData);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save:', errorText);
        return;
      }
  
      const result = await response.json();
      console.log('Response:', result);
  
      if (result.avatarId) {
        setProfileImageUrl(`/avatars/${result.avatarId}`);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    saveAvatar();
    setOpen(false);
  };

  return (
    <div>
      <Card sx={{ maxWidth: 345, margin: 5 }}>
        <CardMedia
          component="img"
          alt="Profile Picture"
          image={selectedFile ? URL.createObjectURL(selectedFile) : profileImageUrl}
          title="Profile Picture"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name} {surname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Birth Date: {birthDate} <br />
            Zodiac: {zodiac}
          </Typography>
        </CardContent>
        <Button size="small" color="primary" onClick={handleOpen}>
          Change Profile
        </Button>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="profile-selection-title"
        aria-describedby="profile-selection-description"
      >
        <Box sx={{ width: 300, bgcolor: 'background.paper', p: 2, mx: 'auto', mt: '10%' }}>
          <Typography variant="h6" gutterBottom>
            Change Profile
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="surname">Surname</InputLabel>
            <Input
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="birthDate">Birth Date</InputLabel>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="zodiac">Zodiac</InputLabel>
            <Input
              id="zodiac"
              value={zodiac}
              onChange={(e) => setZodiac(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="profileImage">Profile Image</InputLabel>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

Avatar.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userName: PropTypes.string.isRequired,
};

export default Avatar;
