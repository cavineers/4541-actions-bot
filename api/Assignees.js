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
exports.Assignees = void 0;
const github = require("@actions/github");
const GitHub_1 = require("./GitHub");
class Assignees extends GitHub_1.GitHubRepository {
    static setIssueAssignee(token, assignees) {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = new github.GitHub(token);
            let issue_number;
            if (GitHub_1.GitHubRepository.getIssueNumber() !== undefined) {
                issue_number = GitHub_1.GitHubRepository.getIssueNumber();
            }
            else if (GitHub_1.GitHubRepository.getPrNumber() !== undefined) {
                issue_number = GitHub_1.GitHubRepository.getPrNumber();
            }
            else {
                throw new Error('No Issue Provided');
            }
            yield octokit.issues.addAssignees(Object.assign(Object.assign({}, GitHub_1.GitHubRepository.getRepo()), { issue_number,
                assignees }));
        });
    }
}
exports.Assignees = Assignees;
