import { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Printer,
  Link as LinkIcon,
  ShieldCheck,
  Clock,
  Calendar,
  Building,
  Mail,
  History,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { legalService, type SearchResult } from '../../services/legalContent.service';
import { LEGAL_CONFIG } from '../../data/legal/legalConfig';

export default function LegalCenterPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const activeSlug = slug || 'terms';
  const allDocs = useMemo(() => legalService.getAllDocuments(), []);
  const activeDoc = useMemo(
    () => legalService.getDocumentBySlug(activeSlug) || allDocs[0],
    [activeSlug, allDocs]
  );

  const activeIndex = allDocs.findIndex((d) => d.slug === activeDoc.slug);
  const prevDoc = activeIndex > 0 ? allDocs[activeIndex - 1] : null;
  const nextDoc = activeIndex < allDocs.length - 1 ? allDocs[activeIndex + 1] : null;

  const headings = useMemo(() => legalService.getHeadings(activeDoc), [activeDoc]);

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);

      const scrollPos = window.scrollY + 160;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSectionId(h.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  useEffect(() => {
    setIsVersionDrawerOpen(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeDoc.slug]);

  const searchResults: SearchResult[] = useMemo(
    () => legalService.search(searchQuery),
    [searchQuery]
  );

  const handleCopyLink = (hashId?: string) => {
    const base = `${window.location.origin}/legal/${activeDoc.slug}`;
    navigator.clipboard.writeText(hashId ? `${base}#${hashId}` : base);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: activeDoc.title,
    description: activeDoc.summary,
    url: `https://apnatrip.in/legal/${activeDoc.slug}`,
    datePublished: activeDoc.effectiveDate,
    dateModified: activeDoc.lastUpdated,
    publisher: { '@type': 'Organization', name: LEGAL_CONFIG.brandName, url: 'https://apnatrip.in' },
  };

  return (
    <>
      <Helmet>
        <title>{`${activeDoc.title} — ApnaTrip Legal & Trust Center`}</title>
        <meta name="description" content={activeDoc.summary} />
        <link rel="canonical" href={`https://apnatrip.in/legal/${activeDoc.slug}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-blue-600 z-[9999] transition-all duration-75 print:hidden"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden print:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 pt-20 pb-10 px-6 overflow-y-auto transition-transform duration-300 lg:hidden print:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute top-5 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
        <SidebarContent
          allDocs={allDocs}
          activeDoc={activeDoc}
          onSelect={() => setMobileSidebarOpen(false)}
        />
      </aside>

      {/* Page */}
      <div
        className="min-h-screen text-slate-900 dark:text-slate-100 pt-20 pb-32"
        style={{ background: 'linear-gradient(180deg, #fafcff 0%, #ffffff 100%)' }}
      >
        {/* Legal Header */}
        <header className="w-full border-b border-slate-100 dark:border-slate-800/60 py-10 px-6 lg:px-16 xl:px-24 print:hidden">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                <ShieldCheck size={14} />
                <span>Legal &amp; Trust Center</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Official Platform Policies
              </h1>
              <p className="mt-2 text-base text-slate-500 dark:text-slate-400 max-w-xl">
                Everything you need to know about using {LEGAL_CONFIG.brandName} safely, legally,
                and transparently.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {['DPDP Act 2023', 'IT Act 2000', 'Consumer Protection', 'RBI Escrow', 'Privacy'].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search policies, clauses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Body: sidebar + content */}
        <div className="max-w-screen-2xl mx-auto flex items-start gap-0 px-0 lg:px-6 xl:px-12 mt-0">

          {/* Left Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-none py-10 pr-4 print:hidden">
            <SidebarContent allDocs={allDocs} activeDoc={activeDoc} />
          </aside>

          {/* Center: Document */}
          <main ref={mainRef} className="flex-1 min-w-0 py-10 px-4 lg:px-10 xl:px-16">

            {/* Mobile docs button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer print:hidden"
            >
              <Menu size={16} />
              Documents
            </button>

            {/* Search Results */}
            {searchQuery.trim() ? (
              <div className="max-w-3xl">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-5">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;
                  {searchQuery}&quot;
                </div>
                {searchResults.length === 0 ? (
                  <p className="text-sm text-slate-400">No matching legal clauses found.</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((res: SearchResult, i: number) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery('');
                          navigate(`/legal/${res.doc.slug}`);
                          setTimeout(() => scrollToHeading(res.sectionId), 150);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-all"
                      >
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                          <FileText size={12} />
                          {res.doc.title} &rarr; {res.sectionTitle}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {res.snippet}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Document + Right TOC */
              <div className="flex items-start gap-10 xl:gap-14">

                {/* Article */}
                <article className="flex-1 min-w-0 max-w-[820px]">

                  {/* Doc meta row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-slate-400 font-medium mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-blue-500" />
                      Effective {activeDoc.effectiveDate}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {activeDoc.readingTimeMinutes} min read
                    </span>
                    <span>&middot;</span>
                    <span className="font-mono text-slate-400">v{activeDoc.version}</span>

                    {/* Inline doc actions */}
                    <span className="flex items-center gap-1 ml-auto print:hidden">
                      <button
                        onClick={() => handleCopyLink()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                      >
                        <LinkIcon size={12} />
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                      >
                        <Printer size={12} />
                        Print
                      </button>
                      <button
                        onClick={() => setIsVersionDrawerOpen((v) => !v)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                      >
                        <History size={12} />
                        History
                      </button>
                    </span>
                  </div>

                  {/* Doc title */}
                  <h2 className="text-[2.6rem] sm:text-[3.2rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                    {activeDoc.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 border-b border-slate-100 dark:border-slate-800 pb-10">
                    {activeDoc.summary}
                  </p>

                  {/* Version Changelog */}
                  {isVersionDrawerOpen && (
                    <div className="mb-10 p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 space-y-4 print:hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                          <History size={15} /> Version Changelog
                        </span>
                        <span className="text-xs text-blue-700 dark:text-blue-400">
                          Reviewed by {activeDoc.reviewedBy}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {activeDoc.changelog.map((rec) => (
                          <div key={rec.version} className="flex items-start gap-4 text-sm">
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0 w-16">
                              {rec.version}
                            </span>
                            <span className="text-slate-400 shrink-0 w-24">{rec.publishedDate}</span>
                            <span className="text-slate-700 dark:text-slate-300">{rec.summary}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sections */}
                  <div className="space-y-16">
                    {activeDoc.sections.map((sec) => (
                      <section key={sec.id} id={sec.id} className="scroll-mt-28 group">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-[1.45rem] font-bold text-slate-900 dark:text-white leading-snug">
                            {sec.title}
                          </h3>
                          <button
                            onClick={() => handleCopyLink(sec.id)}
                            title="Copy anchor link"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-blue-500 cursor-pointer"
                          >
                            <LinkIcon size={14} />
                          </button>
                        </div>
                        <hr className="border-slate-100 dark:border-slate-800 mb-6" />

                        <div className="text-[17px] text-slate-600 dark:text-slate-300 leading-[1.85] whitespace-pre-line">
                          {sec.content.split(/(\[[^\]]+\]\([^)]+\))/g).map((chunk, cIdx) => {
                            const match = chunk.match(/\[([^\]]+)\]\(([^)]+)\)/);
                            if (match) {
                              return (
                                <Link
                                  key={cIdx}
                                  to={match[2]}
                                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-0.5"
                                >
                                  <span>{match[1]}</span>
                                  <ArrowUpRight size={13} />
                                </Link>
                              );
                            }
                            return chunk;
                          })}
                        </div>
                      </section>
                    ))}
                  </div>

                  {/* Prev / Next Navigation */}
                  <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex items-stretch justify-between gap-4">
                    {prevDoc ? (
                      <Link
                        to={`/legal/${prevDoc.slug}`}
                        className="group flex-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                          <ChevronLeft size={14} /> Previous
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {prevDoc.title}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {nextDoc ? (
                      <Link
                        to={`/legal/${nextDoc.slug}`}
                        className="group flex-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-right"
                      >
                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                          Next <ChevronRight size={14} />
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {nextDoc.title}
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>

                  {/* Contact footer strip */}
                  <div className="mt-14 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <Building size={14} className="text-blue-500" />
                      {LEGAL_CONFIG.companyName} &middot; {LEGAL_CONFIG.registeredOffice.city}, India
                    </span>
                    <a
                      href={`mailto:${LEGAL_CONFIG.contacts.legal}`}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={14} className="text-blue-500" />
                      {LEGAL_CONFIG.contacts.legal}
                    </a>
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Grievance: {LEGAL_CONFIG.officers.grievanceOfficer.name}
                    </span>
                  </div>
                </article>

                {/* Right Sticky TOC */}
                {headings.length > 0 && (
                  <aside className="hidden xl:block w-52 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-none py-2 print:hidden">
                    <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      On this page
                    </div>
                    <nav className="space-y-0.5">
                      {headings.map((h) => {
                        const isCurrent = activeSectionId === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => scrollToHeading(h.id)}
                            className={`w-full text-left py-1.5 pl-3 text-[13px] border-l-2 transition-all cursor-pointer truncate ${
                              isCurrent
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-950/30 rounded-r-sm'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300'
                            }`}
                          >
                            {h.title}
                          </button>
                        );
                      })}
                    </nav>
                  </aside>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

/* Sidebar nav — shared between desktop and mobile drawer */
function SidebarContent({
  allDocs,
  activeDoc,
  onSelect,
}: {
  allDocs: ReturnType<typeof legalService.getAllDocuments>;
  activeDoc: ReturnType<typeof legalService.getAllDocuments>[number];
  onSelect?: () => void;
}) {
  return (
    <div>
      <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
        Documents
      </div>
      <nav className="space-y-0.5">
        {allDocs.map((doc) => {
          const isActive = doc.slug === activeDoc.slug;
          return (
            <Link
              key={doc.id}
              to={`/legal/${doc.slug}`}
              onClick={onSelect}
              className={`flex items-center justify-between w-full py-2 pl-3 pr-2 text-[13px] border-l-2 rounded-r-sm transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200'
              }`}
            >
              <span className="truncate">{doc.title}</span>
              <span
                className={`text-[10px] font-mono ml-2 shrink-0 ${
                  isActive ? 'text-blue-400' : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                v{doc.version}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
