import getDiff from '../src/diff'
import {test, expect} from '@jest/globals'
import fs from 'fs'
import child_process from 'child_process'
import {withGitRepo} from '../src/testutils'
import path from 'path'

test('getDiff', () => {
  withGitRepo(async () => {
    const initialCommitSha = child_process
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()

    const createdFiles: string[] = []
    // 1000 is to test for a bug where lines were sometimes split mid-line
    for (let i = 0; i < 1000; i++) {
      const fname = path.join(
        'foo'.repeat(randInt(3)),
        'bar'.repeat(randInt(3)),
        'baz'.repeat(randInt(3)),
        `file${i}.txt`
      )
      createdFiles.push(fname)

      const dirname = path.dirname(fname)
      fs.mkdirSync(dirname, {recursive: true})
      fs.writeFileSync(fname, 'test')
    }
    child_process.execSync('git add .')
    child_process.execSync('git commit -m "second commit"')
    const secondCommitSha = child_process
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()

    const changedFiles = await getDiff({
      baseSha: initialCommitSha,
      headSha: secondCommitSha
    })

    expect(changedFiles.sort()).toEqual(createdFiles.sort())
  })
})

function randInt(max: number): number {
  return Math.floor(Math.random() * max)
}
