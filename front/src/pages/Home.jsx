import { useCallback, useEffect, useState } from "react";
import * as api from "../api/client.js";
import { translations } from "../i18n.js";
import { formatSom } from "../lib/format.js";
import CreditCard from "../components/CreditCard.jsx";
import CreditForm from "../components/CreditForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import AmountDialog from "../components/AmountDialog.jsx";

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem("nasiya-lang") || "uz");
  const t = translations[lang];

  const [credits, setCredits] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  // One dialog at a time: { type: "form"|"delete"|"amount", credit, mode }
  const [dialog, setDialog] = useState(null);

  useEffect(() => localStorage.setItem("nasiya-lang", lang), [lang]);

  const load = useCallback(async (term = "") => {
    try {
      const data = await api.getCredits(term);
      setCredits(data.credits);
      setTotal(data.total);
      setStatus("ready");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => load(search), 300);
    return () => clearTimeout(id);
  }, [search, load]);

  const closeDialog = () => setDialog(null);

  const handleSave = async (values) => {
    if (dialog.credit) await api.updateCredit(dialog.credit.id, values);
    else await api.createCredit(values);
    closeDialog();
    await load(search);
  };

  const handleDelete = async () => {
    await api.deleteCredit(dialog.credit.id);
    closeDialog();
    await load(search);
  };

  const handleAdjust = async (delta) => {
    await api.adjustAmount(dialog.credit.id, delta);
    closeDialog();
    await load(search);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <button
          className="lang-toggle"
          onClick={() => setLang((l) => (l === "uz" ? "kr" : "uz"))}
          title="Lotin / Кирилл"
        >
          {t.code}
        </button>
      </header>

      <section className="stats">
        <div className="stat">
          <small>{t.totalDebt}</small>
          <strong>
            {formatSom(total)} <span>{t.sum}</span>
          </strong>
        </div>
        <div className="stat">
          <small>{t.debtors}</small>
          <strong>{credits.length}</strong>
        </div>
      </section>

      <div className="toolbar">
        <div className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setDialog({ type: "form", credit: null })}>
          + {t.add}
        </button>
      </div>

      {status === "loading" && <p className="state">{t.loading}</p>}

      {status === "error" && (
        <div className="state state-error">
          <p>{errorMsg}</p>
          <button className="btn btn-primary" onClick={() => load(search)}>
            {t.retry}
          </button>
        </div>
      )}

      {status === "ready" && credits.length === 0 && (
        <div className="state">
          <h3>{search ? t.notFound : t.empty}</h3>
          <p>{search ? t.notFoundHint : t.emptyHint}</p>
        </div>
      )}

      {status === "ready" && credits.length > 0 && (
        <ul className="card-list">
          {credits.map((credit) => (
            <CreditCard
              key={credit.id}
              t={t}
              credit={credit}
              onEdit={(c) => setDialog({ type: "form", credit: c })}
              onDelete={(c) => setDialog({ type: "delete", credit: c })}
              onAdjust={(c, mode) => setDialog({ type: "amount", credit: c, mode })}
            />
          ))}
        </ul>
      )}

      {dialog?.type === "form" && (
        <CreditForm t={t} credit={dialog.credit} onSubmit={handleSave} onClose={closeDialog} />
      )}
      {dialog?.type === "delete" && (
        <ConfirmDialog t={t} credit={dialog.credit} onConfirm={handleDelete} onClose={closeDialog} />
      )}
      {dialog?.type === "amount" && (
        <AmountDialog
          t={t}
          credit={dialog.credit}
          mode={dialog.mode}
          onConfirm={handleAdjust}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
