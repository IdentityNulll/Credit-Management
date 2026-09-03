import { formatSom, friendlyDate, formatPhone, smsLink, debtAge } from "../lib/format.js";

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export default function CreditCard({ t, credit, onEdit, onDelete, onAdjust }) {
  const age = debtAge(credit.date);
  const tone = age > 60 ? "old" : age > 30 ? "warn" : "fresh";

  return (
    <li className={`card tone-${tone}`}>
      <div className="card-main">
        <div className="card-top">
          <h3>{credit.name}</h3>
          <div className="amount">
            {formatSom(credit.price)} <span>{t.sum}</span>
          </div>
        </div>

        <div className="card-meta">
          <a className="phone" href={smsLink(credit, t)} title={t.smsRemind}>
            <Icon path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            {formatPhone(credit.phone)}
          </a>
          <span className="date">
            <Icon path="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            {friendlyDate(credit.date, t)}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn btn-sm btn-success" onClick={() => onAdjust(credit, "dec")} title={t.decrease}>
          −
        </button>
        <button className="btn btn-sm btn-primary" onClick={() => onAdjust(credit, "inc")} title={t.increase}>
          +
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => onEdit(credit)}>
          {t.edit}
        </button>
        <button className="btn btn-sm btn-danger-ghost" onClick={() => onDelete(credit)}>
          {t.delete}
        </button>
      </div>
    </li>
  );
}
