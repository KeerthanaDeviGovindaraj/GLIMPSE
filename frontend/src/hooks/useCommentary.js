import { useState, useEffect, useCallback } from 'react';
import { commentaryService } from '../services/commentaryService';

export const useCommentary = (matchId) => {
  const [commentaries, setCommentaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState([]);

  // Fetch commentaries for a match
  const fetchCommentaries = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await commentaryService.getMatchCommentary(matchId);
      setCommentaries(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching commentaries:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Add new commentary
  const addCommentary = useCallback((commentary) => {
    setCommentaries(prev => [...prev, commentary]);
  }, []);

  // Filter commentaries
  const filterCommentaries = useCallback((filterTypes) => {
    setFilters(filterTypes);
  }, []);

  // Get filtered commentaries
  const filteredCommentaries = filters.length > 0
    ? commentaries.filter(c => filters.includes(c.type))
    : commentaries;

  // Clear all commentaries
  const clearCommentaries = useCallback(() => {
    setCommentaries([]);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCommentaries();
  }, [fetchCommentaries]);

  return {
    commentaries: filteredCommentaries,
    allCommentaries: commentaries,
    loading,
    error,
    filters,
    addCommentary,
    filterCommentaries,
    clearCommentaries,
    refetch: fetchCommentaries
  };
};
