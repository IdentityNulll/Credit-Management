// "1500000" | 1500000 -> "1 500 000"
export const formatSom = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const digits = String(value).replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// "1 500 000" -> 1500000
export const parseSom = (value) => Number(String(value).replace(/\s/g, "")) || 0;

// Today's date as YYYY-MM-DD in local time (not UTC — avoids off-by-one days).
export const todayISO = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

// "2026-09-01" -> "01.09.2026"
export const formatDate = (iso) => {
  const parts = String(iso).split("-");
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : iso;
};

// Adds "Bugun" / "Kecha" / "N kun oldin" in front of the date when it's recent.
export const friendlyDate = (iso, t) => {
  const pretty = formatDate(iso);
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return pretty;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);

  const days = Math.round((today - target) / 86400000);

  if (days === 0) return `${t.today} (${pretty})`;
  if (days === 1) return `${t.yesterday} (${pretty})`;
  if (days > 1 && days < 30) return `${days} ${t.daysAgo} (${pretty})`;
  return pretty;
};

// +998901234567 -> +998 90 123 45 67
export const formatPhone = (phone) => {
  const m = String(phone).match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : phone;
};

export const smsLink = (credit, t) => {
  const debt = formatSom(credit.price);
  return `sms:${credit.phone}?body=${encodeURIComponent(t.smsTemplate(credit.name, debt))}`;
};

// How much of the debt is "old" — drives the row accent colour.
export const debtAge = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y) return 0;
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today - target) / 86400000);
};
