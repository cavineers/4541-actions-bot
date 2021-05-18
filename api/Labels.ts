import * as github from '@actions/github';
import { GitHubRepository } from './GitHub';

export class Labels extends GitHubRepository {
    /**
     * Adds labels to an issue or PR.
     * @param token GitHub secret token.
     * @param labels String array of labels.
     */
    public static async setLabels(token: string, labels: string[]) {
        const octokit = new github.GitHub(token);

        let issue_number;

        if (GitHubRepository.getIssueNumber() !== undefined) {
            issue_number = GitHubRepository.getIssueNumber();
        } else if (GitHubRepository.getPrNumber() !== undefined) {
            issue_number = GitHubRepository.getPrNumber();
        } else {
            throw new Error('No Issue Provided');
        }

        await octokit.issues.addLabels({
            ...GitHubRepository.getRepo(),
            // @ts-ignore
            issue_number,
            labels,
        });
    }

    /**
     * Adds labels to a GitHub issue based on a set of keywords.
     * @param token GitHub secret token.
     * @param matchingKeywords JSON obj which contains the keywords (string arr) and labels being added (str array)
     */
    public static async setIssueLabelOnKeyword(
        token: string,
        matchingKeywords: { keywords: string[]; labels: string[] }[]
    ) {
        const octokit = new github.GitHub(token);

        let issue_number;

        if (GitHubRepository.getIssueNumber() !== undefined) {
            issue_number = GitHubRepository.getIssueNumber();
        } else if (GitHubRepository.getPrNumber() !== undefined) {
            issue_number = GitHubRepository.getPrNumber();
        } else {
            throw new Error('No Issue Provided');
        }

        const labels: string[] = [];

        matchingKeywords.forEach((obj) => {
            obj.labels.forEach((label) => {
                labels.push(label);
            });
        });

        await octokit.issues.addLabels({
            ...GitHubRepository.getRepo(),
            // @ts-ignore
            issue_number,
            labels: labels,
        });
    }
}
