import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:sport/:matchId', protect, async (req, res) => {
  const { sport, matchId } = req.params;
  const { style = 'professional' } = req.query;
  
  console.log('🤖 Generating', style, 'commentary for', sport, matchId);

  // HIGH-QUALITY DYNAMIC MOCK COMMENTARY
  const commentaries = {
    cricket: {
      professional: "What an electrifying cricket match we're witnessing! Both teams are displaying exceptional skill under pressure, with the run rate climbing steadily. The bowlers are fighting back brilliantly, and this match could swing either way in these crucial overs!",
      
      casual: "OMG this cricket match is absolutely insane! The batsmen are smashing it everywhere and the fielders are pulling off some crazy catches. This is why we love cricket - pure drama and excitement!",
      
      analytical: "From a tactical perspective, the batting team is maintaining a healthy run rate of 6.8 per over while the bowling attack is strategically varying their pace. Key partnerships and powerplay execution will determine the final outcome of this closely contested match.",
      
      dramatic: "THIS IS CRICKET AT ITS ABSOLUTE FINEST! Every ball carries the weight of DESTINY! The tension is UNBEARABLE as these titans clash under the lights! History is being written with every run, every wicket - WHO WILL EMERGE VICTORIOUS?!"
    },
    
    football: {
      professional: "What a thrilling football encounter we're witnessing here! Both teams are showing incredible tactical discipline and attacking intent. The midfield battle has been intense, and we could see more goals as fatigue sets in during this crucial period!",
      
      casual: "Wow, this football game is absolutely crazy! The pace is insane and both teams are going all out for the win! The crowd is going wild - this is pure entertainment!",
      
      analytical: "Tactically, both teams are employing a high-press system with quick transitions. Possession statistics are nearly equal at 52-48, but the attacking efficiency in the final third differs significantly. Set pieces could prove decisive in this tightly contested match.",
      
      dramatic: "THE BEAUTIFUL GAME at its most SPECTACULAR! Every pass, every tackle, every moment drips with INTENSITY! The crowd ROARS as history unfolds before our very eyes! This is what legends are made of!"
    }
  };

  const commentary = commentaries[sport]?.[style] || commentaries[sport]?.professional || "Exciting match in progress with both teams giving their absolute best!";

  console.log('✅ Commentary generated successfully!');

  res.json({ 
    success: true,
    commentary,
    matchId,
    sport,
    style,
    generatedAt: new Date().toISOString()
  });
});

router.get('/styles', (req, res) => {
  res.json({
    styles: [
      { id: 'professional', name: 'Professional', description: 'Professional sports commentary', icon: '🎙️' },
      { id: 'casual', name: 'Casual Fan', description: 'Enthusiastic fan commentary', icon: '😄' },
      { id: 'analytical', name: 'Tactical Analysis', description: 'Deep tactical analysis', icon: '📊' },
      { id: 'dramatic', name: 'Dramatic', description: 'Epic dramatic narration', icon: '⚡' }
    ]
  });
});

export default router;