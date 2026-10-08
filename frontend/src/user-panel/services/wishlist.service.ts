/**
 * Unified Wishlist Service for Traveler Panel
 * Manages saved packages, destinations, and favorites in localStorage
 * Dispatches synchronization events so UI components update reactively.
 */

export interface SavedPackageItem {
  id: string;
  title: string;
  agency?: string;
  duration?: string;
  price: string;
  image: string;
  savedAt?: string;
}

export interface SavedDestinationItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  rating?: number | string;
  savedAt?: string;
}

const PACKAGES_KEY = 'apnatrip_saved_packages';
const DESTINATIONS_KEY = 'apnatrip_saved_destinations';
const WISHLIST_EVENT = 'apnatrip_wishlist_updated';

class WishlistService {
  // PACKAGES
  getSavedPackages(): SavedPackageItem[] {
    try {
      const data = localStorage.getItem(PACKAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isPackageSaved(id: string): boolean {
    if (!id) return false;
    const items = this.getSavedPackages();
    return items.some((item) => String(item.id) === String(id));
  }

  toggleSavePackage(pkg: SavedPackageItem): boolean {
    if (!pkg || !pkg.id) return false;
    const items = this.getSavedPackages();
    const index = items.findIndex((item) => String(item.id) === String(pkg.id));

    let isSavedNow = false;
    if (index >= 0) {
      items.splice(index, 1);
      isSavedNow = false;
    } else {
      items.unshift({
        ...pkg,
        savedAt: new Date().toISOString(),
      });
      isSavedNow = true;
    }

    try {
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { type: 'package', id: pkg.id, isSaved: isSavedNow } }));
    } catch (err) {
      console.warn('Failed to save package to wishlist:', err);
    }

    return isSavedNow;
  }

  removePackage(id: string): void {
    if (!id) return;
    const items = this.getSavedPackages().filter((item) => String(item.id) !== String(id));
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { type: 'package', id, isSaved: false } }));
  }

  // DESTINATIONS
  getSavedDestinations(): SavedDestinationItem[] {
    try {
      const data = localStorage.getItem(DESTINATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isDestinationSaved(id: string): boolean {
    if (!id) return false;
    const items = this.getSavedDestinations();
    return items.some((item) => String(item.id) === String(id));
  }

  toggleSaveDestination(dest: SavedDestinationItem): boolean {
    if (!dest || !dest.id) return false;
    const items = this.getSavedDestinations();
    const index = items.findIndex((item) => String(item.id) === String(dest.id));

    let isSavedNow = false;
    if (index >= 0) {
      items.splice(index, 1);
      isSavedNow = false;
    } else {
      items.unshift({
        ...dest,
        savedAt: new Date().toISOString(),
      });
      isSavedNow = true;
    }

    try {
      localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { type: 'destination', id: dest.id, isSaved: isSavedNow } }));
    } catch (err) {
      console.warn('Failed to save destination to wishlist:', err);
    }

    return isSavedNow;
  }

  removeDestination(id: string): void {
    if (!id) return;
    const items = this.getSavedDestinations().filter((item) => String(item.id) !== String(id));
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { type: 'destination', id, isSaved: false } }));
  }
}

export const wishlistService = new WishlistService();
