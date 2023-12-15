import React, { useEffect, useState } from 'react';

const About = () => {
  const [quote, setQuote] = useState({ content: '', author: '' });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        setQuote({ content: data.content, author: data.author });
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote();
  }, []);

  return (
    <>
      <div id="picture" className="picture-box">
        <img width="400px" src="ocean.jpg" alt="random" />
      </div>

      <p id="abouttext">
        War Ships! is a luck and strategy game where you must locate and destroy your opponent's ships before they destroy your own.
        While you will always be facing a computer, you can choose to play against the layout that a real person uploaded.
        You can also upload your own layout that others can fight against!
        Because playing against the same layout over and over again is no fun, anyone can update their layout to change up their strategy.
      </p>

      <div id="quote" className="quote-box bg-light text-dark">
        <p className="quote">{quote.content}</p>
        <p className="author">{quote.author}</p>
      </div>
    </>
  );
};

export default About;