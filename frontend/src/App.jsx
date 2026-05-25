import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import CreateProduct from './pages/CreateProduct';

import Navbar from './components/Navbar';

import './styles/global.css';

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/criar-produto"
          element={<CreateProduct />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;