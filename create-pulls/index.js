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
const core = require("@actions/core");
const creat_branch_1 = require("../api/creat-branch");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.setOutput('PullRequestBegin', 'Creating new request');
            const inputs = {
                title: core.getInput('title'),
                body: core.getInput('body'),
                branch: core.getInput('branch').replace(/^refs\/heads\//, ''),
                path: core.getInput('path'),
                commitMessage: core.getInput('commit-message'),
                author: core.getInput('author'),
            };
            const commit = yield creat_branch_1.Branches.createNewCommit(inputs.commitMessage);
            const branchParams = {
                ref: `/refs/heads/${inputs.branch}`,
                sha: commit,
            };
            creat_branch_1.Branches.creatNewBranchReference(branchParams);
            core.setOutput('Finished', 'Finished creating new request');
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
