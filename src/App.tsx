import { Home } from './components/Home'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
     <ToastContainer limit={3} />
     <Home />
    </>
  )
}

export default App
