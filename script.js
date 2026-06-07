const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const button = document.getElementById("quote-btn");

let lastIndex = -1;

function getRandomQuote() {
  let index;
  do {
    index = Math.floor(Math.random() * QUOTES.length);
  } while (index === lastIndex && QUOTES.length > 1);

  lastIndex = index;
  return QUOTES[index];
}

function showQuote() {
  const { text, author } = getRandomQuote();
  quoteEl.textContent = `"${text}"`;
  authorEl.textContent = `— ${author}`;
}

button.addEventListener("click", showQuote);
