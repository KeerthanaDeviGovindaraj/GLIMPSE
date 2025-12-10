
// Commentary text templates
export const commentaryTemplates = {
  goal: (team, player, time) => `⚽ GOAL! ${team} scores! ${player || 'Player'} finds the net at ${time}'`,
  
  card: (team, player, cardType, time) => {
    const emoji = cardType === 'yellow' ? '🟨' : '🟥';
    return `${emoji} ${cardType.toUpperCase()} CARD for ${player || 'Player'} from ${team} at ${time}'`;
  },
  
  substitution: (team, playerOut, playerIn, time) => 
    `🔄 Substitution for ${team}: ${playerOut || 'Player'} OFF, ${playerIn || 'Player'} ON at ${time}'`,
  
  highlight: (text, time) => `⭐ ${text} at ${time}'`,
  
  alert: (text, time) => `🚨 ${text} at ${time}'`,
  
  analysis: (text) => `📊 Analysis: ${text}`,
  
  kickoff: (team1, team2) => `⚽ Kick-off! ${team1} vs ${team2} - The match is underway!`,
  
  halftime: (score1, score2, team1, team2) => 
    `⏱️ Half-time: ${team1} ${score1} - ${score2} ${team2}`,
  
  fulltime: (score1, score2, team1, team2) => 
    `🏁 Full-time: ${team1} ${score1} - ${score2} ${team2}`,
  
  injury: (team, player, time) => 
    `🚑 Injury concern for ${team}. ${player || 'Player'} needs medical attention at ${time}'`,
  
  penalty: (team, time) => `📣 PENALTY awarded to ${team} at ${time}'!`,
  
  corner: (team, time) => `⚽ Corner kick for ${team} at ${time}'`,
  
  offside: (team, time) => `🚩 Offside! ${team} attack stopped at ${time}'`,
  
  save: (team, goalkeeper, time) => 
    `🧤 Great save by ${goalkeeper || 'Goalkeeper'} for ${team} at ${time}'!`,
  
  miss: (team, player, time) => 
    `😮 Close! ${player || 'Player'} from ${team} just misses at ${time}'`
};

// Generate random commentary (for demo/testing)
export const generateRandomCommentary = (match, time) => {
  const types = ['goal', 'card', 'corner', 'save'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const team = Math.random() > 0.5 ? match.team1 : match.team2;
  
  switch (randomType) {
    case 'goal':
      return commentaryTemplates.goal(team, 'Player #10', time);
    case 'card':
      return commentaryTemplates.card(team, 'Player #5', 'yellow', time);
    case 'corner':
      return commentaryTemplates.corner(team, time);
    case 'save':
      return commentaryTemplates.save(team, 'Goalkeeper', time);
    default:
      return `Match action at ${time}'`;
  }
};

// Format commentary for display
export const formatCommentaryText = (commentary) => {
  return {
    ...commentary,
    displayTime: formatMatchTime(commentary.time),
    displayText: commentary.text,
    displayType: formatStatus(commentary.type)
  };
};