import fs from 'fs'
import child_process from 'child_process'
import path from 'path'
import os from 'os'

export function withGitRepo(callback: () => Promise<void>): void {
  const originalCwd = process.cwd()
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'is-file-changed-getDiff')
  )

  process.chdir(tempDir)

  child_process.execSync('git init')
  fs.writeFileSync('file_1', '')
  child_process.execSync('git add file_1')
  child_process.execSync('git commit -m "initial commit"')

  callback().finally(() => {
    fs.rmdirSync(tempDir, {recursive: true})
    process.chdir(originalCwd)
  })
}
