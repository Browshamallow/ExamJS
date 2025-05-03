import { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
  const [memories, setMemories] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/memoires/library')
      .then(res => res.json())
      .then(data => setMemories(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = memories.filter(memo =>
    memo.title.toLowerCase().includes(search.toLowerCase()) ||
    memo.author.toLowerCase().includes(search.toLowerCase()) ||
    memo.year.toString().includes(search)
  );

  return (

    <div className="library">
      <h2>📚 Memory Library</h2>

      <input
        type="text"
        placeholder="Search by title, author or year"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="library-search"
      />

      <table className="library-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((memo, index) => (
            <tr key={index}>
              <td>{memo.title}</td>
              <td>{memo.author}</td>
              <td>{memo.year}</td>
              <td>
                <a href={memo.pdfUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                  📥 Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default Library;
