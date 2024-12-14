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

export default function Genres() {
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [genreName, setGenreName] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [genres, setGenres] = useState([])
	const [genreIdToDelete, setGenreIdToDelete] = useState(null);
	const [genreIdToEdit, setGenreIdToEdit] = useState(null);

	const token = localStorage.getItem('token');

	const fetchGenres = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/genres', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setGenres(response.data);
		} catch (error) {
			console.error('Ошибка при получении жанров:', error);
		}
	};

	useEffect(() => {
		fetchGenres();
	}, []);

	const handleOpen = () => {
		setGenreName('');
		setGenreIdToEdit(null);
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		if (genreName.trim()) {
			try {
				if (genreIdToEdit) {
					const response = await axios.put(`http://localhost:5000/auth/genres/${genreIdToEdit}`, {
						genre_name: genreName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				} else {
					const response = await axios.post('http://localhost:5000/auth/genres', {
						genre_name: genreName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				}

				setGenreName("");
				setOpen2(true);
				fetchGenres();

			} catch (error) {
				console.error(error);
				setSnackColor(false);
				setErrorForSnack(error.response?.data?.message || "Ошибка при сохранении жанра");
				setOpen2(true);
			}
		} else {
			setErrorForSnack("Заполните название жанра!");
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

	const deleteGenreById = async (genreId) => {
		try {
			const response = await axios.delete(`http://localhost:5000/auth/genres/${genreId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSnackColor(true);
			setErrorForSnack(response.data.message);
			setOpen2(true);
			fetchGenres();
		} catch (error) {
			console.error(error);
			setSnackColor(false);
			setErrorForSnack(error.response?.data?.message || "Ошибка при удалении жанра");
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
				<button className="btn-signin" onClick={handleOpen}>Добавить жанр</button>
			</div>
			<div className="table-type">
				<p className='table-type-p'>Название жанра</p>
			</div>
			<div className="table2">
				{genres.map((genre) => (
					<div className="row-in-table row-in-table2" key={genre.genre_id}>
						<div className="row-in-table-inner row-in-table-inner3">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2 row-in-table-inner-tr3">
								<span className="table-type-p2 table-type-p3 table-type-p4">{genre.genre_name}</span>
							</div>
						</div>
						<button className="btn-edit" onClick={() => {
							setGenreName(genre.genre_name);
							setGenreIdToEdit(genre.genre_id);
							setOpen(true);
						}}>Редактировать</button>
						<button className="btn-edit" onClick={() => {
							setOpen3(true);
							setGenreIdToDelete(genre.genre_id);
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
							<h2>{genreIdToEdit ? "Редактировать жанр" : "Добавить жанр"}</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp1">Название жанра</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите название' 
										id='inp1' 
										value={genreName} 
										onChange={e => setGenreName(e.target.value)} 
									/>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose}>Отмена</button>
								<button className="btn-signin" onClick={handleSubmit}>{genreIdToEdit ? "Сохранить" : "Добавить"}</button>
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
								удалить этот жанр?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleClose3}>Нет</button>
								<button className="btn-signin" onClick={() => {
									deleteGenreById(genreIdToDelete);
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
