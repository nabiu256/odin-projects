//==========================
//          State
//==========================

/** Holds the state of the application, in our case, an array of `Book` objects. */
let bookLibrary = [
  new Book("The Hobbit", "J.R.R. Tolkien", 295, true),
  new Book("Gideon the Ninth", "Tamsyn Muir", 448, false),
  new Book("Foundation", "Isaac Asimov", 244, true),
];

/**
 * Represents a book.
 * 
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

/** Toggles the state value `isRead`. */
Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
}

/**
 * Creates and adds a book to the state array of the application.
 * 
 * @param {any} bookData Information on the book to add
 */
const addBookToLibrary = (bookData) => {
  const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.isRead);
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


//==========================
//            UI
//==========================
const bookGrid = document.getElementById("books-grid");
const dialog = document.querySelector("dialog");
const showBtn = document.querySelector("#dialog-show");
const closeBtn = document.querySelector("#dialog-close");
const booksForm = document.getElementById("books-form");

/**
 * Grabs book information from the form and returns it as an object.
 * 
 * @param {HTMLFormElement} form - The form element holding the values to use.
 * @returns {any} Object containing the form information.
 */
const getBookFromInput = (form) => {
  const title = form.querySelector("#title").value;
  const author = form.querySelector("#author").value;
  const pages = form.querySelector("#pages").value;
  const isRead = form.querySelector("#read").checked;

  return { title, author, pages, isRead };
};

/**
 * Creates a Boo card for the given book and attaches it to the books grid.
 *
 * @param {Book} book - The Book object we want to create the card from.
 */
const renderBookCard = (book) => {
  // We use innerHTML here to easily modify the HTML
  const innerHTML = `
<h3>${book.title}</h3>
<div class="book-card__content">
  <p class="book-card__author">${book.author}</p>
  <p>${book.pages} pages</p>
  <div>
    <label for="read-${book.id}">Read?</label>
    <input type="checkbox" id="read-${book.id}" ${book.isRead ? "checked" : ""}>
  </div>
</div>
<button>Remove</button>
`
  const bookCard = document.createElement("div");
  bookCard.innerHTML = innerHTML;
  bookCard.classList.add("book-card");
  bookCard.setAttribute("data-book-id", book.id);
  bookGrid.appendChild(bookCard);

  bookCard.querySelector("button").addEventListener("click", () => removeBookFromLibrary(book.id))
  bookCard.querySelector('[type="checkbox"]').addEventListener("input", () => book.toggleRead());
};

/**
 * Removes the HTML book card, by using the book id.
 * 
 * @param {any} bookId Id of the book to remove
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
  // 1. Get array of id's of currently displayed books
  const displayedBooks = [];

  bookGrid.querySelectorAll("[data-book-id]").forEach((bookElement) => {
    displayedBooks.push(bookElement.dataset.bookId);
  });

  // 2. Compare with state array and see which books need to be added
  // or removed from page
  const addElements = bookLibrary.filter(book => !displayedBooks.includes(book.id));
  const removeElements = displayedBooks.filter(elt => !bookLibrary.find((book) => book.id === elt));

  // 3. On the page, add elements to be added, remove elements to be removed
  for (const bookId of removeElements) {
    removeBookCard(bookId);
  }

  for (const book of addElements) {
    renderBookCard(book);
  }
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
  const bookData = getBookFromInput(e.target);

  // 2. Add the book to the state array
  addBookToLibrary(bookData);

  // 3. Update UI
  updateUI();

  closeBookModal();
});

// Render initial list of books
updateUI();
