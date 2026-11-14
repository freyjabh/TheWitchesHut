# The Witches Hut

A cooperative browser puzzle game for two players exploring a witch's hut.

## Project files

- `trusted/`: game source, artwork, room configuration, and browser tests.
- `Inspo-art/`: reference artwork.
- `build-usb.cjs`: creates the Windows USB edition in `SPELET-USB/`.
- `verify-usb*.cjs`: checks for the USB edition.
- Root Markdown files: planning notes and playtest instructions (mostly Swedish).

## Local preview

With Node.js installed, run from the project directory:

```sh
node trusted/preview-server.cjs
```

Open http://127.0.0.1:5174 in a browser.

The LAN server, USB build, launcher, and some tests currently reference the
original developer's local Node.js, Playwright, and browser paths. These paths
need adapting before using those workflows on another computer. See
`SPELTEST-TVA-DATORER.md` and `USB-KONTROLL.md` for existing playtest notes.

Generated USB builds, preview output, logs, local player access tokens, and
saved game sessions are excluded from Git. The exported room setup in
`trusted/playtest-setup.json` is included so the intended layout is preserved.
