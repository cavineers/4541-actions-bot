import * as github from '@actions/github';

export class GitHubRepository {
    public octokit;

    constructor(token: string) {
        this.octokit = new github.GitHub(token);
    }

    /**
     * Gets the languages of the given repo.
     * @returns Returns the number of bytes written per language.
     */
    public async getRepoLanguages() {
        const languages = await this.octokit.request('GET /repos/{owner}/{repo}/languages', {
            ...GitHubRepository.getRepo(),
        });
        return languages;
    }

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
}
