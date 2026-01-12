import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import BlogView from './pages/BlogView';
import './App.css';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogView />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blogs/new" element={<BlogForm />} />
          <Route path="/blogs/edit/:id" element={<BlogForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;