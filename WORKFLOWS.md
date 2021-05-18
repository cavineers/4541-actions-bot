# 4541 Actions Bot Workflow List
The following are actions and commands which can be used from this repository:

### [Automatically Add Bug Labels](/add-bug-label/action.yml)
Purpose - Automatically add the 'Bug' label to issues when the title starts with `fix` as apart of the organizations contributing, styling, and naming conventions.

Parameters - JSON array of keywords to look for and labels to be set when there's a keyword match.

Example Implementation:
```yml
steps:
      - name: Checkout Actions
        uses: actions/checkout@v2
        with:
          repository: "cavineers/4541-actions-bot"
          ref: main
          path: ./actions
      - name: Install Actions
        run: npm install --production --prefix ./actions
      - name: Run Action
        uses: ./actions/add-bug-label
        with:
          parameters: '[ {"keywords": ["fix"], "labels": ["BUG"]}]'
          github-token: "${{ secrets.GITHUB_TOKEN }}"
```