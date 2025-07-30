import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    date: "",
    price: "",
    phone: "+998",
  });

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const confirmModalRef = useRef();
  const [incrementData, setIncrementData] = useState(null); // Holds the current credit object
  const [changeAmount, setChangeAmount] = useState(""); // Holds user entered value
  const [lang, setLang] = useState("uz");

  const translations = {
    uz: {
      title: "Nasiya",
      searchPlaceholder: "Ism bilan qidirish...",
      namePlaceholder: "Ism",
      datePlaceholder: "Sana",
      pricePlaceholder: "Nasiya Narxi",
      phoneTitle:
        "Tel raqam +998 bilan boshlanishi va 9 raqamdan iborat bo'lishi kerak",
      submitAdd: "Qo'shish",
      submitUpdate: "Yangilash",
      edit: "Tahrirlash",
      delete: "O'chirish",
      deleteConfirm: "Siz buni o'chirib tashlashni hohlaysizmi?",
      yesDelete: "Ha O'chirib tashlash",
      noCancel: "Yo'q, Bekor qilish",
      increment: "Narxni oshirish",
      decrement: "Narxni kamaytirish",
      amount: "Miqdor",
      confirm: "Tasdiqlash",
      cancel: "Bekor qilish",
      addButton: "Qo'shish",
      incrementPrice: "Narxni oshirish",
      decrementPrice: "Narxni kamaytirish",
      lang: "UZ",
      money: "💸 Summa: ",
      date: "⏳ Sana: ",
      phone: "📞 Telefon: ",
      sum: "so'm"
    },
    kr: {
      title: "Насия",
      searchPlaceholder: "Исм билан қидириш...",
      namePlaceholder: "Исм",
      datePlaceholder: "Сана",
      pricePlaceholder: "Насия нархи",
      phoneTitle:
        "Тел рақам +998 билан бошланиши ва 9 рақамдан иборат бўлиши керак",
      submitAdd: "Қўшиш",
      submitUpdate: "Янгилаш",
      edit: "Таҳрирлаш",
      delete: "Ўчириш",
      deleteConfirm: "Сиз буни ўчириб ташлашни хоҳлайсизми?",
      yesDelete: "Ҳа, ўчириб ташлаш",
      noCancel: "Йўқ, бекор қилиш",
      increment: "Нархни ошириш",
      decrement: "Нархни камайтириш",
      amount: "Миқдор",
      confirm: "Тасдиқлаш",
      cancel: "Бекор қилиш",
      addButton: "Қўшиш",
      incrementPrice: "Нархни ошириш",
      decrementPrice: "Нархни камайтириш",
      lang: "УЗ",
      money: "💸 Сумма: ",
      date: "⏳ Сана: ",
      phone: "📞 Телефон: ",
      sum: "сўм"
    },
  };

  const modalRef = useRef();

  useEffect(() => {
    fetchCredits();

    const handleClickOutside = (e) => {
      if (
        showForm &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        resetForm();
      }

      if (
        deleteConfirmId !== null &&
        confirmModalRef.current &&
        !confirmModalRef.current.contains(e.target)
      ) {
        cancelDelete();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm, deleteConfirmId]);

  const fetchCredits = () => {
    axios
      .get("http://localhost:3000/credits")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching credits:", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`http://localhost:3000/credits/${editingId}`, form)
      : axios.post("http://localhost:3000/credits", form);

    request.then(() => {
      fetchCredits();
      resetForm();
    });
  };

  const resetForm = () => {
    setForm({ name: "", date: "", price: "", phone: "+998" });
    setShowForm(false);
    setEditingId(null);
  };

  const confirmDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirmId) {
      axios
        .delete(`http://localhost:3000/credits/${deleteConfirmId}`)
        .then(() => {
          fetchCredits();
          setDeleteConfirmId(null);
        });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleEdit = (credit) => {
    setForm({
      name: credit.name,
      date: credit.date,
      price: credit.price,
      phone: credit.phone || "+998", // default fallback just in case
    });
    setEditingId(credit.id);
    setShowForm(true);
  };

  const filteredData = data
    .filter((credit) => {
      const term = searchTerm.toLowerCase();
      return (
        credit.name.toLowerCase().includes(term) ||
        credit.phone.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handlePriceUpdate = (type) => {
    if (!changeAmount || isNaN(changeAmount) || !incrementData) return;

    const newPrice =
      type === "inc"
        ? Number(incrementData.price) + Number(changeAmount)
        : Number(incrementData.price) - Number(changeAmount);

    axios
      .put(`http://localhost:3000/credits/${incrementData.id}`, {
        ...incrementData,
        price: newPrice.toString(),
      })
      .then(() => {
        fetchCredits();
        setIncrementData(null);
        setChangeAmount("");
      });
  };

  const handleFixedPriceChange = (credit, type) => {
    const amount = 1000; // fixed increment/decrement value
    const newPrice =
      type === "inc"
        ? Number(credit.price) + amount
        : Number(credit.price) - amount;

    axios
      .put(`http://localhost:3000/credits/${credit.id}`, {
        ...credit,
        price: newPrice.toString(),
      })
      .then(() => fetchCredits());
  };
  const toggleLang = () => {
    setLang((prev) => (prev === "uz" ? "kr" : "uz"));
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="language-switcher">
          <div
            className="lang-toggle"
            onClick={() => setLang((prev) => (prev === "uz" ? "kr" : "uz"))}
          >
            <div className={`slider ${lang === "kr" ? "right" : ""}`}></div>
            <span className={`lang-label ${lang === "kr" ? "left" : "right"}`}>
              {translations[lang].lang}
            </span>
          </div>
        </div>

        <button className="add-button" onClick={() => setShowForm(true)}>
          {translations[lang].addButton || "Qo'shish"}
        </button>
      </header>

      <input
        className="search-bar"
        type="text"
        placeholder={translations[lang].searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="nothing"></div>

            <button className="close-button" onClick={resetForm}>
              <FontAwesomeIcon icon={faX} />
            </button>
            <form className="credit-form" onSubmit={handleSubmit}>
              <input
                className="input"
                type="text"
                name="name"
                placeholder={translations[lang].namePlaceholder}
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                className="input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <input
                className="input"
                type="number"
                name="price"
                placeholder={translations[lang].pricePlaceholder}
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                className="input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                pattern="\+998\d{9}"
                maxLength="13"
                title={translations[lang].phoneTitle}
                required
              />

              <button className="submit-button" type="submit">
                {editingId
                  ? translations[lang].submitUpdate
                  : translations[lang].submitAdd}
              </button>
            </form>
          </div>
        </div>
      )}

      <ul className="credit-list">
        {filteredData.map((credit) => (
          <li className="credit-item" key={credit.id}>
            <div className="credit-details">
              <strong style={{ fontSize: 22, fontWeight: 700 }}>
                {credit.name}
              </strong>
              <span>
                <span>{translations[lang].money} </span>
                {Number(credit.price)
                  .toLocaleString("uz-UZ")
                  .replace(/,/g, ".")}{" "}
                {translations[lang].sum}
              </span>

              <span>
                {translations[lang].phone}
                <a
                  href={`tel:${credit.phone}`}
                  style={{ color: "#2196f3", textDecoration: "underline" }}
                >
                  {credit.phone}
                </a>
              </span>
              <span>
                <span>{translations[lang].date} </span>
                {credit.date}{" "}
              </span>
            </div>
            <div className="credit-actions">
              <button
                className="edit-button"
                onClick={() => handleEdit(credit)}
              >
                {translations[lang].edit}
              </button>
              <button
                className="delete-button"
                onClick={() => confirmDelete(credit.id)}
              >
                {translations[lang].delete}
              </button>
              <button
                className="edit-button"
                onClick={() => {
                  setIncrementData({ ...credit, type: "inc" });
                }}
              >
                +
              </button>
              <button
                className="edit-button"
                onClick={() => {
                  setIncrementData({ ...credit, type: "dec" });
                }}
              >
                -
              </button>
            </div>
          </li>
        ))}
      </ul>
      {deleteConfirmId !== null && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal" ref={confirmModalRef}>
            <p>{translations[lang].deleteConfirm}</p>
            <div className="confirm-buttons">
              <button
                className="confirm-button delete"
                onClick={handleDeleteConfirmed}
              >
                {translations[lang].yesDelete}
              </button>
              <button className="confirm-button cancel" onClick={cancelDelete}>
                {translations[lang].noCancel}
              </button>
            </div>
          </div>
        </div>
      )}
      {incrementData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ minWidth: "300px" }}>
            <h3 style={{ marginBottom: "1rem" }}>
              {incrementData.type === "inc"
                ? translations[lang].incrementPrice
                : translations[lang].decrementPrice}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input
                type="text"
                value={incrementData.price}
                readOnly
                className="input"
                style={{ backgroundColor: "#eee", width: "80px" }}
              />
              <span style={{ fontSize: "1.5rem" }}>
                {incrementData.type === "inc" ? "+" : "-"}
              </span>
              <input
                type="number"
                className="input"
                placeholder="Miqdor"
                value={changeAmount}
                onChange={(e) => setChangeAmount(e.target.value)}
                style={{ width: "100px" }}
              />
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <button
                className="submit-button"
                onClick={() => handlePriceUpdate(incrementData.type)}
              >
                {translations[lang].confirm}
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  setIncrementData(null);
                  setChangeAmount("");
                }}
              >
                {translations[lang].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
