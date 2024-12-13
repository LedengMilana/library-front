import React, { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false)
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [email, setEmail] = useState('');

	useEffect(() => {
    axios.get('http://localhost:5000/auth/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      navigate("/catalog")
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

	const handleClose = () => {
    setOpen(false);
  };
	const action = (
    <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

	const handleLogin = async () => {
		try {
			const response = await axios.post('http://localhost:5000/auth/login', {
					username,
					password
			});
			localStorage.setItem('token', response.data.token);
			navigate("/catalog")
		} catch (error) {
			console.error(error);
			if (error.response && error.response.data.errors) {
				setErrorForSnack(error.response.data.errors.errors[0].msg || error.response.data.message)
			} else if (error.response) {
				setErrorForSnack(error.response.data.message);
			}
			setSnackColor(false)
			setOpen(true)
		}
	};
	return (
		<div className='wrapper'>
			<div className="container">
				<div className="container-for-navs">
					<p className='reg-p2'><NavLink className={`reg-a ${location.pathname === '/' ? 'reg-a-active' : ''}`} to="/">Авторизация</NavLink></p>
					<p className='reg-p2'><NavLink className={`reg-a ${location.pathname === '/registration' ? 'reg-a-active' : ''}`} to="/registration">Регистрация</NavLink></p>
				</div>
				<div className="reg-for-inps">
					<div className='reg-for-inps-dop'>
						<label htmlFor="inp1">Логин</label>
						<input type="text" className="inps" placeholder='Введите логин' id='inp1' value={username} onChange={e => setUsername(e.target.value)} />
					</div>
					<div className="reg-for-inps-dop">
						<label htmlFor="inp2">Пароль</label>
						<input type="password" className="inps" placeholder='Введите пароль' id='inp2' value={password} onChange={e => setPassword(e.target.value)} />
					</div>
				</div>
				<div className="reg-for-btns">
					<button className="btn-signin" onClick={handleLogin}>Войти</button>
				</div>
			</div>
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open}
				onClose={handleClose}
				message={errorForSnack}
				action={action}
				className={snackColor ? "snack-green" : "snack-red"}
			/>
		</div>
	)
}
