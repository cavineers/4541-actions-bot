/* eslint-disable @typescript-eslint/no-var-requires */
import * as github from '@actions/github';
import * as core from '@actions/core';
import { GitHubRepository } from './GitHub';

export class PullRequests {
    private static GitHub = new GitHubRepository(core.getInput('github-token'));

    private static inputs = {
        title: core.getInput('title'),
        body: core.getInput('body'),
        branch: core.getInput('branch').replace(/^refs\/heads\//, ''),
        path: core.getInput('path'),
        commitMessage: core.getInput('commit-message'),
        author: core.getInput('author'),
    };

    public static async createNewPullRequest() {
        const default_branch = await this.GitHub.octokit
            .request(`GET /repos/{owner}/{repo}`, {
                ...GitHubRepository.getRepo(),
            })
            .catch((error: any) => {
                console.error(error);
                core.error(error);
            });

        const DEFAULT_BRANCH = default_branch;

        core.debug('Creating pull request');
        const pullReq = await this.GitHub.octokit
            .request(`POST /repos/{owner}/{repo}/pulls`, {
                ...GitHubRepository.getRepo(),
                title: this.inputs.title,
                body: this.inputs.body,
                head: this.inputs.branch,
                base: DEFAULT_BRANCH,
            })
            .catch((error: any) => {
                console.error(error);
                core.error(error);
            });
    }
}
