import './quote.scss';
import { useEffect, useState } from 'react';

type T_Quote = {
  _id: string;
  content: string;
  dateAdded: string;
};

export default function Quote() {
  const [quote, setQuote] = useState<T_Quote>({
    _id: 'some-id',
    content: 'Some quote here...',
    dateAdded: '2024-06-05'
  });

  const id = `${quote.dateAdded.split('-')[0]} #${quote._id.slice(0, 3)}`;

  async function getquote() {
    try {
      const response = await fetch('https://api.quotable.io/random');

      if (!response.ok) throw new Error();
      const quote: T_Quote = await response.json();

      setQuote(quote);
    } catch (error) {
      setQuote({
        _id: 'ERROR',
        content:
          'We are facing issues while getting a quote, you can try again later!',
        dateAdded: new Date().toISOString().split('T')[0]
      });
    }
  }

  useEffect(function () {
    getquote().then(null);
  }, []);

  return (
    <div id="quote-root">
      <div className="card">
        <p className="quote-id">Quote {id}</p>
        <blockquote className="quote">{quote.content}</blockquote>
        <img
          className="divider"
          src="/img/pattern-divider-mobile.svg"
          alt="Divider Icon"
        />
        <img
          className="divider desk"
          src="/img/pattern-divider-desktop.svg"
          alt="Divider Icon"
        />
        <div className="card-img" onClick={getquote}>
          <img className="dice-icon" src="/img/icon-dice.svg" alt="Dice Icon" />
        </div>
      </div>
    </div>
  );
}
