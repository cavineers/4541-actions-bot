"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepo = exports.getIssueNumber = exports.getPrNumber = void 0;
const github = require("@actions/github");
const getPrNumber = () => {
    const pullRequest = github.context.payload.pull_request;
    if (!pullRequest) {
        return undefined;
    }
    return pullRequest.number;
};
exports.getPrNumber = getPrNumber;
const getIssueNumber = () => {
    const { issue } = github.context.payload;
    if (!issue) {
        return undefined;
    }
    return issue.number;
};
exports.getIssueNumber = getIssueNumber;
const getRepo = () => {
    const { repo } = github.context;
    return repo;
};
exports.getRepo = getRepo;
//# sourceMappingURL=api.js.map