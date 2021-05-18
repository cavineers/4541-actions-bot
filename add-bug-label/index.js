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
const GitHub_1 = require("../api/GitHub");
const Labels_1 = require("../api/Labels");
const checkKeywords = (parameters, content) => {
    console.log('issue title:', content);
    const matchingKeywords = [];
    parameters.forEach((obj) => obj.keywords.forEach((keyword) => {
        if (RegExp(`(?!-)\\b${keyword.toLowerCase()}\\b(?!-)`, 'g').test(content.toLowerCase())) {
            matchingKeywords.push(obj);
        }
    }));
    if (matchingKeywords.length !== 0) {
        return matchingKeywords;
    }
    return null;
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.setOutput('labeled', false.toString());
            core.setOutput('assigned', false.toString());
            const token = core.getInput('github-token');
            const issueContent = yield GitHub_1.GitHubRepository.getIssueContent(token);
            const parameters = JSON.parse(core.getInput('parameters', { required: true }));
            if (!parameters) {
                core.setFailed(`No parameters were found. Make sure your ".yml" file contains a "parameters" JSON array like this:`);
            }
            const matchingKeywords = checkKeywords(parameters, issueContent.title);
            if (matchingKeywords === null) {
                console.log('Keywords not included in this issue');
                return;
            }
            Labels_1.Labels.setIssueLabelOnKeyword(token, matchingKeywords);
            core.setOutput('labeled', true.toString());
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
