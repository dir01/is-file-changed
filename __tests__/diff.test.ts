import getDiff from '../src/diff'
import {test, expect} from '@jest/globals'
import fs from 'fs'
import child_process from 'child_process'
import {withGitRepo} from '../src/testutils'

test('getDiff', () => {
  withGitRepo(async () => {
    const initialCommitSha = child_process
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()

    fs.writeFileSync('file_2', 'test')
    fs.writeFileSync('file_3', 'test')
    child_process.execSync('git add file_2 file_3')
    child_process.execSync('git commit -m "second commit"')
    const secondCommitSha = child_process
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()

    const changedFiles = await getDiff({
      baseSha: initialCommitSha,
      headSha: secondCommitSha
    })

    expect(changedFiles).toMatchInlineSnapshot(`
      [
        "file_2",
        "file_3",
      ]
    `)
  })
})
