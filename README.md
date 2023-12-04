# 河道搜搜 Timeline Search

Having trouble finding a certain plurk in your Plurk timeline? Remembering seeing some funny plurk and you've liked it but couldn't find it anymore? We feel you!

Timeline Search (tmp name) is a tool that helps users to find a plurk with specific content in their timeline.

For example, it can search the plurks that you've replurked for a certain keyword.

The app is still under developing and has no UI currently, but the goal is to have a simple UI that users can login and do the search.

河道搜搜（暫定名稱）的目標是幫助噗浪使用者在自己的時間軸上搜索特定內容。

比如再已按過愛心的噗中搜索「食譜」，在所有轉噗過的內容中搜索特定標籤……

工具目前正在開發當中，不確定會拖多久，但目標就是這樣 :D

## Dev tools

1. Node: 18.17.0
2. Language: [Typescript](https://github.com/microsoft/TypeScript)
3. Pacakge Manager: [Yarn 2+](https://yarnpkg.com/getting-started/install)
4. API Framework: [Nest](https://github.com/nestjs/nest)
5. UI Framework: [NextJS](https://nextjs.org/) + [MUI](https://mui.com/material-ui/)
6. Testing Framework: [Jest](https://jestjs.io/)
7. Git hook: [Husky](https://typicode.github.io/husky/#/)

## Getting Started

### Install all dependencies
```
yarn
```

Don't have yarn 2+ on your machine? Check [official installation guide](https://yarnpkg.com/getting-started/install).

Simply put, `corepack enable` for node >= 16.0, `npm i -g corepack` for node < 16.0.

### Prepare api environments

We need to authenticate the user before we are able to pull data from their timeline.

To do so we need the key and secret to communicate with Plurk.

First, register a new plurk app here: https://www.plurk.com/PlurkApp/
(or you can reuse any existing one if there is one)

See also: https://www.plurk.com/API

Then goto `/api` folder, copy `.env.sample` under this repo and rename it to `.env`.

Fill in `PLURK_APP_KEY` and `PLURK_APP_SECRET` with the key & secret you got from Plurk.

Enter random strings for `ENCRYPTION_KEY` and `JWT_SECRET`.

Modify `PROTOCOL`, `HOST`, and `PORT` if you're hosting on a different hostname/port.

## Development

```
# recompile upon file changes
yarn start:dev:api

# prod
yarn build:api && yarn start:prod:api
```

Then you can access the api on http://localhost:9981/, web app on http://localhost:9980/.

### Linting
This repo reinforces code style and code quality to pass by Husky hook.
You must fix all issues from eslint before committing, and must pass all tests before pushing.

```
yarn lint:api
yarn lint:web
```

### Testing

```
yarn test:api

# or run tests upon file changes - extremely useful for TDD
yarn test:watch:api
```

### Workflow

![img](./img/plurk-search-uml.jpg)

API workflow demo
![img](./img/demo.gif)

## Bug Report

[Open an issue directly](https://github.com/cloudewu/plurk-search/issues/new/choose) for any bug reports/feature requests/feedbacks.
Or you can also contact me on [Plurk](https://plurk.com/boxbox557).

## License

This tool is [MIT licensed](https://github.com/cloudewu/plurk-search/blob/master/LICENSE).

## Troubleshooting

1. Editor (e.g., vscode) not able to resolve the package.
   Check https://yarnpkg.com/getting-started/editor-sdks
