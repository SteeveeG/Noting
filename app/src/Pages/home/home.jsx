import { useState, createContext } from 'react';
import css from './home.module.css';
import Canvas from '../../components/Canvas/Canvas.jsx';
import { TEXT_DEFAULTS } from '../../constants/canvasConstants';

export const TextContext = createContext(
  {
    texts: [],
    setTexts: () => {},
  }
);

function Home() {
  const [texts, setTexts] = useState([
    { 
      id: 1,
      content: "Hallo!", 
      x: TEXT_DEFAULTS.X, 
      y: TEXT_DEFAULTS.Y, 
      width: TEXT_DEFAULTS.WIDTH, 
      height: TEXT_DEFAULTS.HEIGHT 
    },
    { 
      id: 2,
      content: "Drag mich!", 
      x: 300, 
      y: 250, 
      width: TEXT_DEFAULTS.WIDTH, 
      height: TEXT_DEFAULTS.HEIGHT 
    },
  ]);

  const addText = () => {
    const newId = Math.max(...texts.map(t => t.id), 0) + 1;
    const newText = {
      id: newId,
      content: TEXT_DEFAULTS.CONTENT, 
      x: TEXT_DEFAULTS.X, 
      y: TEXT_DEFAULTS.Y, 
      width: TEXT_DEFAULTS.WIDTH, 
      height: TEXT_DEFAULTS.HEIGHT
    };
    setTexts([...texts, newText]);
  };

  const removeLastText = () => {
    if (texts.length > 0) {
      setTexts(texts.slice(0, -1));
    }
  };

  return (
    <>
      <h1>Text Canvas Editor</h1>
      <TextContext.Provider value={{ texts, setTexts }}>
        <div className={css.wrapp}>
          <button onClick={addText}>Add Text</button>
          <button onClick={removeLastText} disabled={texts.length === 0}>
            Remove Last Text
          </button>
        </div>
        <Canvas />
      </TextContext.Provider>
    </>
  );
}

export default Home;
