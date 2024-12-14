import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from 'react-redux'
import ErrorPage from './pages/error-page';
import store from './app/store';
import Registartion from './pages/Registartion';
import MainCatalog from './pages/MainCatalog';
import Books from './components/Books';
import LibraryCards from './components/LibraryCards';
import Directories from './components/Directories';
import ManageRecords from './components/ManageRecords';
import Genres from './components/Genres';
import Authors from './components/Authors';
import Statuses from './components/Statuses';
import LibraryCardDetails from './components/LibraryCardDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
		errorElement: <ErrorPage />,
  },
	{
    path: "/registration",
    element: <Registartion />,
		errorElement: <ErrorPage />,
  },
	{
    path: "/catalog",
    element: <MainCatalog />,
		children: [
      { path: 'books', element: <Books /> },
      { path: 'library-cards', element: <LibraryCards /> },
			{ path: 'library-cards/:cardId', element: <LibraryCardDetails /> },
      { path: 'directories', element: <Directories />, children: [
				{ path: 'genres', element: <Genres /> },
				{ path: 'authors', element: <Authors /> },
				{ path: 'statuses', element: <Statuses />, },
			] },
      { path: 'manage-records', element: <ManageRecords /> },
    ],
		errorElement: <ErrorPage />,
  },
]);


const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
	<Provider store={store}>
		<RouterProvider router={router}/>
	</Provider>
);