# NZZ Storytelling Q Charting Renderer

## Development
Run `gulp watch` to get a webserver. Point your Browser to the URL given in the console.
This will show you 2 charts renderered within an article context. This all comes from `index.html`, `src/dev-view.js` and `src/dev-styles.scss`.

## Travis Setup
  * Github Token for JSPM: https://gist.github.com/topheman/25241e48a1b4f91ec6d4
  * `travis encrypt JSPM_GITHUB_AUTH_TOKEN= --add`
  * `travis encrypt FASTLY_API_KEY= --add`
  * `travis encrypt KEYCDN_API_KEY= --add`
  * `travis encrypt AWS_SECRET_ACCESS_KEY= --add`
  * `travis encrypt AWS_ACCESS_KEY_ID= --add`
  * `travis encrypt "nzzstorytelling:token" --add notifications.slack`
