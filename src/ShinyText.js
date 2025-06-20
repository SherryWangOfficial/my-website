import './ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ '--shine-duration': animationDuration }}
      data-text={text}
    >
      {text}
    </div>
  );
};

export default ShinyText;
