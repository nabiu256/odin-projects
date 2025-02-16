// Setup
let bookLibrary = [
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
  this.id = self.crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead ? "read" : "not read yet"
      }.`;
  };
}

Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
  console.dir(this);
}


/**
 * Toggles the state value for the `isRead` property of a given book, by id.
 * 
 * @param {number} bookId Id of the book
 * @param {boolean} readValue Whether the book has been read or not
 */
// const toggleRead = (bookId, readValue) => {
//   bookLibrary.find((book) => book.id === bookId).isRead = readValue;
//   console.dir(bookLibrary.find((book) => book.id === bookId));
// }

const bookGrid = document.getElementById("books-grid");
const dialog = document.querySelector("dialog");
const showBtn = document.querySelector("#dialog-show");
const closeBtn = document.querySelector("#dialog-close");
const booksForm = document.getElementById("books-form");

/**
 * Grabs book information from the form and returns a Book object.
 * @returns {Book} Book object containing the form information.
 */
const getBookFromInput = () => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const isRead = document.getElementById("read").checked;

  return { title, author, pages, isRead };
};

/**
 * Creates an HTML card for the given book and attaches it to the books grid.
 *
 * @param {Book} book - The Book object we want to create the card from.
 * @param {HTMLElement} bookGrid - The HTML element holding the book cards.
 */
const renderBookCard = (book) => {
  const bookCard = document.createElement("div");
  const title = document.createElement("p");
  const author = document.createElement("p");
  const pages = document.createElement("p");
  const readBtn = document.createElement("input");
  const readBtnLabel = document.createElement("label");
  const removeBtn = document.createElement("button");

  bookCard.classList.add("book-card");
  bookCard.setAttribute("data-book-id", book.id);

  readBtn.setAttribute("type", "checkbox");
  readBtn.setAttribute("id", `read-${book.id}`);
  readBtnLabel.setAttribute("for", "read");
  if (book.isRead) readBtn.checked = true;
  readBtn.addEventListener("input", () => book.toggleRead());

  title.textContent = book.title;
  author.textContent = book.author;
  pages.textContent = `${book.pages} pages`;
  readBtnLabel.textContent = "Read?";

  removeBtn.addEventListener("click", () => removeBookFromLibrary(book.id));
  removeBtn.innerHTML = "Delete"

  bookCard.appendChild(title);
  bookCard.appendChild(author);
  bookCard.appendChild(pages);
  bookCard.appendChild(readBtnLabel);
  bookCard.appendChild(readBtn);
  bookCard.appendChild(removeBtn);
  bookGrid.appendChild(bookCard);
};


/**
 * Toggles the state value for the `isRead` property of a given book, by id.
 * 
 * @param {number} bookId Id of the book
 * @param {boolean} readValue Whether the book has been read or not
 */
const toggleRead = (bookId, readValue) => {
  bookLibrary.find((book) => book.id === bookId).isRead = readValue;
}

/**
 * @param {any} bookId Id of the book to remove
 *
 * Removes the HTML element of the Book, by using the book id.
 */
const removeBookCard = (bookId) => {
  let bookCard = document.querySelector(`[data-book-id="${bookId}"]`)
  bookCard.remove();
}

/** 
 * Updates the current displayed Book cards according to the
 * state array `bookLibrary`.
*/
const updateUI = () => {
  // Compare state array and current displayed books
  // and see which ones need to be added or deleted

  // 1. Get array of id's of currently displayed books
  const displayedBooks = [];

  bookGrid.querySelectorAll("[data-book-id]").forEach((bookElement) => {
    displayedBooks.push(bookElement.dataset.bookId);
  });

  // 2. Compare with state array and see which books need to be added
  // or removed from page
  const removedElements = displayedBooks.filter(elt => !bookLibrary.find((book) => book.id === elt));
  const addedElements = bookLibrary.filter(book => !displayedBooks.includes(book.id));

  console.dir(displayedBooks);
  console.dir(addedElements);

  // 3. On the page, add elements to be added, remove elements to be removed
  for (const bookId of removedElements) {
    removeBookCard(bookId);
  }

  for (const book of addedElements) {
    renderBookCard(book);
  }
}


/**
 * @param {any} bookData Information on the book to add
 */
const addBookToLibrary = (bookData) => {
  // 1. Construct book with given data
  const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.read);
  // 2. Append book to array (update state)
  bookLibrary.push(book);
};


/**
 * @param {any} bookId Id of the book to be removed
 *
 * Removes a book from the state array, by id.
 */
const removeBookFromLibrary = (bookId) => {
  bookLibrary = bookLibrary.filter((book) => book.id !== bookId);
  updateUI();
}


showBtn.addEventListener("click", () => {
  booksForm.reset();
  dialog.showModal();
});

const closeBookModal = () => {
  dialog.close();
};

closeBtn.addEventListener("click", () => {
  closeBookModal();
});

booksForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Get book data from form
  const bookData = getBookFromInput();

  // 2. Add the book to the state array
  addBookToLibrary(bookData);

  // 3. Update UI
  updateUI();

  closeBookModal();
});

// Render initial list of books
updateUI();
