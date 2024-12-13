import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import iconic from '../assets/profile.svg';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
	const [fullName, setFullName] = useState('');

	useEffect(() => {
			const fetchUserInfo = async () => {
					try {
							const token = localStorage.getItem('token');
							const response = await axios.get('http://localhost:5000/auth/userinfo', {
									headers: { Authorization: `Bearer ${token}` },
							});
							const { first_name, last_name, patronymic_name } = response.data;
							setFullName(`${last_name} ${first_name} ${patronymic_name}`);
					} catch (error) {
							console.error('Ошибка при получении данных пользователя:', error);
					}
			};
			fetchUserInfo();
	}, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExit = () => {
    localStorage.removeItem("token")
    setAnchorEl(null);
    navigate("/")
  };
	
	return (
		<>
			<div className="header">
				<p className='header-p'>Учет книг и читательских билетов</p>

        <div className="header-right">
					<p>{fullName}</p>
          <Tooltip title="Профиль">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              className='header-photo2'
            >
              <Avatar alt="Travis Howard" src={iconic} className='header-photo' />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: '#407AF8',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleExit}>
              <ListItemIcon>
                <Logout fontSize="small" style={{ color: 'white' }} />
              </ListItemIcon>
              Выйти
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Divider />
		</>
	)
}
