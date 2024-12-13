import Header from './Header'
import React, { useCallback, useEffect, useState} from 'react'
import axios from 'axios';
import { useLocation, Link, Navigate, Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function Directories() {
	const location = useLocation();
	return (
		<>
			<Header />
			<div className="directories-header">
				<p className='header-p header-p2'>Справочники</p>
				<div className="reg-for-btns">
					<Link className='catalog-nav-left-link' to="/catalog/directories/genres">
						<p className={`${location.pathname === '/catalog/directories/genres' ? 'active' : ''}`}>Жанры</p>
					</Link>
					<Link className='catalog-nav-left-link' to="/catalog/directories/authors">
						<p className={`${location.pathname === '/catalog/directories/authors' ? 'active' : ''}`}>Авторы</p>
					</Link>
					<Link className='catalog-nav-left-link' to="/catalog/directories/statuses">
						<p className={`${location.pathname === '/catalog/directories/statuses' ? 'active' : ''}`}>Статусы</p>
					</Link>
				</div>
			</div>
			{location.pathname === '/catalog/directories' && <Navigate to="/catalog/directories/genres" replace />}
			<Outlet />
		</>
	)
}
