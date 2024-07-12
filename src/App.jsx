import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import UploadForm from "./components/UploaderForm";
import Infographics from "./components/Infographics";
const App = () => {

  return (
    <>
      <ToastContainer />
      <UploadForm/>
      <Infographics/>
    </>
  )
}

export default App
