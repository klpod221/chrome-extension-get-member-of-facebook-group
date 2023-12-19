<div align="center">
  <h1>--// Get Member of Facebook Group //--</h1>
  <img src="https://img.shields.io/github/last-commit/klpod221/chrome-extension-get-member-of-facebook-group?style=for-the-badge&color=ffb4a2&labelColor=201a19">
  <img src="https://img.shields.io/github/stars/klpod221/chrome-extension-get-member-of-facebook-group?style=for-the-badge&color=e6c419&labelColor=1d1b16">
  <img src="https://img.shields.io/github/repo-size/klpod221/chrome-extension-get-member-of-facebook-group?style=for-the-badge&color=a8c7ff&labelColor=1a1b1f">
</div>

## About

This is a chrome extension that helps you get the members of a facebook group. You can get the members of a group by go to the group and click on the extension icon. The extension will automatically scroll down to the end of the group and get all the members.

## Development

### Requirements

- [Node.js](https://nodejs.org/en/) (v16)

### Start development

- Clone the repository

  ```bash
  git clone https://github.com/klpod221/chrome-extension-get-member-of-facebook-group.git

  cd chrome-extension-get-member-of-facebook-group
  ```

- Install dependencies

  ```bash
  yarn install
  ```

- Start development

  ```bash
  yarn dev
  ```

- Add the extension to chrome browser by go to `chrome://extensions/` and click on `Load unpacked` button. Then select the `dist` folder. If you can't see `Load unpacked` button, you need to turn on `Developer mode` first.

## Usage

- Download the extension from [Latest Release](https://github.com/klpod221/chrome-extension-get-member-of-facebook-group/releases/latest)
- Add the extension to chrome browser by go to `chrome://extensions/` and click on `Load unpacked` button. Then select the `dist` folder. If you can't see `Load unpacked` button, you need to turn on `Developer mode` first.
- Go to the Facebook group that you want to get the members (make sure you are member of that group and you are in the group page)
- Click on the extension icon
- Click the `Get members` button
- Wait for the extension to scroll down to the end of the group and get all the members
- Click the `Export Members` button to export the members to a xlsx file
- Done
