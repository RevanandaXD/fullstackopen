import { useEffect } from "react";

const Notification = ({ errorMessage, clearMessage }) => {
  useEffect(() => {
    if (errorMessage.message) {
      const timer = setTimeout(clearMessage, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, clearMessage]);

  if (!errorMessage.message) return null

  return(
    <div className="border" style={{ border: `2px solid ${errorMessage.color}` }}>
      <p className="message" style={{ color: errorMessage.color }}>
        {errorMessage.message}
      </p>
    </div>
  )
}

export default Notification