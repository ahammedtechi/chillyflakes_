import { useState, useEffect, useMemo } from 'react';
import type { Product } from '../types';

/**
 * Returns a deterministic numeric seed based on the calendar date (YYYYMMDD).
 */
export function getDailySeed(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year * 10000 + month * 100 + day;
}

/**
 * High-quality 32-bit PRNG (Mulberry32) seeded by an integer.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles an array based on a seed.
 */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Interleaves products across categories using the day's seed
 * so that Row 1 and Row 2 have diverse product types with no category repetition.
 */
function getInterleavedDailyProducts(products: Product[], date: Date): Product[] {
  if (products.length === 0) return [];

  const seed = getDailySeed(date);

  // Group products by category
  const categories: Record<string, Product[]> = {};
  for (const product of products) {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  }

  const catNames = Object.keys(categories);
  // Deterministically shuffle the category rotation order for this day
  const shuffledCatNames = seededShuffle(catNames, seed + 101);

  // Deterministically shuffle items inside each category for this day
  for (const cat of catNames) {
    categories[cat] = seededShuffle(categories[cat], seed + cat.charCodeAt(0) * 17);
  }

  // Interleave in round-robin fashion
  const result: Product[] = [];
  let added = true;
  let round = 0;
  while (added) {
    added = false;
    for (const cat of shuffledCatNames) {
      if (round < categories[cat].length) {
        result.push(categories[cat][round]);
        added = true;
      }
    }
    round++;
  }

  return result;
}

/**
 * Returns the daily rotation of 5 "Featured" products and 5 "Trending" products.
 * If a specific category filter is active, it rotates products within that category.
 * When new products are added to the catalog, they are seamlessly incorporated.
 */
export function getDailyFeaturedAndTrending(
  products: Product[],
  selectedCategory: string,
  date: Date = new Date()
): { featured: Product[]; trending: Product[] } {
  if (products.length === 0) {
    return { featured: [], trending: [] };
  }

  const isAll = selectedCategory === 'All' || selectedCategory === 'Services';

  if (!isAll) {
    const filtered = products.filter((p) => p.category === selectedCategory);
    if (filtered.length === 0) {
      return { featured: [], trending: [] };
    }

    const seed = getDailySeed(date);
    const shuffled = seededShuffle(filtered, seed);

    return {
      featured: shuffled.slice(0, 5),
      trending: shuffled.length > 5 ? shuffled.slice(5, 10) : shuffled.slice(0, 5),
    };
  }

  // Interleaved across all categories for rich diversity
  const interleaved = getInterleavedDailyProducts(products, date);

  const featured = interleaved.slice(0, 5);
  const trending = interleaved.slice(5, 10);

  return { featured, trending };
}

/**
 * Custom React hook that provides the daily rotated products and
 * automatically refreshes at midnight every day.
 */
export function useDailyProducts(products: Product[], selectedCategory: string) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Automatically refresh when midnight strikes or when user returns to tab
  useEffect(() => {
    const scheduleMidnightUpdate = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        2 // 2 seconds past midnight to ensure day rollover
      );
      const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

      const timer = setTimeout(() => {
        setCurrentDate(new Date());
        scheduleMidnightUpdate();
      }, msUntilMidnight);

      return timer;
    };

    const timer = scheduleMidnightUpdate();

    // Also check on tab focus if the day has changed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const todaySeed = getDailySeed(new Date());
        const activeSeed = getDailySeed(currentDate);
        if (todaySeed !== activeSeed) {
          setCurrentDate(new Date());
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentDate]);

  return useMemo(() => {
    return getDailyFeaturedAndTrending(products, selectedCategory, currentDate);
  }, [products, selectedCategory, currentDate]);
}
