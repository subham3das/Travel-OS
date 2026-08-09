import React from 'react';
import { TRAVEL_SEASONS_CONFIG, TravelSeason } from '../../../data/destinations';

interface SeasonSelectorProps {
  selectedSeasons: TravelSeason[];
  onChange: (seasons: TravelSeason[]) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  selectedSeasons,
  onChange,
}) => {
  const toggleSeason = (season: TravelSeason) => {
    if (selectedSeasons.includes(season)) {
      onChange(selectedSeasons.filter((s) => s !== season));
    } else {
      onChange([...selectedSeasons, season]);
    }
  };

  return (
    <div className="space-y-1.5 select-none">
      <label className="text-sm font-extrabold text-[#0F172A]">Travel Season</label>
      <p className="text-xs font-semibold text-slate-400">Select seasons when this package is available</p>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {TRAVEL_SEASONS_CONFIG.map(({ season, emoji }) => {
          const isSelected = selectedSeasons.includes(season);

          return (
            <button
              key={season}
              type="button"
              onClick={() => toggleSeason(season)}
              className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/60 border-[#583BE8] text-[#583BE8] shadow-2xs scale-[1.02]'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span>{season}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonSelector;
