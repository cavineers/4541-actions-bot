/* eslint-disable dot-notation */
import * as core from '@actions/core';

interface Pull {
    number: number;
    html_url: string;
    created: boolean;
}

/**
 * Creates / updates a new pull request
 * @param inputs Required params for the pull request.
 * @param baseRepository Base repo for the pull request (branch).
 * @param headRepository Head / main repo for the request.
 * @returns Pull Request Info.
 */
export async function createOrUpdatePullRequest(
    inputs: any,
    baseRepository: string,
    headRepository: string
): Promise<Pull> {
    const [headOwner] = headRepository.split('/');
    const headBranch = `${headOwner}:${inputs.branch}`;

    // Create or update the pull request
    const pull = await this.createOrUpdate(inputs, baseRepository, headBranch);

    // Apply milestone
    if (inputs.milestone) {
        core.info(`Applying milestone '${inputs.milestone}'`);
        await this.octokit.rest.issues.update({
            ...this.parseRepository(baseRepository),
            issue_number: pull.number,
            milestone: inputs.milestone,
        });
    }
    // Apply labels
    if (inputs.labels.length > 0) {
        core.info(`Applying labels '${inputs.labels}'`);
        await this.octokit.rest.issues.addLabels({
            ...this.parseRepository(baseRepository),
            issue_number: pull.number,
            labels: inputs.labels,
        });
    }
    // Apply assignees
    if (inputs.assignees.length > 0) {
        core.info(`Applying assignees '${inputs.assignees}'`);
        await this.octokit.rest.issues.addAssignees({
            ...this.parseRepository(baseRepository),
            issue_number: pull.number,
            assignees: inputs.assignees,
        });
    }

    // Request reviewers and team reviewers
    const requestReviewersParams = {};
    if (inputs.reviewers.length > 0) {
        requestReviewersParams['reviewers'] = inputs.reviewers;
        core.info(`Requesting reviewers '${inputs.reviewers}'`);
    }
    if (inputs.teamReviewers.length > 0) {
        requestReviewersParams['team_reviewers'] = inputs.teamReviewers;
        core.info(`Requesting team reviewers '${inputs.teamReviewers}'`);
    }
    if (Object.keys(requestReviewersParams).length > 0) {
        try {
            await this.octokit.rest.pulls.requestReviewers({
                ...this.parseRepository(baseRepository),
                pull_number: pull.number,
                ...requestReviewersParams,
            });
        } catch (e) {
            //
        }
    }

    return pull;
}
