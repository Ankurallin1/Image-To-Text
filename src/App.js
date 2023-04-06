import { useState, useEffect, useRef } from 'react';
import './App.css';
import pic from './pop-up.png'
import Tesseract from 'tesseract.js';
function App() {
  const [selectedImage, setImage] = useState(null);
  const [text, setText] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit. Non molestias dolorum saepe provident explicabo corrupti similique quam, voluptatum vel laboriosam quos quod est placeat perferendis quas deleniti nemo hic consectetur.");
  const [change, setChange] = useState(false);
  const [progress, setProgress] = useState("convert");
  const [inputValue, setInputValue] = useState("convert");
  const [ShowProgress, SetShowProgress] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const textareaRef = useRef(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPopup(false);
    }, 1300);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = e => {
    setImage(e.target.files[0]);
    setChange(!change)
    

  }
  const handleSubmit = () => {
    

    Tesseract.recognize(selectedImage, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          if (inputValue === "convert") {
            if (Math.floor(m.progress * 100) === 100) {
              setInputValue("convert");
              
              SetShowProgress(false);
              const value = textareaRef.current.value;
              const download_name=selectedImage.name.slice(0, -3).concat("txt").replace(/\s+/g, "");
              const blob = new Blob([value], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${selectedImage.name.slice(0, -3).concat("txt").replace(/\s+/g, "")}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              

            }
            else {
              setInputValue(Math.floor(m.progress * 100));
              
              SetShowProgress(!ShowProgress);
              setProgress(Math.floor(m.progress * 100));

            }

          }
        }
      },
    }).catch((err) => {
      console.error(err);
    })
      .then((result) => {
        setText(result.data.text);
      })
    
    
    
    
  }
  return (
    <>
      {showPopup && (
        <div className="image-popup-container">
          <img
            src={pic}
            alt="Popup"
            className="image-popup"
          />
        </div>
      )}
      <div className="App">
        <h1>Image to text</h1>
        <p>Get words out of image</p>
        <div className="input-wrapper">
          <label htmlFor="upload">upload</label>
          <input type="file" name="" id="upload" onChange={handleChange} />
          <input
            type="button"
            onClick={handleSubmit}
            className={ShowProgress ? 'show btn' : 'btn'}
            value={inputValue}
          />
          {ShowProgress && (<>{'\t'}<progress value={progress} max="100">{progress}</progress></>)}
        </div>
        <div className="result">
          {selectedImage &&
            (<div className='box-image'>
              <img src={URL.createObjectURL(selectedImage)} alt="img" />
            </div>)}
          {text && (<textarea className="box-text"
            rows="30"
            value={text}
            ref={textareaRef}>
          </textarea>)}
        </div>
      </div>
    </>
  );

}
export default App;