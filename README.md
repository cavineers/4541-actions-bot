# 4541-actions-bot
Team 4541's GitHub actions bot.

# Purpose
The purpose of this repository is to provide a storage and API for interacting with GitHub actions. This project aims to assist in repository organization, security, styling, and contribution management for *FIRST* robotics team 4541 repositories.

# Usage | Documentation
In the `workflows` directory in `.github` on most repositories see the YAML code below:

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
        uses: ./actions/[FOLDER OF ACTION.yml FILE]
        with:
          parameters: '[ACTION PARAMETERS]'
          github-token: "${{ secrets.GITHUB_TOKEN }}"
```
