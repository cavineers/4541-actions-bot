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

    private static getHeadReference() {
        const default_branch: any = this.GitHub.octokit
            .request(`GET /repos/{owner}/{repo}`, {
                ...GitHubRepository.getRepo(),
            })
            .then(() => {
                const DEFAULT_BRANCH = default_branch;
                return this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
                    ...GitHubRepository.getRepo(),
                    ref: DEFAULT_BRANCH,
                });
            })
            .catch((error: any) => {
                console.error(error);
                core.error(error);
            });
    }

    public static async createNewCommit(data: string) {
        const mainRef = await (<any>this.getHeadReference()).object.sha;

        const treeRef = await this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            ...GitHubRepository.getRepo(),
            tree_sha: mainRef,
        });

        const msg = await this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/git/commits`, {
            ...GitHubRepository.getRepo(),
            message: data,
            tree: treeRef,
        });
        return (<any>msg).sha;
    }
}
