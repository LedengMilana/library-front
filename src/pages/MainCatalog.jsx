import React, { useCallback, useEffect, useState} from 'react'
import axios from 'axios';
import { useLocation, Link, Navigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from 'react-redux';
import logo from "../assets/logo.svg"
import img1 from "../assets/nav-img1.png"
import img2 from "../assets/nav-img2.png"
import img3 from "../assets/nav-img3.png"
import img4 from "../assets/nav-img4.png"
import { } from '../components/modalSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
	borderRadius: "15px",
	outline: "none"
};

export default function MainCatalog() {
	const [data, setData] = useState(null);
  const [error, setError] = useState(null);
	const [modelName, setModelName] = useState("");
	const [modelSize, setModelSize] = useState("");
	const [modelMaterial, setModelMaterial] = useState("");
	const [modelTime, setModelTime] = useState("");
	const [modelPlusOneOfModel, setModelPlusOneOfModel] = useState("");
	const [modelWeight, setModelWeight] = useState("");
	const [modelPrice, setModelPrice] = useState("");
	const [modelPlusBigOneOfModel, setModelPlusBigOneOfModel] = useState("");
	const location = useLocation();
	const dispatch = useDispatch();
	const models = useSelector((state) => state.modal.models);

	const handleModelNameChange = (e) => {
		setModelName(e.target.value);
	};

	const handleModelSizeChange = (e) => {
		setModelSize(e.target.value);
	};

	const handleModelMaterialChange = (e) => {
		setModelMaterial(e.target.value);
	};

	const handleModelTimeChange = (e) => {
		setModelTime(e.target.value);
	};

	const handleModelPlusOneOfModelChange = (e) => {
		setModelPlusOneOfModel(e.target.value);
	};

	const handleModelWeightChange = (e) => {
		setModelWeight(e.target.value);
	};

	const handleModelPriceChange = (e) => {
		setModelPrice(e.target.value);
	};

	const handleModelPlusBigOneOfModelChange = (e) => {
		setModelPlusBigOneOfModel(e.target.value);
	};

	// модалка
	const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

	// загрузка файлов
	const [file, setFile] = useState(null);
  const [highlight, setHighlight] = useState(false);
	const [files, setFiles] = useState([]);
  const [highlight2, setHighlight2] = useState(false);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setHighlight(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setHighlight(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setHighlight(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onClick = useCallback(() => {
    document.getElementById('fileInput').click();
  }, []);

	const onDragOver2 = useCallback((e) => {
    e.preventDefault();
    setHighlight2(true);
  }, []);

  const onDragLeave2 = useCallback((e) => {
    e.preventDefault();
    setHighlight2(false);
  }, []);

  const onDrop2 = useCallback((e) => {
    e.preventDefault();
    setHighlight2(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFiles(Array.from(droppedFiles))
    }
  }, []);

  const onFileChange2 = (e) => {
    setFiles(Array.from(e.target.files))
  };

  const onClick2 = useCallback(() => {
    document.getElementById('fileInput2').click();
  }, []);


	// проверка авторизации
  useEffect(() => {
    axios.get('http://localhost:5000/auth/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setData(response.data);
      setError(null);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 403) {
        setError('У вас нет доступа к этим данным.');
      } else {
        setError('Произошла ошибка при загрузке данных.');
      }
    });

    return () => {
      console.log('Cleanup can be performed here');
    };
  }, []);

  // if (error) {
  //   return <div>{error}</div>;
  // }

  // if (!data) {
  //   return <div>Loading...</div>;
  // }

  return (
		<>
				{/* <div>
					<h1>Loaded</h1>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div> */}
				<div className='catalog-wrap-nav'>
            <div className='catalog-nav-left'>
								<img className='catalog-nav-left-logo' src={logo} alt="no img" />
                <ul className='catalog-nav-left-ul'>
                    <Link className='catalog-nav-left-link' to="/catalog/books"><li className={`catalog-nav-left-li ${location.pathname === '/catalog/books' ? 'active' : ''}`}>
											<div className="catalog-nav-left-li-div">
												<img src={img1} alt="no img" />
												<p>Книги</p>
											</div>
										</li></Link>
                    <Link className='catalog-nav-left-link' to="/catalog/library-cards"><li className={`catalog-nav-left-li ${location.pathname === '/catalog/library-cards' ? 'active' : ''}`}>
											<div className="catalog-nav-left-li-div">
												<img src={img2} alt="no img" />
												<p>Чит. билеты</p>
											</div>
										</li></Link>
										{data && 
                    <Link className='catalog-nav-left-link' to="/catalog/directories"><li className={`catalog-nav-left-li ${location.pathname.includes('/catalog/directories') ? 'active' : ''}`}>
											<div className="catalog-nav-left-li-div">
												<img src={img3} alt="no img" />
												<p>Справочники</p>
											</div>
										</li></Link>
										}
										{data && 
                    <Link className='catalog-nav-left-link' to="/catalog/manage-records"><li className={`catalog-nav-left-li ${location.pathname === '/catalog/manage-records' ? 'active' : ''}`}>
											<div className="catalog-nav-left-li-div">
												<img src={img4} alt="no img" />
												<p>Управление учетн. записями</p>
											</div>
										</li></Link>
										}
                </ul>
            </div>
            <div className='catalog-nav-right'>
							{location.pathname === '/catalog' && <Navigate to="/catalog/books" replace />}
							<Outlet />
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
									<div className="download-modal-left">
										<div className="dropzone2" onDragOver={onDragOver2} onDragLeave={onDragLeave2} onDrop={onDrop2} onClick={onClick2}>
											<input
												type="file"
												id="fileInput2"
												multiple
												style={{ display: 'none' }}
												onChange={onFileChange2}
											/>
											{files.length > 0 ? (
												<ul>{files.map((file, index) => <li key={index}>{file.name}</li>)}</ul>
											) : (
												<div className='download-model-fileinp2'><span className='download-model-fileinp2-span'>Добавьте фотографии *</span></div>
											)}
										</div>
									</div>
									<div className="download-modal-right">
										<div className="download-modal-right-dop">
											<label htmlFor="titleOfModel">Название *</label>
											<input type="text" id='titleOfModel' className='modal-inps' value={modelName} onChange={handleModelNameChange} />
											<label htmlFor="sizeOfModel">Размеры</label>
											<input type="text" id='sizeOfModel' className='modal-inps' value={modelSize} onChange={handleModelSizeChange} />
											<div className="download-modal-right-dop-twice">
												<div className="download-modal-right-dop-twice-dop">
													<label htmlFor="materialOfModel">Материал</label>
													<input type="text" id='materialOfModel' className='modal-inps' value={modelMaterial} onChange={handleModelMaterialChange} />
													<label htmlFor="timeOfModel">Время печати</label>
													<input type="text" id='timeOfModel' className='modal-inps' value={modelTime} onChange={handleModelTimeChange} />
													<label htmlFor="modelPlusOneOfModel">Модель + печать 1 шт.</label>
													<input type="text" id='modelPlusOneOfModel' className='modal-inps' value={modelPlusOneOfModel} onChange={handleModelPlusOneOfModelChange} />
												</div>
												<div className="download-modal-right-dop-twice-dop">
													<label htmlFor="weightOfModel">Вес</label>
													<input type="text" id='weightOfModel' className='modal-inps' value={modelWeight} onChange={handleModelWeightChange} />
													<label htmlFor="priceOfModel">Стоимость модели *</label>
													<input type="text" id='priceOfModel' className='modal-inps' value={modelPrice} onChange={handleModelPriceChange} />
													<label htmlFor="modelPlusBigOneOfModel">Модель + печать больше 1 шт.</label>
													<input type="text" id='modelPlusBigOneOfModel' className='modal-inps' value={modelPlusBigOneOfModel} onChange={handleModelPlusBigOneOfModelChange} />
												</div>
											</div>
											<div className="dropzone" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick}>
												<input
													type="file"
													id="fileInput"
													style={{ display: 'none' }}
													onChange={onFileChange}
												/>
												{file ? <p>{file.name}</p> : <div className='download-model-fileinp'><span>Загрузите сюда 3д модель или кликните для выбора *</span></div>}
											</div>
											<div className='dropzone-dop'>
												{/* <button onClick={} disabled={!file || files.length === 0 || modelName == "" || modelPrice == ""} className='download-modal-save'>Сохранить</button> */}
											</div>
										</div>
									</div>
								</div>
							</Box>
						</Modal>
        </div>
		</>
    
  );
}
