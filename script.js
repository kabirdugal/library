// DOM Element constants
const newBookModal = document.querySelector(".new-book-modal");
const newBookButton = document.querySelector(".new-book-button");
const modalCloseButton = document.querySelector(".close-button");
const modalSubmitButton = document.querySelector(".add-book-button");
const modalForm = document.querySelector(".modal-form");
const bookContainer = document.querySelector(".books-container");

// initialize library and book to be added
let myLibrary = [];
let newBook;

// defines the Book object
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

// gets book from myLibrary based on title input
function getBook(bookTitle) {
    for (let book of myLibrary) {
        if (book.title === bookTitle) {
            return book;
        }
    }
    return null;
}

// adds book to library
function addBookToLibrary(e) {
    e.preventDefault();

    // creates new book object with inputs
    let formValue = e.target.elements;
    newBook = new Book(
        formValue.title.value,
        formValue.author.value,
        formValue.pages.value,
        formValue.isRead.checked
    );

    myLibrary.push(newBook); // adds input to libray
    renderBook(newBook.title, newBook.author, newBook.pages, newBook.isRead); // render book
    modalForm.reset(); // reset form
    saveLocal(); // save in local storage
    toggleModal(); // close modal form
}

// renders all books in myLibrary onto screen
function renderLibrary() {
    bookContainer.innerHTML = "";
    for (i = 0; i < myLibrary.length; i++) {
        renderBook(
            myLibrary[i].title,
            myLibrary[i].author,
            myLibrary[i].pages,
            myLibrary[i].isRead,
            i
        );
    }
}

// draws the book tile onto the book grid
function renderBook(title, author, pages, isRead, index) {
    let bookDiv = document.createElement("div");
    let readButton = document.createElement("button");
    let bookTitle = document.createElement("h4");
    let bookAuthor = document.createElement("p");
    let bookPages = document.createElement("p");
    let removeBookButton = document.createElement("button");

    bookDiv.classList.add("book");
    readButton.classList.add("status-button");

    bookDiv.setAttribute("data-index", index);
    removeBookButton.style.marginLeft = "10px";

    bookTitle.textContent = title;
    bookAuthor.textContent = "by " + author;
    bookPages.textContent = pages + " pages";
    removeBookButton.textContent = "Remove Book";

    if (isRead) {
        readButton.textContent = "Read";
        readButton.style.backgroundColor = "lightgreen";
        readButton.style.color = "black";
    } else {
        readButton.textContent = "Not Read";
        readButton.style.backgroundColor = "red";
        readButton.style.color = "white";
    }

    readButton.addEventListener("click", function (e) {
        if (readButton.textContent == "Read") {
            getBook(e.target.parentNode.firstChild.textContent).isRead = false;
            readButton.textContent = "Not Read";
            readButton.style.backgroundColor = "red";
            readButton.style.color = "white";
            saveLocal(); // save in local storage
        } else {
            getBook(e.target.parentNode.firstChild.textContent).isRead = true;
            readButton.textContent = "Read";
            readButton.style.backgroundColor = "lightgreen";
            readButton.style.color = "black";
            saveLocal(); // save in local storage
        }
    });

    removeBookButton.addEventListener("click", function () {
        let confirmation = confirm(
            "Are you sure you want to delete this book from your library?"
        );
        if (confirmation) {
            bookDiv.parentNode.removeChild(bookDiv);
            myLibrary.splice(index, 1); // remove from myLibrary
            saveLocal(); // save in local storage
        }
    });

    bookDiv.append(bookTitle);
    bookDiv.append(bookAuthor);
    bookDiv.append(bookPages);
    bookDiv.appendChild(readButton);
    bookDiv.append(removeBookButton);
    bookContainer.appendChild(bookDiv);
}

// Toggle Modal Functions
function toggleModal() {
    newBookModal.classList.toggle("show-modal");
}

function windowOnClick(e) {
    if (e.target === newBookModal) {
        toggleModal();
    }
}

// Modal Event Listeners
newBookButton.addEventListener("click", toggleModal);
modalCloseButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
modalForm.addEventListener("submit", addBookToLibrary);
window.addEventListener("load", renderLibrary);

// Saves myLibrary to local storage
function saveLocal() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

// initializes myLibrary from local storage
function restoreLocal() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    if (myLibrary === null) myLibrary = [];

    renderLibrary();
}
restoreLocal();
