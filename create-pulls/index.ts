import * as core from '@actions/core';
import { PullRequests } from '../api/create-pulls';

/**
 * Creates a new pull request.
 */
async function run() {
    try {
        core.setOutput('PullRequestBegin', 'Creating new request');
        PullRequests.createNewPullRequest();
        core.setOutput('Finished', 'Finished creating new request');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
