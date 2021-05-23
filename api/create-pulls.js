"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PullRequests = void 0;
const core = require("@actions/core");
const GitHub_1 = require("./GitHub");
class PullRequests {
    static createNewPullRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const default_branch = yield this.GitHub.octokit
                .request(`GET /repos/{owner}/{repo}`, Object.assign({}, GitHub_1.GitHubRepository.getRepo()))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            const DEFAULT_BRANCH = default_branch;
            core.debug('Creating pull request');
            const { data: { html_url, number }, } = yield this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/pulls`, Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { title: this.inputs.title, body: this.inputs.body, head: this.inputs.branch, base: DEFAULT_BRANCH }));
            console.log(`Pull request created: ${html_url} (#${number})`);
            core.info(`Pull request created: ${html_url} (#${number})`);
        });
    }
}
exports.PullRequests = PullRequests;
PullRequests.GitHub = new GitHub_1.GitHubRepository(core.getInput('github-token'));
PullRequests.inputs = {
    title: core.getInput('title'),
    body: core.getInput('body'),
    branch: core.getInput('branch').replace(/^refs\/heads\//, ''),
    path: core.getInput('path'),
    commitMessage: core.getInput('commit-message'),
    author: core.getInput('author'),
};
