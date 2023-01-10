import minimatch from 'minimatch'

export default function filterFilePaths({
  filepaths,
  includeGlobs,
  excludeGlobs,
  includeRegexes,
  excludeRegexes
}: {
  filepaths: string[]
  includeGlobs: string[]
  excludeGlobs: string[]
  includeRegexes: string[]
  excludeRegexes: string[]
}): string[] {
  if (!includeGlobs && !excludeGlobs && !includeRegexes && !excludeRegexes) {
    return filepaths
  }
  if (!filepaths) {
    return filepaths
  }

  let includeGlobMatchers: minimatch.Minimatch[]
  let excludeGlobMatchers: minimatch.Minimatch[]
  let includeRegexMatchers: RegExp[]
  let excludeRegexMatchers: RegExp[]

  if (includeGlobs && includeGlobs.length > 0) {
    includeGlobMatchers = includeGlobs.map(
      glob => new minimatch.Minimatch(glob)
    )
  }
  if (excludeGlobs && excludeGlobs.length > 0) {
    excludeGlobMatchers = excludeGlobs.map(
      glob => new minimatch.Minimatch(glob)
    )
  }
  if (includeRegexes && includeRegexes.length > 0) {
    includeRegexMatchers = includeRegexes.map(regex => new RegExp(regex))
  }
  if (excludeRegexes && excludeRegexes.length > 0) {
    excludeRegexMatchers = excludeRegexes.map(regex => new RegExp(regex))
  }

  const predicate = (filepath: string): Boolean => {
    if (excludeGlobMatchers && excludeGlobMatchers.length > 0) {
      if (excludeGlobMatchers.some(matcher => matcher.match(filepath))) {
        return false
      }
    }

    if (excludeRegexMatchers && excludeRegexMatchers.length > 0) {
      if (excludeRegexMatchers.some(matcher => matcher.test(filepath))) {
        return false
      }
    }

    const hasIncludeGlob = includeGlobMatchers && includeGlobMatchers.length > 0
    const hasIncludeRegex =
      includeRegexMatchers && includeRegexMatchers.length > 0
    let isIncludedByGlob = false
    let isIncludedByRegex = false

    if (hasIncludeGlob) {
      if (includeGlobMatchers.some(matcher => matcher.match(filepath))) {
        isIncludedByGlob = true
      }
    }

    if (hasIncludeRegex) {
      if (includeRegexMatchers.some(matcher => matcher.test(filepath))) {
        isIncludedByRegex = true
      }
    }

    if (!hasIncludeGlob && !hasIncludeRegex) {
      return true
    }

    if (
      (hasIncludeGlob && isIncludedByGlob) ||
      (hasIncludeRegex && isIncludedByRegex)
    ) {
      return true
    }

    return false
  }

  return filepaths.filter(predicate)
}
