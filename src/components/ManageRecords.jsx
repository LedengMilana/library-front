import React, { useState, useEffect } from 'react'
import Header from './Header'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '60%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	borderRadius: "15px",
	outline: "none"
};

const style2 = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	borderRadius: "15px",
	outline: "none"
};

export default function ManageRecords() {
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [username, setUsername] = useState('');
	const [surname, setSurname] = useState('');
	const [secondName, setSecondName] = useState('');
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [users, setUsers] = useState([])
	const [userIdToDelete, setUserIdToDelete] = useState(null);


	const token = localStorage.getItem('token');

	const fetchUsers = async () => {
		try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:5000/auth/users', {
						headers: { Authorization: `Bearer ${token}` },
				});
				setUsers(response.data)
				console.log(response.data);
		} catch (error) {
				console.error('Ошибка при получении данных:', error);
		}
	};

	const giveAdmin = async (userId) => {
			try {
					const response = await axios.post(`http://localhost:5000/auth/setAdmin/${userId}`, {}, {
							headers: { Authorization: `Bearer ${token}` },
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
					setOpen2(true);
					fetchUsers();
			} catch (error) {
					console.error(error);
					setSnackColor(false);
					setErrorForSnack(error.response?.data?.message || "Ошибка при добавлении прав администратора");
					setOpen2(true);
			}
	}

	const removeAdmin = async (userId) => {
			try {
					const response = await axios.post(`http://localhost:5000/auth/removeAdmin/${userId}`, {}, {
							headers: { Authorization: `Bearer ${token}` },
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
					setOpen2(true);
					fetchUsers();
			} catch (error) {
					console.error(error);
					setSnackColor(false);
					setErrorForSnack(error.response?.data?.message || "Ошибка при удалении прав администратора");
					setOpen2(true);
			}
	}

	const deleteUserById = async (userId) => {
			try {
					const response = await axios.delete(`http://localhost:5000/auth/deleteUser/${userId}`, {
							headers: { Authorization: `Bearer ${token}` },
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
					setOpen2(true);
					fetchUsers();
			} catch (error) {
					console.error(error);
					setSnackColor(false);
					setErrorForSnack(error.response?.data?.message || "Ошибка при удалении пользователя");
					setOpen2(true);
			}
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
	};

	const handleCloseAdd = async () => {
		if (surname.trim() && username.trim() && secondName.trim() && password.trim() && login.trim()) {
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
						setSurname("")
						setUsername("")
						setSecondName("")
						setLogin("")
						setPassword("")
						setOpen2(true)
						fetchUsers()
				} catch (error) {
						console.error(error);
						if (error.response && error.response.data.errors) {
							setErrorForSnack(error.response.data.errors.errors[0].msg || error.response.data.message)
						} else if (error.response) {
							setErrorForSnack(error.response.data.message);
						}
						setSnackColor(false)
						setOpen2(true)
				}
		} else {
			setErrorForSnack("Заполните все поля!")
			setSnackColor(false)
			setOpen2(true)
		}
	}

	const handleOpen2 = () => {
		
	};

	const handleClose2 = () => {
    setOpen2(false);
		if (snackColor) {
			setOpen(false)
		}
  };

	const handleOpen3 = () => {
		setOpen3(true);
	};

	const handleClose3 = () => {
		setOpen3(false);
	};

	const action = (
    <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose2}
      >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

	return (
		<>
			<Header />
			<p className='header-p header-p2'>Управление учетными записями</p>
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpen}>Добавить библиотекаря</button>
			</div>
			<div className="table-type">
				<p className='table-type-p'>Username</p>
				<p className='table-type-p'>Имя</p>
				<p className='table-type-p'>Фамилия</p>
				<p className='table-type-p'>Отчество</p>
			</div>
			<div className="table2">
				{users.map((user)=>(
					<div className="row-in-table" key={user.id}>
						<div className="row-in-table-inner row-in-table-inner2">
								<div className="row-in-table-inner-tr row-in-table-inner-tr2">
										<span className="table-type-p2 table-type-p3">{user.username}</span>
										<span className="table-type-p2 table-type-p3">{user.first_name}</span>
										<span className="table-type-p2 table-type-p3">{user.last_name}</span>
										<span className="table-type-p2 table-type-p3">{user.patronymic_name}</span>
								</div>
						</div>
						{JSON.parse(user.roles).includes("ADMIN") ? <button className="btn-edit" onClick={() => removeAdmin(user.user_id)}>Забрать права админа</button> : <button className="btn-signin" onClick={() => giveAdmin(user.user_id)}>Дать права админа</button>}
						<button className="btn-edit" onClick={() => {
							setOpen3(true);
							setUserIdToDelete(user.user_id);
						}}>Удалить</button>
					</div>
				))}
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleClose} />
						<div className="download-modal-h2">
							<h2>Добавить библиотекаря</h2>
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
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose}>Отмена</button>
								<button className="btn-signin" onClick={handleCloseAdd}>Добавить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
			<Modal
				open={open3}
				onClose={handleClose3}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style2}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleClose3} />
						<div className="download-modal-h2">
							<h2 className='download-modal-h2-dop'>Вы уверены, что хотите <br />
							удалить библиотекаря?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleClose3}>Нет</button>
								<button className="btn-signin" onClick={() => {
									deleteUserById(userIdToDelete);
									handleClose3();
								}}>Да</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
			<Snackbar
				anchorOrigin={{ vertical, horizontal }}
				open={open2}
				onClose={handleClose2}
				message={errorForSnack}
				action={action}
				className={snackColor ? "snack-green" : "snack-red"}
			/>
		</>
	)
}
