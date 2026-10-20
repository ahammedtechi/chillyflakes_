export function normalizeCategoryName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
    .replace(/\s+/g, '')
    .replace(/ies$/, 'y')
    .replace(/es$/, '')
    .replace(/s$/, '');
}

export interface CategoryMatchResult {
  id: string;
  name: string;
  isExact: boolean;
}

export function findSimilarCategories(
  input: string,
  categories: { id: string; name: string }[]
): CategoryMatchResult[] {
  const trimmed = input.trim();
  if (trimmed.length < 2) return [];

  const normInput = normalizeCategoryName(trimmed);
  if (!normInput) return [];

  const matches: CategoryMatchResult[] = [];

  for (const cat of categories) {
    if (cat.id === 'other') continue;

    const normCat = normalizeCategoryName(cat.name);

    // 1. Exact match (case, whitespace, and plural insensitive)
    if (normInput === normCat) {
      matches.unshift({ id: cat.id, name: cat.name, isExact: true });
      continue;
    }

    // 2. Starts with / Substring match
    if (normCat.includes(normInput) || normInput.includes(normCat)) {
      matches.push({ id: cat.id, name: cat.name, isExact: false });
      continue;
    }

    // 3. Word-by-word match (e.g. "fashion" in "Clothes & Fashion")
    const words = cat.name.toLowerCase().split(/[\s&,-]+/);
    const inputWords = trimmed.toLowerCase().split(/[\s&,-]+/);
    const hasWordMatch = inputWords.some((iw) =>
      words.some((w) => normalizeCategoryName(w) === normalizeCategoryName(iw) && iw.length >= 3)
    );

    if (hasWordMatch) {
      matches.push({ id: cat.id, name: cat.name, isExact: false });
    }
  }

  // Deduplicate and cap to 3 suggestions
  const seen = new Set<string>();
  const uniqueMatches: CategoryMatchResult[] = [];

  for (const m of matches) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      uniqueMatches.push(m);
      if (uniqueMatches.length >= 3) break;
    }
  }

  return uniqueMatches;
}

export const CATEGORY_NAME_REGEX = /^[a-zA-Z0-9\s&-]{3,50}$/;

export function isValidCategoryString(val: string): boolean {
  const trimmed = val.trim();
  if (trimmed.length < 3 || trimmed.length > 50) return false;
  return CATEGORY_NAME_REGEX.test(trimmed);
}
