import './App.css';
import PostPageHome from './views/PostPageHome';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUpPage from './views/SignUpPage';
import LoginPage from './views/LoginPage';

function App() {

  const router = createBrowserRouter([
    {path: "/", element : <PostPageHome />},
    {path: "/login", element : <LoginPage />},
    {path: "/signup", element: <SignUpPage />}
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
