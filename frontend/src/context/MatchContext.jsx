import { useMatches } from '../context/MatchContext';

function MyComponent() {
  const { 
    matches,           // All matches
    liveMatches,       // Only live matches
    loading,           // Loading state
    error,             // Error message
    refreshMatches,    // Refresh function
    selectedMatch,     // Currently selected match
    getMatchesBySport  // Filter by sport
  } = useMatches();

  return (
    <div>
      <h1>Live Matches: {liveMatches.length}</h1>
      <button onClick={refreshMatches}>Refresh</button>
    </div>
  );
}