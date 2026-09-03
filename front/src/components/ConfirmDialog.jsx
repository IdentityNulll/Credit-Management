import { useState } from "react";
import Modal from "./Modal.jsx";

export default function ConfirmDialog({ t, credit, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={t.deleteTitle} onClose={onClose} width={380}>
      <div className="form">
        <p className="confirm-text">
          <strong>{credit.name}</strong>
          {t.deleteConfirm}
        </p>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={busy}>
            {busy ? "..." : t.yesDelete}
          </button>
        </div>
      </div>
    </Modal>
  );
}
