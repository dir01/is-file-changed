import * as core from '@actions/core'
import {context} from '@actions/github'
import getDiff from './diff'
import filterFilePaths from './filter'

async function run(): Promise<void> {
  try {
    const baseSha = context.payload.pull_request?.base.sha
    const headSha = context.payload.pull_request?.head.sha

    const includeGlobs = core.getInput('include_glob').split('\n')
    const excludeGlobs = core.getInput('exclude_glob').split('\n')
    const includeRegexes = core.getInput('include_regex').split('\n')
    const excludeRegexes = core.getInput('exclude_regex').split('\n')

    core.debug(
      `inputs: ${JSON.stringify(
        {includeGlobs, excludeGlobs, includeRegexes, excludeRegexes},
        undefined,
        2
      )}`
    )

    const filepaths = await getDiff({baseSha, headSha})

    core.debug(
      `Changed files before applying filters: ${JSON.stringify(
        filepaths,
        undefined,
        2
      )}`
    )

    const filteredChangedFiles = filterFilePaths({
      filepaths,
      includeGlobs,
      excludeGlobs,
      includeRegexes,
      excludeRegexes
    })

    core.debug(
      `Changed files after applying filters: ${JSON.stringify(
        filteredChangedFiles,
        undefined,
        2
      )}`
    )

    core.setOutput('result', filteredChangedFiles.length > 0)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
