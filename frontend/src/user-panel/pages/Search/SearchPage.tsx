import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';
import { DEFAULT_FILTER_STATE, isFilterActive } from '../../data/search';

import { SearchInput } from './components/SearchInput';
import { InlineFilters } from './components/InlineFilters';
import { RecentSearches } from './components/RecentSearches';
import { PopularSearches } from './components/PopularSearches';
import { TrendingDestinations } from './components/TrendingDestinations';
import { SuggestedTrips } from './components/SuggestedTrips';
import { SearchTabs, SearchTabType } from './components/SearchTabs';
import { SearchResults } from './components/SearchResults';
import { AskAICard } from './components/AskAICard';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { query, setQuery, filters, setFilters, results, loading } = useSearch('');
  const [activeTab, setActiveTab] = useState<SearchTabType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Local storage for recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apnatrip_recent_searches');
      return saved ? JSON.parse(saved) : ['Meghalaya', 'Ladakh', 'Himalayan Explorers', 'Kerala'];
    } catch {
      return ['Meghalaya', 'Ladakh', 'Himalayan Explorers', 'Kerala'];
    }
  });

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      localStorage.setItem('apnatrip_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveRecent = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem('apnatrip_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('apnatrip_recent_searches');
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    saveSearchTerm(term);
  };

  const activeFiltersPresent = isFilterActive(filters);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]"
    >
      {/* Sticky Search Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 shadow-2xs">
        <div className="max-w-3xl mx-auto">
          <SearchInput
            query={query}
            onQueryChange={(q) => {
              setQuery(q);
              if (q.trim()) saveSearchTerm(q);
            }}
            onClear={() => setQuery('')}
            onCancel={() => navigate(-1)}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
            isFilterActive={activeFiltersPresent}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Inline Expandable Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <InlineFilters
                filters={filters}
                onFilterChange={(updated) => setFilters(updated)}
                onApply={() => setIsFilterOpen(false)}
                onReset={() => setFilters(DEFAULT_FILTER_STATE)}
                totalResultsCount={results.totalCount}
              />
            )}
          </AnimatePresence>

          {query.trim() === '' && !activeFiltersPresent ? (
            /* NO TYPING & NO ACTIVE FILTERS STATE */
            <div className="space-y-6">
              {/* 1. Recent Searches (100ms delay) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              >
                <RecentSearches
                  searches={recentSearches}
                  onSelect={handleSelectTerm}
                  onRemove={handleRemoveRecent}
                  onClearAll={handleClearAllRecent}
                />
              </motion.div>

              {/* 2. Popular Searches (150ms delay) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
              >
                <PopularSearches onSelect={handleSelectTerm} />
              </motion.div>

              {/* 3. Trending Destinations (200ms delay) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
              >
                <TrendingDestinations />
              </motion.div>

              {/* 4. Suggested Trips (250ms delay) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
              >
                <SuggestedTrips />
              </motion.div>
            </div>
          ) : (
            /* TYPING OR ACTIVE FILTERS STATE - FILTERED RESULTS */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Filter Tabs */}
              <SearchTabs
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                counts={{
                  destinations: results.destinations.length,
                  packages: results.packages.length,
                  agencies: results.agencies.length,
                }}
              />

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 border-3 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400">Searching...</p>
                </div>
              ) : (
                <SearchResults
                  query={query}
                  results={results}
                  activeTab={activeTab}
                  onSuggestionClick={handleSelectTerm}
                  onViewAllTab={(tab) => setActiveTab(tab)}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* ALWAYS SHOW ASK AI CARD AT THE BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
        >
          <AskAICard />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default SearchPage;
