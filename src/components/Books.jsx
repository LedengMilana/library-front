import React, { useState, useEffect } from 'react'
import Header from './Header'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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

export default function Books() {
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [nameBook, setNameBook] = useState("");
	const [nameAuthor, setNameAuthor] = useState("");
	const [nameGenre, setNameGenre] = useState("");

	const [username, setUsername] = useState('');
	const [surname, setSurname] = useState('');
	const [secondName, setSecondName] = useState('');
	const [login, setLogin] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [password, setPassword] = useState('');

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen2 = () => {
		setOpen2(true);
	};

	const handleClose2 = () => {
		setOpen2(false);
	};

	const handleOpen3 = () => {
		setOpen3(true);
	};

	const handleClose3 = () => {
		setOpen3(false);
	};

	return (
		<>
			<Header />
			<p className='header-p header-p2'>Каталог книг</p>
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpen}>Добавить книгу</button>
				<div className="dop-div-for-search">
					<label htmlFor='inp-name'>Поиск по названию</label>
					<input type="text" className="inps inps-for-search" placeholder='Введите название книги' id='inp-name' value={nameBook} onChange={e => setNameBook(e.target.value)} />
				</div>
				<div className="dop-div-for-search">
					<label htmlFor='inp-author'>Поиск по автору</label>
					<input type="text" className="inps inps-for-search" placeholder='Введите автора ' id='inp-author' value={nameAuthor} onChange={e => setNameAuthor(e.target.value)} />
				</div>
				<div className="dop-div-for-search">
					<label htmlFor='inp-genre'>Поиск по жанру</label>
					<input type="text" className="inps inps-for-search" placeholder='Введите жанр' id='inp-genre' value={nameGenre} onChange={e => setNameGenre(e.target.value)} />
				</div>
			</div>
			<div className="table-type">
				<p className='table-type-p'>Название книги</p>
				<p className='table-type-p'>Автор</p>
				<p className='table-type-p'>Год издания</p>
				<p className='table-type-p'>Жанр</p>
				<p className='table-type-p'>Статус книги</p>
			</div>
			<div className="table">
				<div className="row-in-table">
					<table className="row-in-table-inner">
						<tr className='row-in-table-inner-tr'>
							<td className='table-type-p2'>Преступление и наказание</td>
							<td className='table-type-p2'>Фёдор Михайлович Достоевский</td>
							<td className='table-type-p2'>2004</td>
							<td className='table-type-p2'>Роман</td>
							<td className='table-type-p2'>В наличии</td>
						</tr>
					</table>
					<button className="btn-edit" onClick={handleOpen2}>Редактировать</button>
					<button className="btn-edit" onClick={handleOpen3}>Удалить</button>
				</div>
				<div className="row-in-table">
					<table className="row-in-table-inner">
						<tr className='row-in-table-inner-tr'>
							<td className='table-type-p2'>Преступление и наказание</td>
							<td className='table-type-p2'>Фёдор Михайлович Достоевский</td>
							<td className='table-type-p2'>2004</td>
							<td className='table-type-p2'>Роман</td>
							<td className='table-type-p2'>В наличии</td>
						</tr>
					</table>
					<button className="btn-edit" onClick={handleOpen2}>Редактировать</button>
					<button className="btn-edit" onClick={handleOpen3}>Удалить</button>
				</div>
				<div className="row-in-table">
					<table className="row-in-table-inner">
						<tr className='row-in-table-inner-tr'>
							<td className='table-type-p2'>Преступление и наказание</td>
							<td className='table-type-p2'>Фёдор Михайлович Достоевский</td>
							<td className='table-type-p2'>2004</td>
							<td className='table-type-p2'>Роман</td>
							<td className='table-type-p2'>В наличии</td>
						</tr>
					</table>
					<button className="btn-edit" onClick={handleOpen2}>Редактировать</button>
					<button className="btn-edit" onClick={handleOpen3}>Удалить</button>
				</div>
				<div className="row-in-table">
					<table className="row-in-table-inner">
						<tr className='row-in-table-inner-tr'>
							<td className='table-type-p2'>Преступление и наказание</td>
							<td className='table-type-p2'>Фёдор Михайлович Достоевский</td>
							<td className='table-type-p2'>2004</td>
							<td className='table-type-p2'>Роман</td>
							<td className='table-type-p2'>В наличии</td>
						</tr>
					</table>
					<button className="btn-edit" onClick={handleOpen2}>Редактировать</button>
					<button className="btn-edit" onClick={handleOpen3}>Удалить</button>
				</div>
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
							<h2>Добавить книгу</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp1">Название книги</label>
									<input type="text" className="inps" placeholder='Введите название' id='inp1' value={surname} onChange={e => setSurname(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp2">Автор книги</label>
									<input type="text" className="inps" placeholder='Введите автора' id='inp2' value={username} onChange={e => setUsername(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp3">Год издания книги</label>
									<input type="text" className="inps" placeholder='Введите год издания' id='inp3' value={secondName} onChange={e => setSecondName(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp4">Жанр книги</label>
									<input type="text" className="inps" placeholder='Введите жанр' id='inp4' value={login} onChange={e => setLogin(e.target.value)} />
								</div>
								<div className="reg-for-inps-dop">
									<label htmlFor="inp5">Статус книги</label>
									<input type="password" className="inps" placeholder='В наличии/ выдана/ повреждена/ утеряна' id='inp5' value={password} onChange={e => setPassword(e.target.value)} />
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose}>Отмена</button>
								<button className="btn-signin" onClick={handleClose}>Добавить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
			<Modal
				open={open2}
				onClose={handleClose2}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleClose2} />
						<div className="download-modal-h2">
							<h2>Редактировать книгу</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp1">Название книги</label>
									<input type="text" className="inps" placeholder='Введите название' id='inp1' value={surname} onChange={e => setSurname(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp2">Автор книги</label>
									<input type="text" className="inps" placeholder='Введите автора' id='inp2' value={username} onChange={e => setUsername(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp3">Год издания книги</label>
									<input type="text" className="inps" placeholder='Введите год издания' id='inp3' value={secondName} onChange={e => setSecondName(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp4">Жанр книги</label>
									<input type="text" className="inps" placeholder='Введите жанр' id='inp4' value={login} onChange={e => setLogin(e.target.value)} />
								</div>
								<div className="reg-for-inps-dop">
									<label htmlFor="inp5">Статус книги</label>
									<input type="password" className="inps" placeholder='В наличии/ выдана/ повреждена/ утеряна' id='inp5' value={password} onChange={e => setPassword(e.target.value)} />
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose2}>Отмена</button>
								<button className="btn-signin" onClick={handleClose2}>Сохранить</button>
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
							удалить книгу?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleClose3}>Нет</button>
								<button className="btn-signin" onClick={handleClose3}>Да</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>
		</>
	)
}
