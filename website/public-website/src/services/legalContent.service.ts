import { LEGAL_CONTENT_STORE, type LegalDocumentContent, type LegalHeading } from '../content/legal/legalContentStore';

export interface SearchResult {
  doc: LegalDocumentContent;
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  matchType: 'title' | 'heading' | 'content' | 'tag';
}

/**
 * Legal Content Service / Data Layer
 * Abstracted so that future updates can seamlessly query a Headless CMS or backend database.
 */
class LegalContentService {
  private documents: LegalDocumentContent[] = LEGAL_CONTENT_STORE;

  // Retrieve all published legal documents
  public getAllDocuments(): LegalDocumentContent[] {
    return this.documents.filter((d) => d.status === 'Published');
  }

  // Retrieve a single document by slug
  public getDocumentBySlug(slug: string): LegalDocumentContent | undefined {
    return this.documents.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
  }

  // Extract automatic Table of Contents headings
  public getHeadings(doc: LegalDocumentContent): LegalHeading[] {
    return doc.sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      level: 2,
    }));
  }

  // Full-Text Search indexing titles, sections, content & tags
  public search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    this.getAllDocuments().forEach((doc) => {
      // 1. Tag match
      if (doc.tags.some((t) => t.toLowerCase().includes(q))) {
        results.push({
          doc,
          sectionId: doc.sections[0]?.id || '',
          sectionTitle: doc.title,
          snippet: `Tagged with: ${doc.tags.join(', ')}`,
          matchType: 'tag',
        });
      }

      // 2. Sections match
      doc.sections.forEach((sec) => {
        const titleMatch = sec.title.toLowerCase().includes(q);
        const contentIdx = sec.content.toLowerCase().indexOf(q);

        if (titleMatch || contentIdx !== -1) {
          let snippet = '';
          if (contentIdx !== -1) {
            const start = Math.max(0, contentIdx - 40);
            const end = Math.min(sec.content.length, contentIdx + 90);
            snippet = (start > 0 ? '...' : '') + sec.content.substring(start, end) + (end < sec.content.length ? '...' : '');
          } else {
            snippet = sec.content.substring(0, 110) + '...';
          }

          results.push({
            doc,
            sectionId: sec.id,
            sectionTitle: sec.title,
            snippet,
            matchType: titleMatch ? 'heading' : 'content',
          });
        }
      });
    });

    return results;
  }
}

export const legalService = new LegalContentService();
