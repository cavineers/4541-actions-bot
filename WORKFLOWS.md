# 4541 Actions Bot Workflow List
The following are actions and commands which can be used from this repository:

### [Automatically Add Labels](/auto-add-labels/action.yml)
Purpose - Automatically add labels to issues which follow the standard naming convention as apart of the organizations contributing, styling, and issue naming conventions.

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
        uses: ./actions/auto-add-labels
        with:
          parameters: '[ {"keywords": ["fix"], "labels": ["BUG"]}, {"keywords": ["feat"], "labels": ["ENHANCEMENT"]}, {"keywords": ["perf"], "labels": ["OPTIMIZATIONS"]}, {"keywords": ["deps"], "labels": ["DEPENDENCIES"]}, {"keywords": ["test"], "labels": ["TESTING"]}, {"keywords": ["ci"], "labels": ["DEPENDENCIES"]}, {"keywords": ["docs"], "labels": ["DOCUMENTATION"]}'
          github-token: "${{ secrets.GITHUB_TOKEN }}"
```