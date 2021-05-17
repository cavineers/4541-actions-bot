import * as github from '@actions/github';
import { getRepo, getIssueNumber, getPrNumber } from './api';

export const setIssueLabel = async (token: string, matchingKeywords: { keywords: string[]; labels: string[] }[]) => {
    const octokit = new github.GitHub(token);

    let issue_number;

    if (getIssueNumber() !== undefined) {
        issue_number = getIssueNumber();
    } else if (getPrNumber() !== undefined) {
        issue_number = getPrNumber();
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
        ...getRepo(),
        // @ts-ignore
        issue_number,
        labels: labels,
    });
};
