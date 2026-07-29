import { books } from "@/content/books";

export default function BooksPage() {
  return (
    <main>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.title}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            {book.note ? <p>{book.note}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}