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
exports.GitHubRepository = void 0;
const github = require("@actions/github");
class GitHubRepository {
    static getIssueContent(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = new github.GitHub(token);
            let issue_number;
            if (GitHubRepository.getIssueNumber() !== undefined) {
                issue_number = GitHubRepository.getIssueNumber();
            }
            else if (GitHubRepository.getPrNumber() !== undefined) {
                issue_number = GitHubRepository.getPrNumber();
            }
            else {
                throw new Error('No Issue Provided');
            }
            const { data } = yield octokit.issues.get(Object.assign(Object.assign({}, GitHubRepository.getRepo()), { issue_number }));
            return {
                title: data.title,
                body: data.body,
            };
        });
    }
}
exports.GitHubRepository = GitHubRepository;
GitHubRepository.getPrNumber = () => {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }
    return pullRequest.number;
};
GitHubRepository.getIssueNumber = () => {
    const { issue } = github.context.payload;
    if (!issue) {
        return undefined;
    }
    return issue.number;
};
GitHubRepository.getRepo = () => {
    const { repo } = github.context;
    return repo;
};
