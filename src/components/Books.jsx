import React, { useState, useEffect } from 'react'
import Header from './Header'
import axios from 'axios'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Snackbar from '@mui/material/Snackbar';
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

export default function Books() {
	const token = localStorage.getItem('token');

	const [openModal, setOpenModal] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSuccess, setSnackbarSuccess] = useState(false);

	const [nameBook, setNameBook] = useState("");
	const [nameAuthor, setNameAuthor] = useState("");
	const [nameGenre, setNameGenre] = useState("");

	const [authors, setAuthors] = useState([]);
	const [genres, setGenres] = useState([]);
	const [statuses, setStatuses] = useState([]);

	const [books, setBooks] = useState([]);

	const [bookIdToEdit, setBookIdToEdit] = useState(null);
	const [bookTitle, setBookTitle] = useState("");
	const [bookYear, setBookYear] = useState("");
	const [bookAuthorId, setBookAuthorId] = useState("");
	const [bookGenreId, setBookGenreId] = useState("");
	const [bookStatusId, setBookStatusId] = useState("");

	const [bookIdToDelete, setBookIdToDelete] = useState(null);

	const fetchBooks = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/books', {
				headers: { Authorization: `Bearer ${token}` },
				params: {
					title: nameBook,
					author: nameAuthor,
					genre: nameGenre
				}
			});
			setBooks(response.data);
		} catch (error) {
			console.error('Ошибка при получении книг:', error);
		}
	};

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

	const fetchStatuses = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/statuses', {
				headers: { Authorization: `Bearer ${token}` },
			});
			setStatuses(response.data);
		} catch (error) {
			console.error('Ошибка при получении статусов:', error);
		}
	};

	useEffect(() => {
		fetchAuthors();
		fetchGenres();
		fetchStatuses();
	}, []);

	useEffect(() => {
		fetchBooks();
	}, [nameBook, nameAuthor, nameGenre]);

	const handleOpenAdd = () => {
		setBookIdToEdit(null);
		setBookTitle("");
		setBookYear("");
		setBookAuthorId(authors.length > 0 ? authors[0].author_id : "");
		setBookGenreId(genres.length > 0 ? genres[0].genre_id : "");
		setBookStatusId(statuses.length > 0 ? statuses[0].status_id : "");
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleOpenEdit = (book) => {
		setBookIdToEdit(book.book_id);
		setBookTitle(book.title);
		setBookYear(book.publication_year ? book.publication_year.toString() : "");
		setBookAuthorId(book.author_id || (authors.length > 0 ? authors[0].author_id : ""));
		setBookGenreId(book.genre_id || (genres.length > 0 ? genres[0].genre_id : ""));
		setBookStatusId(book.status_id || (statuses.length > 0 ? statuses[0].status_id : ""));
		setOpenModal(true);
	};

	const handleOpenDelete = (bookId) => {
		setBookIdToDelete(bookId);
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const showSnackbar = (message, success = true) => {
		setSnackbarMessage(message);
		setSnackbarSuccess(success);
		setOpenSnackbar(true);
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const addBook = async () => {
		try {
			await axios.post('http://localhost:5000/auth/books', {
				title: bookTitle,
				publication_year: bookYear,
				author_id: bookAuthorId,
				genre_id: bookGenreId,
				status_id: bookStatusId
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchBooks();
			handleCloseModal();
			showSnackbar("Книга успешно добавлена", true);
		} catch (error) {
			console.error("Ошибка при добавлении книги:", error);
			showSnackbar("Ошибка при добавлении книги", false);
		}
	};

	const editBook = async () => {
		try {
			await axios.put(`http://localhost:5000/auth/books/${bookIdToEdit}`, {
				title: bookTitle,
				publication_year: bookYear,
				author_id: bookAuthorId,
				genre_id: bookGenreId,
				status_id: bookStatusId
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchBooks();
			handleCloseModal();
			showSnackbar("Книга успешно обновлена", true);
		} catch (error) {
			console.error("Ошибка при редактировании книги:", error);
			showSnackbar("Ошибка при редактировании книги", false);
		}
	};

	const deleteBook = async () => {
		try {
			await axios.delete(`http://localhost:5000/auth/books/${bookIdToDelete}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchBooks();
			handleCloseDelete();
			showSnackbar("Книга успешно удалена", true);
		} catch (error) {
			console.error("Ошибка при удалении книги:", error);
			showSnackbar("Ошибка при удалении книги", false);
		}
	};

	const handleSubmit = () => {
		if (bookIdToEdit) {
			editBook();
		} else {
			addBook();
		}
	};

	const action = (
		<IconButton
			size="small"
			aria-label="close"
			color="inherit"
			onClick={handleCloseSnackbar}
		>
			<CloseIcon fontSize="small" />
		</IconButton>
	);

	return (
		<>
			<Header />
			<p className='header-p header-p2'>Каталог книг</p>
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpenAdd}>Добавить книгу</button>
				<div className="dop-div-for-search">
					<label htmlFor='inp-name'>Поиск по названию</label>
					<input 
						type="text" 
						className="inps inps-for-search" 
						placeholder='Введите название книги' 
						id='inp-name' 
						value={nameBook} 
						onChange={e => setNameBook(e.target.value)} 
					/>
				</div>
				<div className="dop-div-for-search">
					<label htmlFor='inp-author'>Поиск по автору</label>
					<input 
						type="text" 
						className="inps inps-for-search" 
						placeholder='Введите автора' 
						id='inp-author' 
						value={nameAuthor} 
						onChange={e => setNameAuthor(e.target.value)} 
					/>
				</div>
				<div className="dop-div-for-search">
					<label htmlFor='inp-genre'>Поиск по жанру</label>
					<input 
						type="text" 
						className="inps inps-for-search" 
						placeholder='Введите жанр' 
						id='inp-genre' 
						value={nameGenre} 
						onChange={e => setNameGenre(e.target.value)} 
					/>
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
				{books.map((book) => (
					<div className="row-in-table" key={book.book_id}>
						<table className="row-in-table-inner">
							<tr className='row-in-table-inner-tr'>
									<td className='table-type-p2'>{book.title}</td>
									<td className='table-type-p2'>{book.author_full_name}</td>
									<td className='table-type-p2'>{book.publication_year}</td>
									<td className='table-type-p2'>{book.genre_name}</td>
									<td className='table-type-p2'>{book.status_name}</td>
								</tr>
						</table>
						<button className="btn-edit" onClick={() => handleOpenEdit(book)}>Редактировать</button>
						<button className="btn-edit" onClick={() => handleOpenDelete(book.book_id)}>Удалить</button>
					</div>
				))}
			</div>

			<Modal
				open={openModal}
				onClose={handleCloseModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseModal} />
						<div className="download-modal-h2">
							<h2>{bookIdToEdit ? "Редактировать книгу" : "Добавить книгу"}</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Название книги</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите название' 
										value={bookTitle} 
										onChange={e => setBookTitle(e.target.value)} 
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Автор</label>
									<select className="inps" value={bookAuthorId} onChange={e => setBookAuthorId(e.target.value)}>
										{authors.map((author) => (
											<option key={author.author_id} value={author.author_id}>
												{author.last_name} {author.first_name} {author.patronymic_name || ""}
											</option>
										))}
									</select>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Год издания</label>
									<input 
										type="number" 
										className="inps" 
										placeholder='Введите год издания' 
										value={bookYear} 
										onChange={e => setBookYear(e.target.value)} 
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Жанр</label>
									<select className="inps" value={bookGenreId} onChange={e => setBookGenreId(e.target.value)}>
										{genres.map((genre) => (
											<option key={genre.genre_id} value={genre.genre_id}>
												{genre.genre_name}
											</option>
										))}
									</select>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Статус книги</label>
									<select className="inps" value={bookStatusId} onChange={e => setBookStatusId(e.target.value)}>
										{statuses.map((status) => (
											<option key={status.status_id} value={status.status_id}>
												{status.status_name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseModal}>Отмена</button>
								<button className="btn-signin" onClick={handleSubmit}>{bookIdToEdit ? "Сохранить" : "Добавить"}</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openDelete}
				onClose={handleCloseDelete}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style2}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseDelete} />
						<div className="download-modal-h2">
							<h2 className='download-modal-h2-dop'>Вы уверены, что хотите <br />
							удалить книгу?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleCloseDelete}>Нет</button>
								<button className="btn-signin" onClick={deleteBook}>Да</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={openSnackbar}
				onClose={handleCloseSnackbar}
				message={snackbarMessage}
				action={action}
				className={snackbarSuccess ? "snack-green" : "snack-red"}
			/>
		</>
	)
}
