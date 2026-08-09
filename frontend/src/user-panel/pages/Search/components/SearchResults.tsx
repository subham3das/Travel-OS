import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag, Users, Clock, Compass, MessageSquare, ChevronRight } from 'lucide-react';
import { GroupedSearchResults, SearchResultItem } from '../../../data/search';
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
  const navigate = useNavigate();

  if (results.totalCount === 0) {
    return <NoResults query={query} onSuggestionClick={onSuggestionClick} />;
  }

  const renderGenericCard = (item: SearchResultItem, icon: React.ReactNode) => (
    <div
      key={item.id}
      onClick={() => navigate(item.targetUrl)}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-100"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
              {item.title}
            </h4>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black shrink-0">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-400 truncate">{item.subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#583BE8] transition-colors shrink-0" />
    </div>
  );

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
          type="button"
          onClick={() => onViewAllTab(tabType)}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pt-1 select-none">
      {/* Dynamic Results Count Subheader */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1 border-b border-slate-100">
        <p>
          Showing results for <span className="text-[#583BE8] font-extrabold">"{query}"</span>
        </p>
        <p className="text-slate-400 font-semibold">{results.totalCount} results found</p>
      </div>

      {/* ALL TAB */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Bookings */}
          {results.bookings.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Bookings', <Clock className="w-4 h-4 text-[#583BE8]" />, 'bookings')}
              <div className="space-y-2.5">
                {results.bookings.slice(0, 3).map((item) => renderGenericCard(item, <Clock className="w-4 h-4" />))}
              </div>
            </div>
          )}

          {/* Trips */}
          {results.trips.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Trips', <Compass className="w-4 h-4 text-emerald-600" />, 'trips')}
              <div className="space-y-2.5">
                {results.trips.slice(0, 3).map((item) => renderGenericCard(item, <Compass className="w-4 h-4" />))}
              </div>
            </div>
          )}

          {/* Messages */}
          {results.messages.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Messages', <MessageSquare className="w-4 h-4 text-sky-600" />, 'messages')}
              <div className="space-y-2.5">
                {results.messages.slice(0, 3).map((item) => renderGenericCard(item, <MessageSquare className="w-4 h-4" />))}
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
              {renderSectionHeader('Agencies', <Users className="w-4 h-4 text-amber-600" />, 'agencies')}
              <div className="space-y-3">
                {results.agencies.slice(0, 3).map((item) => (
                  <AgencyCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Destinations Group */}
          {results.destinations.length > 0 && (
            <div className="space-y-3">
              {renderSectionHeader('Destinations', <MapPin className="w-4 h-4 text-[#FF4D6D]" />, 'destinations')}
              <div className="space-y-3">
                {results.destinations.slice(0, 3).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* INDIVIDUAL TABS */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {renderSectionHeader('Bookings', <Clock className="w-4 h-4 text-[#583BE8]" />, 'bookings')}
          <div className="space-y-2.5">
            {results.bookings.map((item) => renderGenericCard(item, <Clock className="w-4 h-4" />))}
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="space-y-3">
          {renderSectionHeader('Trips', <Compass className="w-4 h-4 text-emerald-600" />, 'trips')}
          <div className="space-y-2.5">
            {results.trips.map((item) => renderGenericCard(item, <Compass className="w-4 h-4" />))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-3">
          {renderSectionHeader('Messages', <MessageSquare className="w-4 h-4 text-sky-600" />, 'messages')}
          <div className="space-y-2.5">
            {results.messages.map((item) => renderGenericCard(item, <MessageSquare className="w-4 h-4" />))}
          </div>
        </div>
      )}

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

      {activeTab === 'agencies' && (
        <div className="space-y-3">
          {renderSectionHeader('Agencies', <Users className="w-4 h-4 text-amber-600" />, 'agencies')}
          <div className="space-y-3">
            {results.agencies.map((item) => (
              <AgencyCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'destinations' && (
        <div className="space-y-3">
          {renderSectionHeader('Destinations', <MapPin className="w-4 h-4 text-[#FF4D6D]" />, 'destinations')}
          <div className="space-y-3">
            {results.destinations.map((item) => (
              <DestinationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
