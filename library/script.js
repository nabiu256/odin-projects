const myLibrary = [
  new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
  new Book("Gideon the Ninth", "Tamsyn Muir", 448, false),
  new Book("Foundation", "Isaac Asimov", 244, true),
];

/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * @param {string} pages - Total pages of the book.
 * @param {read} isRead - Whether the book has been read or not.
 */
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? "read" : "not read yet"
      }.`;
  };
}

/**
 * Creates an HTML card for the given book.
 * @param {Book} book - The Book object we want to create the card from.
 * @param {HTMLElement} bookGrid - The HTML element holding the book cards.
 */
const createBookCard = (book, bookGrid) => {
  const bookCard = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const readBtn = document.createElement("input");
  const readBtnLabel = document.createElement("label");

  readBtn.setAttribute("type", "checkbox");
  readBtn.setAttribute("id", "read");
  readBtnLabel.setAttribute("for", "read");
  if (book.isRead) readBtn.checked = true;

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  readBtnLabel.textContent = "Read?";

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(readBtnLabel);
  bookCard.appendChild(readBtn);
  bookGrid.appendChild(bookCard);
};

/**
 * Grabs book information from the form and returns a Book object.
 * @returns {Book} Book object containing the form information.
 */
const getBookFromInput = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("read").checked;

  return new Book(title, author, pages, isRead);
};

const booksForm = document.getElementById("books-form");
const bookGrid = document.getElementById("books-grid");
booksForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const book = getBookFromInput();
  createBookCard(book, bookGrid);
});
