import {exec, getExecOutput} from '@actions/exec'

export default async function getDiff({
  baseSha: baseSha,
  headSha: headSha
}: {
  baseSha: string
  headSha: string
}): Promise<string[]> {
  const execOut = await getExecOutput(
    'git',
    ['diff', '--name-only', baseSha, headSha],
    {silent: true}
  )
  const changedFilesString = execOut.stdout

  return changedFilesString
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean)
}
