import { useCommentary } from '../context/CommentaryContext';

function CommentaryFeed() {
  const {
    commentaries,          // All commentaries
    filteredCommentaries,  // Filtered commentaries
    activeFilters,         // Current filters
    addCommentary,         // Add new commentary
    filterCommentaries,    // Apply filters
    clearCommentaries      // Clear all
  } = useCommentary();

  return (
    <div>
      <h2>Commentary ({commentaries.length})</h2>
      {filteredCommentaries.map(c => (
        <div key={c.id}>{c.text}</div>
      ))}
    </div>
  );
}