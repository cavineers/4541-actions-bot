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
const request_1 = require("@octokit/request");
class PullRequests {
    static createNewPullRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const default_branch = yield request_1.request(`GET /repos/{owner}/{repo}`, Object.assign({}, GitHub_1.GitHubRepository.getRepo())).catch((error) => {
                console.error(error);
                core.error(error);
            });
            const DEFAULT_BRANCH = default_branch;
            core.debug('Creating pull request');
            const pullReq = yield request_1.request(`POST /repos/{owner}/{repo}/pulls`, Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { title: this.inputs.title, body: this.inputs.body, head: this.inputs.branch, base: DEFAULT_BRANCH })).catch((error) => {
                console.error(error);
                core.error(error);
            });
        });
    }
}
exports.PullRequests = PullRequests;
PullRequests.inputs = {
    title: core.getInput('title'),
    body: core.getInput('body'),
    branch: core.getInput('branch').replace(/^refs\/heads\//, ''),
    path: core.getInput('path'),
    commitMessage: core.getInput('commit-message'),
    author: core.getInput('author'),
};
