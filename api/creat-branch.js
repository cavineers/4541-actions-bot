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
    static createNewCommit(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const branch = yield this.GitHub.octokit
                .request(`GET /repos/{owner}/{repo}`, Object.assign({}, GitHub_1.GitHubRepository.getRepo()))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            console.log(branch);
            const lastCommitSHA = branch.object.sha;
            const { data: { tree }, } = yield this.GitHub.octokit
                .request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { commit_sha: lastCommitSHA }))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            const lastTreeSHA = tree.sha;
            const { data: { sha }, } = yield this.GitHub.octokit
                .request('POST /repos/{owner}/{repo}/git/trees', Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { base_tree: lastTreeSHA, tree: [
                    {
                        mode: 100644,
                    },
                ] }))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            const newTreeSHA = sha;
            console.log(sha);
            const newCommit = yield this.GitHub.octokit
                .request(`POST /repos/{owner}/{repo}/git/commits`, Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { message: message, tree: newTreeSHA, parents: [lastCommitSHA] }))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            yield this.GitHub.octokit
                .request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { ref: `refs/heads/${default_branch}`, sha: newCommit.sha }))
                .catch((error) => {
                console.error(error);
                core.error(error);
            });
            return yield newCommit.sha;
        });
    }
}
exports.Branches = Branches;
Branches.GitHub = new GitHub_1.GitHubRepository(core.getInput('github-token'));
