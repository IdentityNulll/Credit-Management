import { useEffect, useRef } from "react";

// Shared shell for every dialog: click-outside, Escape, and scroll lock.
export default function Modal({ title, onClose, children, width = 420 }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // Only close when the press *starts* on the overlay — otherwise dragging a
  // text selection out of an input closes the dialog and loses the form.
  const handleMouseDown = (e) => {
    if (!boxRef.current?.contains(e.target)) onClose();
  };

  return (
    <div className="overlay" onMouseDown={handleMouseDown}>
      <div className="modal" ref={boxRef} style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
