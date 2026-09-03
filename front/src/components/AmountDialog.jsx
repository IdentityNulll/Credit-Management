import { useState } from "react";
import Modal from "./Modal.jsx";
import QuickSums from "./QuickSums.jsx";
import { formatSom, parseSom } from "../lib/format.js";

// mode: "inc" adds to the debt, "dec" subtracts (a payment).
export default function AmountDialog({ t, credit, mode, onConfirm, onClose }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const value = parseSom(amount);
  const nextPrice = mode === "inc" ? credit.price + value : credit.price - value;
  const invalid = value <= 0 || nextPrice < 0;

  const handleConfirm = async () => {
    if (invalid) return;
    setSaving(true);
    setError("");
    try {
      await onConfirm(mode === "inc" ? value : -value);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={mode === "inc" ? t.increase : t.decrease} onClose={onClose}>
      <div className="form">
        <p className="dialog-name">{credit.name}</p>

        <div className="amount-preview">
          <div>
            <small>{t.current}</small>
            <strong>{formatSom(credit.price)}</strong>
          </div>
          <span className={`op ${mode}`}>{mode === "inc" ? "+" : "−"}</span>
          <div>
            <small>{t.amount}</small>
            <strong>{formatSom(amount) || "0"}</strong>
          </div>
          <span className="op">=</span>
          <div>
            <small>{t.willBe}</small>
            <strong className={nextPrice < 0 ? "negative" : "result"}>
              {formatSom(Math.max(nextPrice, 0))}
            </strong>
          </div>
        </div>

        <label className="field">
          <span>{t.amount}</span>
          <div className="sum-input">
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(formatSom(e.target.value))}
              placeholder="0"
              autoFocus
            />
            <span className="suffix">{t.sum}</span>
          </div>
        </label>

        <QuickSums
          onAdd={(a) => setAmount(formatSom(parseSom(amount) + a))}
          onClear={() => setAmount("")}
        />

        {nextPrice < 0 && <p className="error">Summa manfiy bo'lishi mumkin emas</p>}
        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button
            className={`btn ${mode === "inc" ? "btn-primary" : "btn-success"}`}
            onClick={handleConfirm}
            disabled={invalid || saving}
          >
            {saving ? "..." : t.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
}
