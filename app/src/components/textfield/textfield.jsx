// textfield.jsx
import styles from './textfield.module.css';

const TextField = ({ content, id }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dragHandle} data-drag-handle>
        ⠿
      </div>
      <textarea
        className={styles.wrapper}
        defaultValue={content}
        id={id}
      />
    </div>
  );
};

export default TextField;
