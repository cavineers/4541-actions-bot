import * as core from '@actions/core';
import { GitHubRepository } from '../api/GitHub';
import { Labels } from '../api/Labels';

const checkKeywords = (
    parameters: { keywords: string[]; labels: string[] }[],
    content: string
): { keywords: string[]; labels: string[] }[] | null => {
    console.log('issue title:', content);

    const matchingKeywords: { keywords: string[]; labels: string[] }[] = [];

    parameters.forEach((obj) =>
        obj.keywords.forEach((keyword) => {
            if (RegExp(`(?!-)\\b${keyword.toLowerCase()}\\b(?!-)`, 'g').test(content.toLowerCase())) {
                matchingKeywords.push(obj);
            }
        })
    );

    if (matchingKeywords.length !== 0) {
        return matchingKeywords;
    }
    return null;
};

/**
 * Main execution of the entire system.
 * @returns The returned vals.
 */
async function run() {
    try {
        core.setOutput('labeled', false.toString());
        core.setOutput('assigned', false.toString());
        const token = core.getInput('github-token');
        const issueContent = await GitHubRepository.getIssueContent(token);
        const parameters: { keywords: string[]; labels: string[] }[] = JSON.parse(
            core.getInput('parameters', { required: true })
        );
        if (!parameters) {
            core.setFailed(
                `No parameters were found. Make sure your ".yml" file contains a "parameters" JSON array like this:`
            );
        }

        const matchingKeywords = checkKeywords(parameters, issueContent.title);

        if (matchingKeywords === null) {
            console.log('Keywords not included in this issue');
            return;
        }
        Labels.setIssueLabelOnKeyword(token, matchingKeywords); // Adds a label when a specific title is added.
        core.setOutput('labeled', true.toString());
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
