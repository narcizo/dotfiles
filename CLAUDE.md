# dotfiles

My macOS config, managed with GNU Stow. See `README.md` for the layout and new-Mac setup.

## How it works

- Each top-level folder (`zsh`, `starship`, `ghostty`, `zellij`, `karabiner`, `vscode`, `claude`) is a Stow package mirroring `~`. The files in `~` are symlinks into this repo, so the files here are the live configs.
- Edit files in this repo. After adding a new file to a package, run `stow -R <package>` from the repo root so it gets linked.
- Switching branches changes the live configs immediately. A package that only exists on one branch leaves broken symlinks when you switch away, so merge before switching back to `main`.
- New apps and CLI tools go in `Brewfile`. Apps with no cask or App Store entry go in the README's manual-install checklist.

## Working here

- I make commits myself: end with a commit message (conventional-commit style) instead of committing.
- Back up a file before a risky change. Log changes to files in this repo in `CHANGELOG.md` (newest first: what changed, backup path, how to undo). Only log changes to how a tool behaves (keybinds, layers, remaps, settings you'd want to undo); skip minor tooling or editor fixes like lint or type errors, and keep entries short. Changes outside the repo (e.g. `~/.ssh/config`) don't go in the changelog.
- Never commit secrets. The repo is public: scan new files for tokens, keys and passwords before adding them. `~/.ssh/config` stays out of the repo.

## Verifying changes

Check the tool still loads after every change:

- zsh: `zsh -i -c exit` should stay around 0.1s (`/usr/bin/time zsh -i -c exit`).
- Starship: preview with `starship prompt --terminal-width 80 --cmd-duration 2000 --status 1`. Never run bare `starship config`: it opens an editor and hangs.
- Zellij: `zellij setup --check` should say "Well defined". Plugin config changes only apply to new sessions.
- Ghostty: `/Applications/Ghostty.app/Contents/MacOS/ghostty +show-config | grep <key>`; reload in the app with Cmd+Shift+,.
- Karabiner: after config changes, `launchctl kickstart -k gui/$(id -u)/org.pqrs.service.agent.Karabiner-Console-User-Server`, then check `~/.local/share/karabiner/log/console_user_server.log`.

## Gotchas

- zjstatus widget commands (`zellij/.config/zellij/scripts/zjstatus-sys.sh`) must return instantly. zjstatus starts new runs before slow ones finish; a `top -l 2` CPU widget once piled up dozens of processes and pushed the load average past 200.
- zjstatus is pinned to v0.21.0 for Zellij 0.42.x. zjstatus >= 0.25 needs Zellij >= 0.45: upgrade both together.
- Karabiner is linked as a whole folder because it replaces `karabiner.json` on save, which would break a file symlink. `automatic_backups/` is gitignored.
- Ghostty reads `~/.config/ghostty/config`. A second config in `~/Library/Application Support/com.mitchellh.ghostty/` would also load, after this one.
- Starship styles reset the background, so modules inside the gray pill need `bg:#3c3836` in their own style.
- Nerd Font glyphs (pill caps, icons) don't survive some edit tools; write them with a script using escapes (e.g. ``) when an edit fails to match.
- The `claude` package links only `CLAUDE.md`, `settings.json` and `skills/unslop`. The rest of `~/.claude` (history, sessions, caches, the `music-profile` skill) stays out. If `~/.claude/settings.json` stops being a symlink after Claude changes a setting, re-link with `stow --adopt claude` and check `git diff`.
