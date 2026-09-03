import { useState } from "react";
import Modal from "./Modal.jsx";
import QuickSums from "./QuickSums.jsx";
import { formatSom, parseSom, todayISO } from "../lib/format.js";

export default function CreditForm({ t, credit, onSubmit, onClose }) {
  const isEdit = Boolean(credit);

  const [form, setForm] = useState({
    name: credit?.name ?? "",
    date: credit?.date ?? todayISO(),
    price: credit ? formatSom(credit.price) : "",
    phone: credit?.phone ?? "+998",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handlePhone = (raw) => {
    // Keep the +998 prefix pinned and allow only 9 digits after it.
    const digits = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
    set("phone", `+998${digits}`);
  };

  const addToPrice = (amount) => set("price", formatSom(parseSom(form.price) + amount));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\+998\d{9}$/.test(form.phone)) return setError(t.phoneHint);
    if (parseSom(form.price) <= 0) return setError(t.price);

    setSaving(true);
    try {
      await onSubmit({ ...form, price: parseSom(form.price) });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal title={isEdit ? t.editTitle : t.addTitle} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{t.name}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={t.name}
            autoFocus
            required
          />
        </label>

        <label className="field">
          <span>{t.date}</span>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
        </label>

        <label className="field">
          <span>{t.price}</span>
          <div className="sum-input">
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set("price", formatSom(e.target.value))}
              placeholder="0"
              required
            />
            <span className="suffix">{t.sum}</span>
          </div>
        </label>

        <QuickSums onAdd={addToPrice} onClear={() => set("price", "")} />

        <label className="field">
          <span>{t.phone}</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handlePhone(e.target.value)}
            placeholder="+998901234567"
            required
          />
          <small className="hint">{t.phoneHint}</small>
        </label>

        {error && <p className="error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "..." : isEdit ? t.update : t.save}
          </button>
        </div>
      </form>
    </Modal>
  );
}
