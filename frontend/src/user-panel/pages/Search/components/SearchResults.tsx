import React from 'react';
import { MapPin, ShoppingBag, Users } from 'lucide-react';
import { GroupedSearchResults } from '../../../data/search';
import { SearchTabType } from './SearchTabs';
import { DestinationCard } from './DestinationCard';
import { PackageCard } from './PackageCard';
import { AgencyCard } from './AgencyCard';
import { NoResults } from './NoResults';

interface SearchResultsProps {
  query: string;
  results: GroupedSearchResults;
  activeTab: SearchTabType;
  onSuggestionClick: (term: string) => void;
  onViewAllTab?: (tab: SearchTabType) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  activeTab,
  onSuggestionClick,
  onViewAllTab,
}) => {
  if (results.totalCount === 0) {
    return <NoResults query={query} onSuggestionClick={onSuggestionClick} />;
  }

  const renderSectionHeader = (
    title: string,
    icon: React.ReactNode,
    tabType: SearchTabType
  ) => (
    <div className="flex items-center justify-between pt-2 pb-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <h3 className="text-sm font-black text-[#0F172A]">{title}</h3>
      </div>
      {onViewAllTab && activeTab === 'all' && (
        <button
          onClick={() => onViewAllTab(tabType)}
          className="text-xs font-extrabold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pt-1">
      {/* Dynamic Results Count Subheader */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">
        <p>
          Showing results for <span className="text-[#6356E5] font-extrabold">"{query}"</span>
        </p>
        <p className="text-slate-400 font-semibold">{results.totalCount} results found</p>
      </div>

      {/* ALL TAB */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Destinations Group */}
          {results.destinations.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Destinations', <MapPin className="w-4 h-4 text-[#6356E5]" />, 'destinations')}
              <div className="space-y-3">
                {results.destinations.slice(0, 3).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Packages Group */}
          {results.packages.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Packages', <ShoppingBag className="w-4 h-4 text-purple-600" />, 'packages')}
              <div className="space-y-3">
                {results.packages.slice(0, 3).map((item) => (
                  <PackageCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Agencies Group */}
          {results.agencies.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Agencies', <Users className="w-4 h-4 text-emerald-600" />, 'agencies')}
              <div className="space-y-3">
                {results.agencies.slice(0, 3).map((item) => (
                  <AgencyCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESTINATIONS TAB */}
      {activeTab === 'destinations' && (
        <div className="space-y-3">
          {renderSectionHeader('Destinations', <MapPin className="w-4 h-4 text-[#6356E5]" />, 'destinations')}
          <div className="space-y-3">
            {results.destinations.map((item) => (
              <DestinationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* PACKAGES TAB */}
      {activeTab === 'packages' && (
        <div className="space-y-3">
          {renderSectionHeader('Packages', <ShoppingBag className="w-4 h-4 text-purple-600" />, 'packages')}
          <div className="space-y-3">
            {results.packages.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* AGENCIES TAB */}
      {activeTab === 'agencies' && (
        <div className="space-y-3">
          {renderSectionHeader('Agencies', <Users className="w-4 h-4 text-emerald-600" />, 'agencies')}
          <div className="space-y-3">
            {results.agencies.map((item) => (
              <AgencyCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
