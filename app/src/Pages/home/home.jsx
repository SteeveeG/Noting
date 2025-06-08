import  { useState, createContext } from 'react';
import css from './home.module.css';
import Canvas from '../../components/Canvas/Canvas.jsx';

export const TextContext = createContext(
  {
    texts: [],
    setTexts: () => {},
  }
);

function home() {
  const [texts, setTexts] = useState([
    { content: "Hallo!", x: 100, y: 150 },
    { content: "Drag mich!", x: 300, y: 250 },
  ]);

  function addText() {
    setTexts([...texts, { content: "Text", x: 100, y: 150 }]);
  }

  function removeLastText() {
    setTexts(texts.slice(0, -1));
  }

  return (
    <>
      <p>home</p>
      <TextContext.Provider value={{ texts, setTexts }}>
        <div className={css.wrapp}>
          <button onClick={addText}>add text</button>
          <button onClick={removeLastText}>Remove Last Text</button>
        </div>
        <Canvas />
      </TextContext.Provider>
    </>
  );
}

export default home;
