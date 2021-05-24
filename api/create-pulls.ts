/* eslint-disable @typescript-eslint/no-var-requires */
import * as core from '@actions/core';
import { GitHubRepository } from './GitHub';

interface pullParams {
    title: string;
    body: string;
    branch: string;
    path: string;
    commitMessage: string;
    author: string;
}
export class PullRequests {
    private static GitHub = new GitHubRepository(core.getInput('github-token'));

    public static async createNewPullRequest(data: pullParams) {
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
        const {
            data: { html_url, number },
        } = await this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/pulls`, {
            ...GitHubRepository.getRepo(),
            title: data.title,
            body: data.body,
            head: data.branch,
            base: DEFAULT_BRANCH,
        });
        console.log(`Pull request created: ${html_url} (#${number})`);
        core.info(`Pull request created: ${html_url} (#${number})`);
    }
}
