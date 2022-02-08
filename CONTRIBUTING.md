# How to contribute

Thank you for taking the time to learn about MyneChat, HOPR and welcome to our contributing guidelines!

Before getting started, we highly recommend to checkout the following resources:

**Technical Documentation**
- [Docs](https://docs.hoprnet.org)

**Socials**
- [Website](https://hoprnet.org)
- [Twitter](https://twitter.com/hoprnet)
- [Telegram](https://t.me/hoprnet)
- [Medium](https://medium.com/hoprnet)
- [Reddit](https://www.reddit.com/r/HOPR/)
- [Email](mailto:contact@hoprnet.org)
- [Discord](https://discord.gg/5FWSfq7)
- [Youtube](https://www.youtube.com/channel/UC2DzUtC90LXdW7TfT3igasA)

## Setting things up

Our default branch is `develop`, and our README.md is a great starting point for getting the basics out. Since MyneChat works best with a full set of HOPR nodes, we strongly recommend using the cloud setup via [Gitpod](https://gitpod.io/#https://github.com/hoprnet/myne-chat) which does this for you.

Otherwise, the second best option is to use our local `mocks` server, which you can ran locally and visit
https://int-dev-app.myne.chat/?development=enabled to interact with.

## Making changes

For commits, we are using [commitzen](https://commitizen-tools.github.io/commitizen/), so make sure to add your changes via `git add` and then do `yarn commit` to start the commit processes. Please send a [GitHub Pull Request to develop](https://github.com/opengovernment/opengovernment/pull/new/develop).

## Coding conventions

We currently don't have many code conventions, but will look to enforce those later after [this](https://github.com/hoprnet/myne-chat/issues/110) is completed. Please monitor that issue. For now, we only ask to indent using two spaces (soft tabs).
