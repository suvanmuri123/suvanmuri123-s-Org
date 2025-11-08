

import React from 'react';
import { Mood, MoodValue } from '../types';

interface MoodTrackerProps {
  onAddMood: (mood: MoodValue) => void;
  lastMood?: Mood;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onAddMood, lastMood }) => {
    const moods: MoodValue[] = ['😍', '😊', '🙂', '😐', '😟', '😠'];

  return (
    <div className="bg-transparent p-2 rounded-lg">
      <div className="flex justify-around">
        {moods.map(mood => (
          <button
            key={mood}
            onClick={() => onAddMood(mood)}
            className={`text-2xl p-1 rounded-full transition-all duration-200 ${lastMood?.mood === mood ? 'bg-highlight/50 scale-125' : 'hover:scale-125 hover:bg-accent'}`}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;