import * as core from '@actions/core'
import {context} from '@actions/github'
import getDiff from './diff'
import filterFilePaths from './filter'

async function run(): Promise<void> {
  try {
    const baseSha = context.payload.pull_request?.base.sha
    const headSha = context.payload.pull_request?.head.sha

    const changedFiles = await getDiff({baseSha, headSha})

    const filteredChangedFiles = filterFilePaths({
      filepaths: changedFiles,
      includeGlobs: core.getInput('include_glob').split('\n'),
      excludeGlobs: core.getInput('exclude_glob').split('\n'),
      includeRegexes: core.getInput('include_regex').split('\n'),
      excludeRegexes: core.getInput('exclude_regex').split('\n')
    })

    core.setOutput('result', filteredChangedFiles.length > 0)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
