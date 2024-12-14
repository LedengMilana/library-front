import React, { useState, useEffect } from 'react'
import axios from 'axios'
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

export default function Authors() {
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [patronymicName, setPatronymicName] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [authors, setAuthors] = useState([])
	const [authorIdToDelete, setAuthorIdToDelete] = useState(null);
	const [authorIdToEdit, setAuthorIdToEdit] = useState(null);

	const token = localStorage.getItem('token');

	const fetchAuthors = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/authors', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setAuthors(response.data);
		} catch (error) {
			console.error('Ошибка при получении авторов:', error);
		}
	};

	useEffect(() => {
		fetchAuthors();
	}, []);

	const handleOpen = () => {
		setFirstName('');
		setLastName('');
		setPatronymicName('');
		setAuthorIdToEdit(null);
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		if (firstName.trim() && lastName.trim()) {
			try {
				if (authorIdToEdit) {
					const response = await axios.put(`http://localhost:5000/auth/authors/${authorIdToEdit}`, {
						first_name: firstName,
						last_name: lastName,
						patronymic_name: patronymicName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				} else {
					const response = await axios.post('http://localhost:5000/auth/authors', {
						first_name: firstName,
						last_name: lastName,
						patronymic_name: patronymicName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				}

				setFirstName("");
				setLastName("");
				setPatronymicName("");
				setOpen2(true);
				fetchAuthors();

			} catch (error) {
				console.error(error);
				setSnackColor(false);
				setErrorForSnack(error.response?.data?.message || "Ошибка при сохранении автора");
				setOpen2(true);
			}
		} else {
			setErrorForSnack("Заполните хотя бы имя и фамилию автора!");
			setSnackColor(false);
			setOpen2(true);
		}
	};

	const handleClose2 = () => {
		setOpen2(false);
		if (snackColor) {
			setOpen(false);
		}
	};

	const handleOpen3 = () => {
		setOpen3(true);
	};

	const handleClose3 = () => {
		setOpen3(false);
	};

	const deleteAuthorById = async (authorId) => {
		try {
			const response = await axios.delete(`http://localhost:5000/auth/authors/${authorId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSnackColor(true);
			setErrorForSnack(response.data.message);
			setOpen2(true);
			fetchAuthors();
		} catch (error) {
			console.error(error);
			setSnackColor(false);
			setErrorForSnack(error.response?.data?.message || "Ошибка при удалении автора");
			setOpen2(true);
		}
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
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpen}>Добавить автора</button>
			</div>
			<div className="table-type">
				<p className='table-type-p table-type-p-dop'>Фамилия</p>
				<p className='table-type-p table-type-p-dop'>Имя</p>
				<p className='table-type-p table-type-p-dop'>Отчество</p>
			</div>
			<div className="table2">
				{authors.map((author) => (
					<div className="row-in-table" key={author.author_id}>
						<div className="row-in-table-inner">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2">
								<span className="table-type-p2 table-type-p3 table-type-p5">{author.last_name}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{author.first_name}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{author.patronymic_name || ""}</span>
							</div>
						</div>
						<button className="btn-edit" onClick={() => {
							setFirstName(author.first_name);
							setLastName(author.last_name);
							setPatronymicName(author.patronymic_name || '');
							setAuthorIdToEdit(author.author_id);
							setOpen(true);
						}}>Редактировать</button>
						<button className="btn-edit" onClick={() => {
							setOpen3(true);
							setAuthorIdToDelete(author.author_id);
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
							<h2>{authorIdToEdit ? "Редактировать автора" : "Добавить автора"}</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp1">Фамилия</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите фамилию' 
										id='inp1' 
										value={lastName} 
										onChange={e => setLastName(e.target.value)} 
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp2">Имя</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите имя' 
										id='inp2' 
										value={firstName} 
										onChange={e => setFirstName(e.target.value)} 
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp3">Отчество</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите отчество'
										id='inp3' 
										value={patronymicName} 
										onChange={e => setPatronymicName(e.target.value)} 
									/>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose}>Отмена</button>
								<button className="btn-signin" onClick={handleSubmit}>{authorIdToEdit ? "Сохранить" : "Добавить"}</button>
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
								удалить автора?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleClose3}>Нет</button>
								<button className="btn-signin" onClick={() => {
									deleteAuthorById(authorIdToDelete);
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
