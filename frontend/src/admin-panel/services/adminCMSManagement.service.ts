import {
  CMSKPIStats,
  CMSContentTreeItem,
  CMSSectionItem,
  CMSHeroBannerData,
  CMSScheduledTimelineItem,
  CMSVersionHistoryItem,
  CMSMediaUsageItem,
  CMSContentActivityItem,
} from '../types/cmsManagement';
import {
  initialCMSKPIStats,
  initialContentTree,
  initialHeroBanner,
  initialCMSSections,
  initialScheduledTimeline,
  initialContentActivity,
  initialVersionHistory,
  initialMediaUsage,
} from '../data/cmsData';

class AdminCMSManagementService {
  private kpiStats: CMSKPIStats = initialCMSKPIStats;
  private contentTree: CMSContentTreeItem[] = initialContentTree;
  private heroBanner: CMSHeroBannerData = initialHeroBanner;
  private sections: CMSSectionItem[] = initialCMSSections;
  private scheduledTimeline: CMSScheduledTimelineItem[] = initialScheduledTimeline;
  private activity: CMSContentActivityItem[] = initialContentActivity;
  private versionHistory: CMSVersionHistoryItem[] = initialVersionHistory;
  private mediaUsage: CMSMediaUsageItem[] = initialMediaUsage;

  public async getKPIStats(): Promise<CMSKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getContentTree(searchQuery?: string): Promise<CMSContentTreeItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!searchQuery || searchQuery.trim() === '') {
          resolve(this.contentTree);
          return;
        }

        const q = searchQuery.toLowerCase();
        const filterTree = (nodes: CMSContentTreeItem[]): CMSContentTreeItem[] => {
          return nodes
            .map((node) => {
              const matches = node.label.toLowerCase().includes(q);
              const filteredChildren = node.children ? filterTree(node.children) : undefined;
              if (matches || (filteredChildren && filteredChildren.length > 0)) {
                return {
                  ...node,
                  isOpen: true,
                  children: filteredChildren,
                };
              }
              return null;
            })
            .filter(Boolean) as CMSContentTreeItem[];
        };

        resolve(filterTree(this.contentTree));
      }, 40);
    });
  }

  public async getHeroBanner(): Promise<CMSHeroBannerData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.heroBanner), 40));
  }

  public async updateHeroBanner(data: Partial<CMSHeroBannerData>): Promise<CMSHeroBannerData> {
    this.heroBanner = { ...this.heroBanner, ...data };
    return this.heroBanner;
  }

  public async getSections(): Promise<CMSSectionItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.sections), 40));
  }

  public async toggleSection(id: string): Promise<CMSSectionItem[]> {
    this.sections = this.sections.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
    return this.sections;
  }

  public async getScheduledTimeline(): Promise<CMSScheduledTimelineItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.scheduledTimeline), 40));
  }

  public async getActivity(): Promise<CMSContentActivityItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.activity), 40));
  }

  public async getVersionHistory(): Promise<CMSVersionHistoryItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.versionHistory), 40));
  }

  public async getMediaUsage(): Promise<CMSMediaUsageItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.mediaUsage), 40));
  }
}

export const adminCMSManagementService = new AdminCMSManagementService();
