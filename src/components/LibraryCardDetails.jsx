import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
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

export default function LibraryCardDetails() {
	const navigate = useNavigate();
  const { cardId } = useParams();
  const token = localStorage.getItem('token');

  const [cardInfo, setCardInfo] = useState(null);
  const [error, setError] = useState('');

	const [openEditReader, setOpenEditReader] = useState(false);
	const [editFirstName, setEditFirstName] = useState('');
	const [editLastName, setEditLastName] = useState('');
	const [editPatronymicName, setEditPatronymicName] = useState('');
	const [editPhoneNumber, setEditPhoneNumber] = useState('');
	const [editAddress, setEditAddress] = useState('');
	const [editEmail, setEditEmail] = useState('');

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSuccess, setSnackbarSuccess] = useState(false);

	const [openAddBorrowing, setOpenAddBorrowing] = useState(false);
	const [books, setBooks] = useState([]);
	const [selectedBookId, setSelectedBookId] = useState('');
	const [borrowDate, setBorrowDate] = useState('');
	const [dueDate, setDueDate] = useState('');

	const [openReturnModal, setOpenReturnModal] = useState(false);
	const [returnBorrowingId, setReturnBorrowingId] = useState(null);
	const [actualReturnDate, setActualReturnDate] = useState('');

	const [borrowings, setBorrowings] = useState([]);

	const [returnedBooks, setReturnedBooks] = useState([]);

  const fetchCardInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCardInfo(response.data);
    } catch (err) {
      console.error("Ошибка при получении данных о билете:", err);
      setError(err.response?.data?.message || "Ошибка при загрузке данных");
    }
  };

	const fetchBorrowings = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/auth/borrowings/${cardId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setBorrowings(response.data);
		} catch (error) {
			console.error("Ошибка при получении выданных книг:", error);
		}
	};

	const fetchReturned = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/auth/returned/${cardId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setReturnedBooks(response.data);
		} catch (error) {
			console.error("Ошибка при получении возвращённых книг:", error);
		}
	};

	const fetchBooks = async () => {
		try {
			const response = await axios.get(`http://localhost:5000/auth/books`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setBooks(response.data);
			if (response.data.length > 0) {
				setSelectedBookId(response.data[0].book_id.toString());
			}
		} catch (error) {
			console.error("Ошибка при получении списка книг:", error);
		}
	};

  useEffect(() => {
    fetchCardInfo();
		fetchBorrowings();
		fetchReturned();
  }, [cardId]);

  if (error) {
    return (
      <>
        <Header />
        <p className='header-p header-p2'>Ошибка: {error}</p>
      </>
    );
  }

  if (!cardInfo) {
    return (
      <>
        <Header />
        <p className='header-p header-p2'>Загрузка...</p>
      </>
    );
  }

  const { card_id, first_name, last_name, patronymic_name, phone_number, address, email, reader_id } = cardInfo;

	const showSnackbar = (message, success = true) => {
		setSnackbarMessage(message);
		setSnackbarSuccess(success);
		setOpenSnackbar(true);
	};

	const handleOpenEditReader = () => {
		setEditFirstName(first_name || '');
		setEditLastName(last_name || '');
		setEditPatronymicName(patronymic_name || '');
		setEditPhoneNumber(phone_number || '');
		setEditAddress(address || '');
		setEditEmail(email || '');
		setOpenEditReader(true);
	};

	const handleCloseEditReader = () => {
		setOpenEditReader(false);
	};

	const handleSaveReader = async () => {
		try {
			await axios.put(`http://localhost:5000/auth/readers/${reader_id}`, {
				first_name: editFirstName,
				last_name: editLastName,
				patronymic_name: editPatronymicName,
				phone_number: editPhoneNumber,
				address: editAddress,
				email: editEmail
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			showSnackbar("Данные читателя успешно обновлены", true);
			handleCloseEditReader();
			fetchCardInfo();
		} catch (error) {
			console.error("Ошибка при обновлении читателя:", error);
			showSnackbar("Ошибка при обновлении читателя", false);
		}
	};

	const handleOpenAddBorrowing = async () => {
		await fetchBooks();
		setBorrowDate('');
		setDueDate('');
		setOpenAddBorrowing(true);
	};

	const handleCloseAddBorrowing = () => {
		setOpenAddBorrowing(false);
	};

	const handleAddBorrowing = async () => {
		if (!selectedBookId || !borrowDate || !dueDate) {
			showSnackbar("Заполните все поля", false);
			return;
		}
		try {
			await axios.post('http://localhost:5000/auth/borrowings', {
				reader_id,
				book_id: parseInt(selectedBookId),
				card_id,
				borrow_date: borrowDate,
				due_date: dueDate
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			showSnackbar("Выдача успешно зарегистрирована", true);
			handleCloseAddBorrowing();
			fetchBorrowings();
		} catch (error) {
			console.error("Ошибка при регистрации выдачи:", error);
			showSnackbar("Ошибка при регистрации выдачи", false);
		}
	};

	const handleOpenReturnModal = (borrowing) => {
		setReturnBorrowingId(borrowing.borrowing_id);
		setActualReturnDate('');
		setOpenReturnModal(true);
	};

	const handleCloseReturnModal = () => {
		setOpenReturnModal(false);
	};

	const handleConfirmReturn = async () => {
		if (!actualReturnDate) {
			showSnackbar("Введите дату возврата", false);
			return;
		}
		try {
			await axios.post('http://localhost:5000/auth/returns', {
				borrowing_id: returnBorrowingId,
				actual_return_date: actualReturnDate
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			showSnackbar("Возврат успешно зарегистрирован", true);
			handleCloseReturnModal();
			fetchBorrowings();
			fetchReturned();
		} catch (error) {
			console.error("Ошибка при подтверждении возврата:", error);
			showSnackbar("Ошибка при подтверждении возврата", false);
		}
	};

	const handleDownloadReport = () => {
		window.open(`http://localhost:5000/auth/report/${cardId}`, '_blank');
	};

	const action = (
		<IconButton
			size="small"
			aria-label="close"
			color="inherit"
			onClick={() => setOpenSnackbar(false)}
		>
			<CloseIcon fontSize="small" />
		</IconButton>
	);

  return (
    <>
      <Header />
      <p className='header-p header-p2' onClick={() => navigate(`/catalog/library-cards`)}><span className='btn-back'>{"< Назад"}</span></p>
			<div className="directories-header">
				<p className='header-p header-p2'>Читательский билет <span className='card-number'>№{card_id}</span></p>
				<div className="reg-for-btns reg-for-btns2 reg-for-btns4">
					<button className="btn-edit" onClick={handleOpenEditReader}>Редактировать</button>
					<button className="btn-signin" onClick={handleDownloadReport}>Отчет</button>
				</div>
			</div>
      <div className="table-type">
        <p className='table-type-p table-type-p-dop2'>Фамилия</p>
        <p className='table-type-p table-type-p-dop2'>Имя</p>
        <p className='table-type-p table-type-p-dop2'>Отчество</p>
        <p className='table-type-p table-type-p-dop2'>Номер телефона</p>
        <p className='table-type-p table-type-p-dop2'>Адрес</p>
        <p className='table-type-p table-type-p-dop2'>Email</p>
      </div>
      <div className="table2">
        <div className="row-in-table">
          <div className="row-in-table-inner row-in-table-inner5">
            <div className="row-in-table-inner-tr row-in-table-inner-tr2 row-in-table-inner5">
              <span className="table-type-p2 table-type-p3 table-type-p5">{last_name}</span>
              <span className="table-type-p2 table-type-p3 table-type-p5">{first_name}</span>
              <span className="table-type-p2 table-type-p3 table-type-p5">{patronymic_name || ""}</span>
              <span className="table-type-p2 table-type-p3 table-type-p5">{phone_number || ""}</span>
              <span className="table-type-p2 table-type-p3 table-type-p5">{address || ""}</span>
              <span className="table-type-p2 table-type-p3 table-type-p5">{email || ""}</span>
            </div>
          </div>
        </div>
      </div>
			<br />
      <Divider />
			<p className='header-p header-p2'>Книги у читателя</p>
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpenAddBorrowing}>Зарегистрировать выдачу</button>
			</div>
			<div className="table-type table-type2">
				<p className='table-type-p table-type-p-dop'>Название книги</p>
				<p className='table-type-p table-type-p-dop'>Номер чит. билета</p>
				<p className='table-type-p table-type-p-dop'>ФИО читателя</p>
				<p className='table-type-p table-type-p-dop'>Дата получения</p>
				<p className='table-type-p table-type-p-dop'>Срок возврата</p>
			</div>
			<div className="table2">
				{borrowings.length === 0 ? <p className='header-p header-p2'>Нет выданных книг</p> : borrowings.map((borrowing) => (
					<div className="row-in-table" key={borrowing.borrowing_id}>
						<div className="row-in-table-inner">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2 row-in-table-inner-tr3">
								<span className="table-type-p2 table-type-p3 table-type-p5">{borrowing.book_title}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{card_id}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{borrowing.reader_name}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{borrowing.borrow_date}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{borrowing.due_date}</span>
							</div>
						</div>
						<button className="btn-edit" onClick={() => handleOpenReturnModal(borrowing)}>Подтвердить возврат книги</button>
					</div>
				))}
			</div>
			<br />
			<Divider />
			<p className='header-p header-p2'>Список возвращённых книг</p>
			<div className="table-type">
				<p className='table-type-p table-type-p-dop'>Название книги</p>
				<p className='table-type-p table-type-p-dop'>Дата получения</p>
				<p className='table-type-p table-type-p-dop'>Срок возврата</p>
				<p className='table-type-p table-type-p-dop'>Дата возврата</p>
				<p className='table-type-p table-type-p-dop'>Статус возврата</p>
			</div>
			<div className="table2">
				{returnedBooks.length === 0 ? <p className='header-p header-p2'>Нет возвращённых книг</p> : returnedBooks.map((returned) => (
					<div className="row-in-table" key={returned.return_id}>
						<div className="row-in-table-inner row-in-table-inner5">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2 row-in-table-inner-tr3">
								<span className="table-type-p2 table-type-p3 table-type-p5">{returned.book_title}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{returned.borrow_date}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{returned.due_date}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{returned.return_date}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{returned.status_name}</span>
							</div>
						</div>
					</div>
				))}
			</div>
			<br />
			<br />

			<Modal
				open={openEditReader}
				onClose={handleCloseEditReader}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseEditReader} />
						<div className="download-modal-h2">
							<h2>Редактировать читателя</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Фамилия</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите фамилию' 
										value={editLastName}
										onChange={e => setEditLastName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Имя</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите имя' 
										value={editFirstName}
										onChange={e => setEditFirstName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Отчество</label>
									<input 
										type="text" 
										className="inps"
										placeholder='Введите отчество'
										value={editPatronymicName}
										onChange={e => setEditPatronymicName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Номер телефона</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите номер телефона' 
										value={editPhoneNumber}
										onChange={e => setEditPhoneNumber(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Адрес</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите адрес' 
										value={editAddress}
										onChange={e => setEditAddress(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Email</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите email'
										value={editEmail}
										onChange={e => setEditEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseEditReader}>Отмена</button>
								<button className="btn-signin" onClick={handleSaveReader}>Сохранить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openAddBorrowing}
				onClose={handleCloseAddBorrowing}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseAddBorrowing} />
						<div className="download-modal-h2">
							<h2>Зарегистрировать выдачу</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Название книги</label>
									<select className="inps" value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)}>
										{books.map((book) => (
											<option key={book.book_id} value={book.book_id} disabled={book.status_id == 2 ? true : book.status_id == 3 ? true : book.status_id == 4 ? true : false}>{book.title} {book.status_id == 2 ? "(выдана)" : book.status_id == 3 ? "(утеряна)" : book.status_id == 4 ? "(повреждена)" : ""}</option>
										))}
									</select>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Номер чит. билета</label>
									<input type="text" className="inps" value={card_id} disabled />
								</div>
								<div className='reg-for-inps-dop'>
									<label>ФИО читателя</label>
									<input type="text" className="inps" value={`${last_name} ${first_name} ${patronymic_name||''}`} disabled />
								</div>
								<div className='reg-for-inps-dop'>
									<label>Дата получения</label>
									<input type="date" className="inps" value={borrowDate} onChange={e => setBorrowDate(e.target.value)} />
								</div>
								<div className='reg-for-inps-dop'>
									<label>Срок возврата</label>
									<input type="date" className="inps" value={dueDate} onChange={e => setDueDate(e.target.value)} />
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseAddBorrowing}>Отмена</button>
								<button className="btn-signin" onClick={handleAddBorrowing}>Добавить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openReturnModal}
				onClose={handleCloseReturnModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseReturnModal} />
						<div className="download-modal-h2">
							<h2>Подтвердить возврат книги</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Дата возврата</label>
									<input type="date" className="inps" value={actualReturnDate} onChange={e => setActualReturnDate(e.target.value)} />
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseReturnModal}>Отмена</button>
								<button className="btn-signin" onClick={handleConfirmReturn}>Подтвердить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={openSnackbar}
				onClose={() => setOpenSnackbar(false)}
				message={snackbarMessage}
				action={action}
				className={snackbarSuccess ? "snack-green" : "snack-red"}
			/>
    </>
  );
}
