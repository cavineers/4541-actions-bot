import * as core from '@actions/core';
import * as github from '@actions/github';
import * as path from 'path';

export class GitHubRepository {
    /**
     * When referencing a GitHub pull request in an action
     * this method returns the pull request's GitHub number.
     * @returns The GitHub PullRequest Number.
     */
    public static getPrNumber = (): number | undefined => {
        const pullRequest = github.context.payload.pull_request;
        if (!pullRequest) {
            return undefined;
        }

        return pullRequest.number;
    };

    /**
     * When referencing a GitHub issue in an action
     * this method returns the issue's GitHub number.
     * @returns The GitHub Issue Number.
     */
    public static getIssueNumber = (): number | undefined => {
        const { issue } = github.context.payload;
        if (!issue) {
            return undefined;
        }

        return issue.number;
    };

    /**
     * Gets the title and body content of an issue.
     * @param token GitHub secret token.
     * @returns Title and body content of the issue.
     */
    public static async getIssueContent(token: string) {
        const octokit = new github.GitHub(token);

        let issue_number;

        if (GitHubRepository.getIssueNumber() !== undefined) {
            issue_number = GitHubRepository.getIssueNumber();
        } else if (GitHubRepository.getPrNumber() !== undefined) {
            issue_number = GitHubRepository.getPrNumber();
        } else {
            throw new Error('No Issue Provided');
        }

        const { data } = await octokit.issues.get({
            ...GitHubRepository.getRepo(),
            // @ts-ignore
            issue_number,
        });
        return {
            title: data.title,
            body: data.body,
        };
    }

    /**
     * Gets the GitHub repository where the action was called.
     * @returns The GitHub repository owner and key.
     */
    public static getRepo = (): { owner: string; repo: string } => {
        const { repo } = github.context;
        return repo;
    };

    /**
     * Gets the repo details.
     * @param remoteUrl Repository URL
     * @returns Repository Details
     */
    public static getRemoteDetail(remoteUrl: string) {
        const githubUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';

        const githubServerMatch = githubUrl.match(/^https?:\/\/(.+)$/i);
        if (!githubServerMatch) {
            throw new Error('Could not parse GitHub Server name');
        }

        const httpsUrlPattern = new RegExp(`^https?://.*@?${githubServerMatch[1]}/(.+/.+)$`, 'i');
        const sshUrlPattern = new RegExp(`^git@${githubServerMatch[1]}:(.+/.+).git$`, 'i');

        const httpsMatch = remoteUrl.match(httpsUrlPattern);
        if (httpsMatch) {
            return {
                protocol: 'HTTPS',
                repository: httpsMatch[1],
            };
        }

        const sshMatch = remoteUrl.match(sshUrlPattern);
        if (sshMatch) {
            return {
                protocol: 'SSH',
                repository: sshMatch[1],
            };
        }

        throw new Error(`The format of '${remoteUrl}' is not a valid GitHub repository URL`);
    }

    /**
     * Gets the requested repository URL.
     * @param protocol Proc Type
     * @param repository Repository Name
     * @returns Repository URL
     */
    public static getRemoteUrl(protocol: string, repository: string): string {
        return protocol === 'HTTPS' ? `https://github.com/${repository}` : `git@github.com:${repository}.git`;
    }

    /**
     * Creates new random ID.
     * @returns Random ID.
     */
    public static randomString(): string {
        return Math.random().toString(36).substr(2, 7);
    }

    /**
     * Gets the relative path of the repository.
     * @param relativePath Relative path.
     * @returns The path to the repo.
     */
    public static getRepoPath(relativePath?: string): string {
        let githubWorkspacePath = process.env.GITHUB_WORKSPACE;
        if (!githubWorkspacePath) {
            throw new Error('GITHUB_WORKSPACE not defined');
        }
        githubWorkspacePath = path.resolve(githubWorkspacePath);
        core.debug(`githubWorkspacePath: ${githubWorkspacePath}`);

        let repoPath = githubWorkspacePath;
        if (relativePath) repoPath = path.resolve(repoPath, relativePath);

        core.debug(`repoPath: ${repoPath}`);
        return repoPath;
    }
}
