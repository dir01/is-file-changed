import {exec} from '@actions/exec'

export default async function getDiff({
  baseSha: baseSha,
  headSha: headSha
}: {
  baseSha: string
  headSha: string
}): Promise<string[]> {
  const changedFiles: string[] = []
  await exec('git', ['diff', '--name-only', baseSha, headSha], {
    listeners: {
      stdout: data => {
        changedFiles.push(data.toString())
      }
    }
  })
  const changedFilesString = changedFiles.join('\n')

  return changedFilesString
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean)
}
