import Header from './Header'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

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

export default function LibraryCards() {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	const [cards, setCards] = useState([]);

	const [statuses, setStatuses] = useState([]);

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const [addFirstName, setAddFirstName] = useState('');
	const [addLastName, setAddLastName] = useState('');
	const [addPatronymicName, setAddPatronymicName] = useState('');
	const [addPhoneNumber, setAddPhoneNumber] = useState('');
	const [addAddress, setAddAddress] = useState('');
	const [addEmail, setAddEmail] = useState('');

	const [editCardId, setEditCardId] = useState(null);
	const [editStatusId, setEditStatusId] = useState('');

	const [deleteCardId, setDeleteCardId] = useState(null);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSuccess, setSnackbarSuccess] = useState(false);

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

	const showSnackbar = (message, success = true) => {
		setSnackbarMessage(message);
		setSnackbarSuccess(success);
		setOpenSnackbar(true);
	};

	const fetchCards = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/cards', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setCards(response.data);
		} catch (error) {
			console.error('Ошибка при получении билетов:', error);
		}
	};

	const fetchStatuses = async () => {
		try {
			const response = await axios.get('http://localhost:5000/auth/statuses', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setStatuses(response.data);
		} catch (error) {
			console.error('Ошибка при получении статусов:', error);
		}
	};

	useEffect(() => {
		fetchCards();
		fetchStatuses();
	}, []);

	const handleOpenAdd = () => {
		setAddFirstName('');
		setAddLastName('');
		setAddPatronymicName('');
		setAddPhoneNumber('');
		setAddAddress('');
		setAddEmail('');
		setOpenAdd(true);
	};

	const handleCloseAdd = () => {
		setOpenAdd(false);
	};

	const addCard = async () => {
		if (!addFirstName.trim() || !addLastName.trim()) {
			showSnackbar("Заполните хотя бы имя и фамилию читателя!", false);
			return;
		}
		try {
			await axios.post('http://localhost:5000/auth/cards', {
				first_name: addFirstName,
				last_name: addLastName,
				patronymic_name: addPatronymicName,
				phone_number: addPhoneNumber,
				address: addAddress,
				email: addEmail,
				status_id: 5
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchCards();
			handleCloseAdd();
			showSnackbar("Читательский билет успешно добавлен", true);
		} catch (error) {
			console.error("Ошибка при добавлении билета:", error);
			showSnackbar("Ошибка при добавлении билета", false);
		}
	};

	const handleOpenEdit = (card) => {
		setEditCardId(card.card_id);
		setEditStatusId(card.status_id || (statuses.length > 0 ? statuses[0].status_id : ''));
		setOpenEdit(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	const editCard = async () => {
		try {
			await axios.put(`http://localhost:5000/auth/cards/${editCardId}`, {
				status_id: editStatusId
			}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchCards();
			handleCloseEdit();
			showSnackbar("Статус читательского билета успешно обновлён", true);
		} catch (error) {
			console.error("Ошибка при обновлении статуса билета:", error);
			showSnackbar("Ошибка при обновлении статуса билета", false);
		}
	};

	const handleOpenDelete = (cardId) => {
		setDeleteCardId(cardId);
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const deleteCard = async () => {
		try {
			await axios.delete(`http://localhost:5000/auth/cards/${deleteCardId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			fetchCards();
			handleCloseDelete();
			showSnackbar("Читательский билет успешно удален", true);
		} catch (error) {
			console.error("Ошибка при удалении билета:", error);
			showSnackbar("Ошибка при удалении билета", false);
		}
	};

	return (
		<>
			<Header />
			<p className='header-p header-p2'>Читательские билеты</p>
			<div className="reg-for-btns reg-for-btns-edit">
				<button className="btn-signin" onClick={handleOpenAdd}>Добавить читательский билет</button>
			</div>
			<div className="table-type">
				<p className='table-type-p table-type-p-dop2'>Номер читательского билета</p>
				<p className='table-type-p table-type-p-dop2'>Дата выдачи</p>
				<p className='table-type-p table-type-p-dop2'>Статус читательского билета</p>
			</div>
			<div className="table2">
				{cards.map((card) => (
					<div className="row-in-table" key={card.card_id}>
						<div className="row-in-table-inner row-in-table-inner4">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2">
								<span className="table-type-p2 table-type-p3 table-type-p5">{card.card_id}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{card.issue_date}</span>
								<span className="table-type-p2 table-type-p3 table-type-p5">{card.status_name}</span>
							</div>
						</div>
						<button className="btn-signin" onClick={() => navigate(`/catalog/library-cards/${card.card_id}`)}>Подробнее</button>
						<button className="btn-edit" onClick={() => handleOpenEdit(card)}>Изменить статус</button>
						<button className="btn-edit" onClick={() => handleOpenDelete(card.card_id)}>Удалить</button>
					</div>
				))}
			</div>

			<Modal
				open={openAdd}
				onClose={handleCloseAdd}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseAdd} />
						<div className="download-modal-h2">
							<h2>Добавить читательский билет</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Фамилия</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите фамилию' 
										value={addLastName}
										onChange={e => setAddLastName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Имя</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите имя' 
										value={addFirstName}
										onChange={e => setAddFirstName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Отчество</label>
									<input 
										type="text" 
										className="inps"
										placeholder='Введите отчество'
										value={addPatronymicName}
										onChange={e => setAddPatronymicName(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Номер телефона</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите номер телефона' 
										value={addPhoneNumber}
										onChange={e => setAddPhoneNumber(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Адрес</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите адрес' 
										value={addAddress}
										onChange={e => setAddAddress(e.target.value)}
									/>
								</div>
								<div className='reg-for-inps-dop'>
									<label>Email</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите email'
										value={addEmail}
										onChange={e => setAddEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseAdd}>Отмена</button>
								<button className="btn-signin" onClick={addCard}>Добавить</button>
							</div>
						</div>
					</div>
				</Box>
			</Modal>

			<Modal
				open={openEdit}
				onClose={handleCloseEdit}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="download-modal">
						<CloseRoundedIcon className='modal-cls-btn' onClick={handleCloseEdit} />
						<div className="download-modal-h2">
							<h2>Изменить статус билета</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label>Статус</label>
									<select className="inps" value={editStatusId} onChange={e => setEditStatusId(e.target.value)}>
										{statuses.map((status) => (
											<option key={status.status_id} value={status.status_id}>
												{status.status_name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleCloseEdit}>Отмена</button>
								<button className="btn-signin" onClick={editCard}>Сохранить</button>
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
								удалить читательский билет?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleCloseDelete}>Нет</button>
								<button className="btn-signin" onClick={deleteCard}>Да</button>
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
	)
}
