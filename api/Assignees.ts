import * as github from '@actions/github';
import { GitHubRepository } from './GitHub';

export class Assignees extends GitHubRepository {
    /**
     * Sets contributors to issues or pull requests.
     * @param token GitHub secret token.
     * @param assignees Array of contributors to be assigned to the issue or PR.
     */
    public static async setIssueAssignee(token: string, assignees: string[]) {
        const octokit = new github.GitHub(token);

        let issue_number;

        if (GitHubRepository.getIssueNumber() !== undefined) {
            issue_number = GitHubRepository.getIssueNumber();
        } else if (GitHubRepository.getPrNumber() !== undefined) {
            issue_number = GitHubRepository.getPrNumber();
        } else {
            throw new Error('No Issue Provided');
        }

        await octokit.issues.addAssignees({
            ...GitHubRepository.getRepo(),
            // @ts-ignore
            issue_number,
            assignees,
        });
    }
}
