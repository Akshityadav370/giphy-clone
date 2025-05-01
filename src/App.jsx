import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import ErrorLayout from './layout/ErrorLayout';
import Home from './pages/Home';
import ErrorPlaceholder from './components/ErrorPlaceholder';
import Category from './pages/Category';
import Search from './pages/Search';
import SingleGif from './pages/SingleGif';
import Favorites from './pages/Favorites';

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      errorElement: <ErrorLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
          errorElement: <ErrorPlaceholder screenName={'HOME'} />,
        },
        {
          path: '/:category',
          element: <Category />,
          errorElement: <ErrorPlaceholder screenName={'CATEGORY'} />,
        },
        {
          path: '/search/:query',
          element: <Search />,
          errorElement: <ErrorPlaceholder screenName={'SEARCH'} />,
        },
        {
          path: '/:type/:slug',
          element: <SingleGif />,
          errorElement: <ErrorPlaceholder screenName={'SIngleGif'} />,
        },
        {
          path: '/favorites',
          element: <Favorites />,
          errorElement: <ErrorPlaceholder screenName={'favorites'} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
