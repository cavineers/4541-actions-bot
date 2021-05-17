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
exports.getIssueContent = void 0;
const github = require("@actions/github");
const api_1 = require("./api");
const getIssueContent = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = new github.GitHub(token);
    let issue_number;
    if (api_1.getIssueNumber() !== undefined) {
        issue_number = api_1.getIssueNumber();
    }
    else if (api_1.getPrNumber() !== undefined) {
        issue_number = api_1.getPrNumber();
    }
    else {
        throw new Error('No Issue Provided');
    }
    const { data } = yield octokit.issues.get(Object.assign(Object.assign({}, api_1.getRepo()), { 
        // @ts-ignore
        issue_number }));
    return {
        title: data.title,
        body: data.body,
    };
});
exports.getIssueContent = getIssueContent;
//# sourceMappingURL=getIssue.js.map