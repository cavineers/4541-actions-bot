import * as core from '@actions/core';
import { PullRequests } from '../api/create-pulls';
import { Branches } from '../api/creat-branch';

/**
 * Creates a new pull request.
 */
async function run() {
    try {
        core.setOutput('PullRequestBegin', 'Creating new request');
        const inputs = {
            title: core.getInput('title'),
            body: core.getInput('body'),
            branch: core.getInput('branch').replace(/^refs\/heads\//, ''),
            path: core.getInput('path'),
            commitMessage: core.getInput('commit-message'),
            author: core.getInput('author'),
        };

        const commit = await Branches.createNewCommit(inputs.commitMessage);
        const branchParams = {
            ref: `heads/${inputs.branch}`,
            sha: commit,
        };

        Branches.creatNewBranchReference(branchParams);
        // PullRequests.createNewPullRequest(inputs);
        core.setOutput('Finished', 'Finished creating new request');
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
