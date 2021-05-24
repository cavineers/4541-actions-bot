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
exports.Branches = void 0;
const core = require("@actions/core");
const GitHub_1 = require("./GitHub");
class Branches {
    static creatNewBranchReference(data) {
        return __awaiter(this, void 0, void 0, function* () {
            core.debug('Creating new branch');
            const { data: { html_url, number }, } = yield this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/git/refs`, Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { ref: data.ref, sha: data.sha }));
            console.log(`Branch created: ${html_url} (#${number})`);
            core.info(`Branch created: ${html_url} (#${number})`);
        });
    }
    static getHeadReference() {
        const default_branch = this.GitHub.octokit
            .request(`GET /repos/{owner}/{repo}`, Object.assign({}, GitHub_1.GitHubRepository.getRepo()))
            .then(() => {
            const DEFAULT_BRANCH = default_branch;
            console.log(DEFAULT_BRANCH);
            return this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { ref: DEFAULT_BRANCH }));
        })
            .catch((error) => {
            console.error(error);
            core.error(error);
        });
    }
    static createNewCommit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainRef = yield this.getHeadReference().object.sha;
            const treeRef = yield this.GitHub.octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { tree_sha: mainRef }));
            const msg = yield this.GitHub.octokit.request(`POST /repos/{owner}/{repo}/git/commits`, Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { message: data, tree: treeRef }));
            return msg.sha;
        });
    }
}
exports.Branches = Branches;
Branches.GitHub = new GitHub_1.GitHubRepository(core.getInput('github-token'));
