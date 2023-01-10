import filterFilePaths from '../src/filter'
import {expect, test} from '@jest/globals'

test.each([
  {
    filepaths: [
      'a/b/c.txt', // included includeGlob
      'a/b/d.mp3', // not included by includeGlob or includeRegex
      'a/b/q.txt', // excluded by excludeGlob
      'a/b/qq.mp3', // included by includeRegex
      'a/b/x.txt' // excluded by excludeRegex
    ],
    includeGlobs: ['a/b/*.txt'],
    excludeGlobs: ['a/b/q.*'],
    includeRegexes: ['^a/b/\\w{2}.mp3$'],
    excludeRegexes: ['^a/b/x.txt$'],
    expected: ['a/b/c.txt', 'a/b/qq.mp3']
  },
  {
    filepaths: [
      'services/test/dev_777.json',
      'services/test/dev_888.json',
      'README.md'
    ],
    excludeGlobs: ['services/*/dev_???.json', ''],
    includeGlobs: [''],
    includeRegexes: [''],
    excludeRegexes: [''],
    expected: ['README.md']
  }
])('filterFilePaths', async ({expected, ...params}) => {
  const filtered = filterFilePaths(params)
  expect(filtered).toEqual(expected)
})
