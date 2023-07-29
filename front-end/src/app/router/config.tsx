import HomePage from './pages/home'
import NotFoundPage from './pages/not-found';

const ROUTES: Array<{
    path: string
    title?: string
    element: React.ReactNode
}> = [
    {
        path: '/',
        title: 'Основная страничка',
        element: <HomePage />,
    },
    {
        path: '/files',
        title: 'Файлики',
        element: <HomePage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    }
];

// eslint-disable-next-line react-refresh/only-export-components
export default ROUTES;
