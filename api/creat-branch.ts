/* eslint-disable @typescript-eslint/no-var-requires */
import * as core from '@actions/core';
import { GitHubRepository } from './GitHub';

interface branchParams {
    ref: string;
    sha: string;
}

export class Branches {
    private static GitHub = new GitHubRepository(core.getInput('github-token'));

    public static async creatNewBranchReference(data: branchParams) {
        core.debug('Creating new branch');
        const {
            data: { html_url, number },
        } = await this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
            ...GitHubRepository.getRepo(),
            ref: data.ref,
            sha: data.sha,
        });
        console.log(`Branch created: ${html_url} (#${number})`);
        core.info(`Branch created: ${html_url} (#${number})`);
    }

    public static async createNewCommit(message: string) {
        const default_branch = await this.GitHub.octokit
            .request(`GET /repos/{owner}/{repo}`, {
                ...GitHubRepository.getRepo(),
            })
            .catch((error: any) => {
                console.error(error);
                core.error(error);
            });

        const DEFAULT_BRANCH = default_branch;

        console.log(DEFAULT_BRANCH);

        core.debug('Creating pull request');
        const data = await this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
            ...GitHubRepository.getRepo(),
            ref: DEFAULT_BRANCH,
        });

        const treeRef = await this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            ...GitHubRepository.getRepo(),
            tree_sha: data,
        });

        const msg = await this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/git/commits`, {
            ...GitHubRepository.getRepo(),
            message: message,
            tree: treeRef,
        });

        // eslint-disable-next-line no-return-await
        return await (<any>msg).sha;
    }
}
