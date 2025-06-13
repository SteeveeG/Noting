import css from './textfield.module.css';

const TextField = ({ content, id }) => {
  return (
    <div className={css.container}>
      <div className={css.dragHandle} data-drag-handle>
        ⠿
      </div>
      <textarea
        className={css.wrapper}
        defaultValue={content}
        id={id}
      />
    </div>
  );
};

export default TextField;
