interface Book {
  name: string;
  status: number;
}

function BookCard({ book }: { book: Book }) {
  return (
    <li style={{ margin: "1rem" }}>
      <strong>{book.name}</strong>
      {" - "}
      <span>{book.status}</span>
    </li>
  );
}

export default function App() {
  const book1: Book = { name: "To Kill a Mockingbird", status: 1 };
  const book2: Book = { name: "The Odyssey", status: 2 };
  const book3: Book = { name: "The Bible", status: 3 };

  return (
    <div>
      <h1>Books</h1>
      <ul>
        <BookCard book={book1} />
        <BookCard book={book2} />
        <BookCard book={book3} />
      </ul>
    </div>
  );
}