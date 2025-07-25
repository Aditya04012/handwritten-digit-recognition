import './App.css';
import React from 'react';
import { useState,useEffect,useRef } from 'react';




function App() {

 const canvasRef = useRef(null);
const [isDrawing,setDrawaing]=useState(false);
const [prediction,setPrediction]=useState('');
 const [loading, setLoading] = useState(false);

const startDrawing=()=>setDrawaing(true);
const stopDrawing=()=>setDrawaing(false);

 useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

const draw=(e)=>{
  if(!isDrawing)return;

  const canvas=canvasRef.current;
  const ctx=canvas.getContext('2d');
   const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

      ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}



const caller = () => {
 setLoading(true);
    const originalCanvas = canvasRef.current;

    
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = 28;
    scaledCanvas.height = 28;
    const scaledCtx = scaledCanvas.getContext('2d');


    scaledCtx.drawImage(originalCanvas, 0, 0, 28, 28);

 
    const image = scaledCanvas.toDataURL('image/png').split(',')[1];

    
    fetch('https://handwritten-digit-recognition-1-owez.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPrediction('Prediction: ' + data.prediction);
      })
      .catch((err) => {
        setPrediction('Error: ' + err.message);
      }).finally(() => {
      setLoading(false); 
    });
  };

const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
     setPrediction('');
  };

  return (
    <div className="App">
     <h1>Handwritten Digit Recognition</h1>
       <h4>Draw a Digit on board between (0-9)</h4>

     <canvas
  ref={canvasRef}
  height={280}
  width={280}
  onMouseDown={startDrawing}
  onMouseUp={stopDrawing}
  onMouseLeave={stopDrawing}
  onMouseMove={draw}
  onTouchStart={(e) => {
    e.preventDefault(); // prevent scrolling
    startDrawing();
  }}
  onTouchEnd={(e) => {
    e.preventDefault();
    stopDrawing();
  }}
  onTouchCancel={(e) => {
    e.preventDefault();
    stopDrawing();
  }}
  onTouchMove={(e) => {
    e.preventDefault();
    const touch = e.touches[0];
    draw({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  }}
  style={{ border: '1px solid black', backgroundColor: 'white', touchAction: 'none' }}
/>



            <br></br>


            <button onClick={caller} disabled={loading}>
  {loading ? 'Predicting...' : 'Predict'}
</button>
            <button onClick={clearCanvas}>Clear</button>
            <p>{prediction}</p>
    </div>
  );
}

export default App;
