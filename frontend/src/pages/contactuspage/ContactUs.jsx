import React, { useState } from 'react';
import Header from '../homepage/components/header/Header';
import './ContactUs.css';
import { toast } from '../../modules/ToastStore';
import MoveToTop from '../homepage/components/movetotop/MoveToTop';

export default function ContactUs() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
  if (!username.trim() || !message.trim()) {
    toast.error('Please fill out all fields.');
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Email failed');

    toast.success('Message sent successfully!');
    setUsername('');
    setMessage('');
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Something went wrong.');
  }
};


    document.title = "Contact Us  |  DAOGROW";

  return (
    <div className="contactPage">
      <Header />
      <h1 style={{marginTop: '50px'}}>Contact Us</h1>

      <section className='contact-form'>
        <h3>Send us a message</h3>
        <div className="inputContainer">
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="floatingLabel">Username</label>
        </div>
        <div className="inputContainer">
          <textarea
            name="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className="floatingLabel">Message</label>
        </div>
        <button className="gbtn_0" onClick={handleSubmit}>Send</button>
      </section>

      <section>
        <h3>FAQs</h3>
        {/* You can use accordion or simple toggle UI */}
        <details>
          <summary>How long does shipping take?</summary>
          <p>Typically 2–5 business days depending on your location.</p>
        </details>
        <details>
          <summary>Can I return a product?</summary>
          <p>Yes, within 7 days of delivery if it's in original condition.</p>
        </details>
      </section>

      <section>
        <h3>Any Questions</h3>
        <p>Reach us through: </p>
        <ul>
          <li><strong>Location: </strong> Harambee Unit 3, Shop A2</li>
          <li><strong>Email: </strong> Bbeautyspa@gmail.com</li>
          <li><strong>Contact number: </strong> 0700 000 555 or 0700 020 555</li>
        </ul>
      </section>
      <MoveToTop />
    </div>
  );
}