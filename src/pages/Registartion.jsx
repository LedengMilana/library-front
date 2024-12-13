import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Registartion() {
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false)
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [username, setUsername] = useState('');
	const [surname, setSurname] = useState('');
	const [secondName, setSecondName] = useState('');
	const [login, setLogin] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [password, setPassword] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [email, setEmail] = useState('');

	const handleClose = () => {
    setOpen(false);
		if (snackColor) {
			navigate("/")
		}
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

	const handleRegistration = async () => {
		if (surname.trim() && passwordRepeat.trim() && username.trim() && secondName.trim() && password.trim() && login.trim()) {
			if (password == passwordRepeat) {
				try {
						const response = await axios.post('http://localhost:5000/auth/registration', {
								surname,
								username,
								secondName,
								login,
								password
						});
						setSnackColor(true)
						setErrorForSnack(response.data.message)
						setOpen(true)
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
			} else {
				setErrorForSnack("Пароли не совпадают!")
				setSnackColor(false)
				setOpen(true)
			}
		} else {
			setErrorForSnack("Заполните все поля!")
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
						<label htmlFor="inp1">Фамилия</label>
						<input type="text" className="inps" placeholder='Введите фамилию' id='inp1' value={surname} onChange={e => setSurname(e.target.value)} />
					</div>
					<div className='reg-for-inps-dop'>
						<label htmlFor="inp2">Имя</label>
						<input type="text" className="inps" placeholder='Введите имя' id='inp2' value={username} onChange={e => setUsername(e.target.value)} />
					</div>
					<div className='reg-for-inps-dop'>
						<label htmlFor="inp3">Отчество</label>
						<input type="text" className="inps" placeholder='Введите отчество' id='inp3' value={secondName} onChange={e => setSecondName(e.target.value)} />
					</div>
					<div className='reg-for-inps-dop'>
						<label htmlFor="inp4">Логин</label>
						<input type="text" className="inps" placeholder='Введите логин' id='inp4' value={login} onChange={e => setLogin(e.target.value)} />
					</div>
					<div className="reg-for-inps-dop">
						<label htmlFor="inp5">Пароль</label>
						<input type="password" className="inps" placeholder='Введите пароль' id='inp5' value={password} onChange={e => setPassword(e.target.value)} />
					</div>
					<div className="reg-for-inps-dop">
						<label htmlFor="inp6">Повторите пароль</label>
						<input type="password" className="inps" placeholder='***' id='inp6' value={passwordRepeat} onChange={e => setPasswordRepeat(e.target.value)} />
					</div>
				</div>
				<div className="reg-for-btns">
					<button className="btn-signin" onClick={handleRegistration}>Зарегистрироваться</button>
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
