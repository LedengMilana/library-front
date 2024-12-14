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

export default function Statuses() {
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);

	const [statusName, setStatusName] = useState('');
	const [errorForSnack, setErrorForSnack] = useState('');
	const [snackColor, setSnackColor] = useState(false)
	const [vertical, setVertical] = useState('top')
	const [horizontal, setHorizontal] = useState('center')
	const [statuses, setStatuses] = useState([])
	const [statusIdToDelete, setStatusIdToDelete] = useState(null);
	const [statusIdToEdit, setStatusIdToEdit] = useState(null);

	const token = localStorage.getItem('token');

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
		fetchStatuses();
	}, []);

	const handleOpen = () => {
		setStatusName('');
		setStatusIdToEdit(null);
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		if (statusName.trim()) {
			try {
				if (statusIdToEdit) {
					const response = await axios.put(`http://localhost:5000/auth/statuses/${statusIdToEdit}`, {
						status_name: statusName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				} else {
					const response = await axios.post('http://localhost:5000/auth/statuses', {
						status_name: statusName
					}, {
						headers: { Authorization: `Bearer ${token}` }
					});
					setSnackColor(true);
					setErrorForSnack(response.data.message);
				}

				setStatusName("");
				setOpen2(true);
				fetchStatuses();

			} catch (error) {
				console.error(error);
				setSnackColor(false);
				setErrorForSnack(error.response?.data?.message || "Ошибка при сохранении статуса");
				setOpen2(true);
			}
		} else {
			setErrorForSnack("Заполните название статуса!");
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

	const deleteStatusById = async (statusId) => {
		try {
			const response = await axios.delete(`http://localhost:5000/auth/statuses/${statusId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSnackColor(true);
			setErrorForSnack(response.data.message);
			setOpen2(true);
			fetchStatuses();
		} catch (error) {
			console.error(error);
			setSnackColor(false);
			setErrorForSnack(error.response?.data?.message || "Ошибка при удалении статуса");
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
				<button className="btn-signin" onClick={handleOpen}>Добавить статус</button>
			</div>
			<div className="table-type">
				<p className='table-type-p'>Название статуса</p>
			</div>
			<div className="table2">
				{statuses.map((status) => (
					<div className="row-in-table row-in-table2" key={status.status_id}>
						<div className="row-in-table-inner row-in-table-inner3">
							<div className="row-in-table-inner-tr row-in-table-inner-tr2 row-in-table-inner-tr3">
								<span className="table-type-p2 table-type-p3 table-type-p4">{status.status_name}</span>
							</div>
						</div>
						<button className="btn-edit" onClick={() => {
							setStatusName(status.status_name);
							setStatusIdToEdit(status.status_id);
							setOpen(true);
						}}>Редактировать</button>
						<button className="btn-edit" onClick={() => {
							setOpen3(true);
							setStatusIdToDelete(status.status_id);
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
							<h2>{statusIdToEdit ? "Редактировать статус" : "Добавить статус"}</h2>
							<div className="reg-for-inps">
								<div className='reg-for-inps-dop'>
									<label htmlFor="inp1">Название статуса</label>
									<input 
										type="text" 
										className="inps" 
										placeholder='Введите название' 
										id='inp1' 
										value={statusName} 
										onChange={e => setStatusName(e.target.value)} 
									/>
								</div>
							</div>
							<div className="reg-for-btns reg-for-btns2">
								<button className="btn-cancel" onClick={handleClose}>Отмена</button>
								<button className="btn-signin" onClick={handleSubmit}>{statusIdToEdit ? "Сохранить" : "Добавить"}</button>
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
								удалить этот статус?</h2>
							<div className="reg-for-btns reg-for-btns2 reg-for-btns3">
								<button className="btn-cancel" onClick={handleClose3}>Нет</button>
								<button className="btn-signin" onClick={() => {
									deleteStatusById(statusIdToDelete);
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
