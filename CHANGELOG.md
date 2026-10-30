# Dotfiles changelog

Changes Claude made to shell and terminal config, newest first. Each entry lists what changed, where the backup is, and how to undo it. Entries before the move to this repo refer to the files' old locations.

## 2026-10-29 - zsh: Go from Homebrew instead of Webi

- `zsh/.zshrc`: the Webi `envman` loader is replaced by `export PATH="$HOME/go/bin:$PATH"`. Go 1.27.3 now comes from Homebrew (`/opt/homebrew/bin/go`), and `Brewfile` has `brew "go"`. `~/go` was a Webi symlink to `~/.local/opt/go-bin-v1.27.3`, so removing Webi also removed `gopls` and `bootdev`. `~/go` is now a plain folder, and both were reinstalled with `go install`.
- Backup: `~/.config/dotfiles-backup-2026-10-29-zsh/.zshrc`.
- Undo: `cp ~/.config/dotfiles-backup-2026-10-29-zsh/.zshrc zsh/` (needs Webi's `~/.config/envman` and `~/.local/opt/go`, if you haven't deleted them).

## 2026-10-29 - Karabiner: `=>` moves to Right Cmd + `p`

- `karabiner-ts/index.ts`: Right Cmd + `p` types `=>`. Right Cmd + `o` is Cmd+O again, and Right Cmd + `p` no longer sends Cmd+P (Left Cmd + `p` still does).
- Undo: change `'p'` back to `'o'` in the `=>` mapping, then `bun run build`.

## 2026-10-25 - Karabiner: Right Cmd stays Cmd outside the symbols

- `karabiner-ts/index.ts`: Right Cmd now sends a real Cmd while held, and each symbol is a Right Cmd + key rule. Keys without a symbol, and mouse or trackpad clicks, act as Cmd + that key (Right Cmd + `p` is Cmd+P again). The explicit number row and Space mappings are gone because they now pass through on their own. Tapping alone still sends Backspace, but only if released within 250 ms, so a Cmd+click doesn't also delete a character.
- Undo: revert the commit that adds this entry, then `bun run build`.

## 2026-10-24 - Karabiner: `:` on the symbol layer

- `karabiner-ts/index.ts`: Right Cmd + `'` types `:`, so Go's `:=` stays on one layer (`'` then `f`).
- Undo: remove the `"'"` entry from `symbols`, then `bun run build`.

## 2026-10-24 - Karabiner: rules in karabiner.ts, symbol and number layers

- New folder `karabiner-ts/` (not a Stow package): `index.ts` builds the Karabiner rules with [karabiner.ts](https://github.com/evan-liu/karabiner.ts) 1.38, run with `bun run build`. It replaces only `complex_modifications` in the profile; `devices` (the Galaxy80 remap and the ignored Logitech device) and `virtual_hid_keyboard` were checked and are unchanged.
- The 4 existing rules are ported as they were. The generated manipulators match the old ones exactly.
- New symbol layer: hold Right Cmd. Top row `! @ # $ % ^ & * =>` (`o` types `=>` in one press, `p` is blocked), home row `{ ( [ = - _ + ] ) }`, bottom row `` | ` " ' ~ ? < / > \ ``. `< / >` sit together under the right index, middle and ring fingers for JSX and generics, the quotes move off the right pinky, and `;` and `:` are left out because they're on the base home row. Right Cmd + a number still sends Cmd + that number for the Raycast app shortcuts, and Right Cmd + Space sends Cmd + Space (Raycast). Tapped alone, Right Cmd sends Backspace, so the right pinky doesn't reach for it. Held modifiers pass through: Option + tap deletes a word, Cmd + tap deletes to the start of the line. The Backspace fires on release and doesn't repeat when held. `layer()` refuses modifier keys, so this layer uses its own variable.
- New number layer: hold Tab. `u i o` = 7 8 9, `j k l` = 4 5 6, `m , .` = 1 2 3, Space = 0. Every other letter and punctuation key is blocked while Tab is held, so a stray press types nothing. Only plain Tab triggers it, so Cmd+Tab, Ctrl+Tab and Shift+Tab are unchanged. Tab now types on release, and holding it no longer repeats.
- `karabiner.json` now also has a `parameters` block with Karabiner's default timings, and is formatted with 2-space indentation.
- `karabiner/.config/karabiner/assets/complex_modifications/narcizos-rules.json` is now out of date (it lacks the layers).
- `.gitignore`: `karabiner-ts/node_modules/`. `README.md`: note on how to build the rules.
- Backup: `~/.config/dotfiles-backup-2026-10-24-karabiner-ts/karabiner.json`.
- Undo: `cp ~/.config/dotfiles-backup-2026-10-24-karabiner-ts/karabiner.json karabiner/.config/karabiner/`, then restart Karabiner. Delete `karabiner-ts/` if you don't want it.

## 2026-10-24 - Ghostty: Cmd+K clears the screen inside Zellij

- `ghostty/.config/ghostty/config`: new `keybind = super+k=text:\x0c`. Ghostty's default Cmd+K clears its own screen, but Zellij redraws its panes over it right away. The keybind sends the Ctrl+L character to the shell instead, so zsh clears the screen in or out of Zellij. Karabiner never sees it, so the Ctrl+L to Right Arrow rule doesn't apply. Scrollback is kept, unlike Ghostty's own clear.
- Backup: `~/.config/dotfiles-backup-2026-10-24-ghostty/config`.
- Undo: delete the `keybind` line and its comment, or `cp ~/.config/dotfiles-backup-2026-10-24-ghostty/config ghostty/.config/ghostty/`.

## 2026-10-24 - Karabiner: Caps + Right Shift sends Backspace again

- `karabiner/.config/karabiner/karabiner.json` and `karabiner/.config/karabiner/assets/complex_modifications/narcizos-rules.json`: in the Caps Lock rule, the `caps_lock` + mandatory `right_shift` manipulator now comes before the plain `caps_lock` one. Karabiner uses the first manipulator that matches, and the plain one accepts any modifier, so it caught Caps while Right Shift was held and sent Ctrl. Backspace never fired.
- Backup: `~/.config/dotfiles-backup-2026-10-24-karabiner/` (both files).
- Undo: `cp ~/.config/dotfiles-backup-2026-10-24-karabiner/karabiner.json karabiner/.config/karabiner/` and `cp ~/.config/dotfiles-backup-2026-10-24-karabiner/narcizos-rules.json karabiner/.config/karabiner/assets/complex_modifications/`.

## 2026-10-23 — Karabiner: fn and Ctrl remap on the Galaxy80

On branch `karabiner/galaxy80-fn-option`.

- `karabiner/.config/karabiner/karabiner.json`: new device entry for the Epomaker x Feker Galaxy80 (vendor 1452, product 591; in Mac mode it reports Apple's vendor ID). Right of the space bar the board sends `right_command, fn, left_option, right_control`. The entry maps `fn` to `right_option` (so Option+C gives ç from the MacBook's Option position) and `right_control` to fn. The other keyboards are unchanged.
- The third key stays Option: it sends `left_option`, the same code as the left Alt, so Karabiner can't remap one without the other.
- Backup: none, the previous version is the file on `main`.
- Undo: `git checkout main -- karabiner/.config/karabiner/karabiner.json`, or delete the Galaxy80 entry under `devices`.

## 2026-10-22 — Writing rules inline instead of loading unslop

- `claude/.claude/CLAUDE.md`: removed "When answering in english load the `unslop` skill". The skill has `disable-model-invocation: true`, so Claude could never load it, and at 891 words it would have cost more than the whole file on every reply. Added five of its rules inline instead (plain words, no em dashes, no chatbot filler, concrete claims, whole sentences in active voice). Also replaced the em dash in the closing-block exception line.
- `unslop` stays manual-only (`/unslop`).
- Backup: `~/.config/dotfiles-backup-2026-10-22-unslop/CLAUDE.md`.
- Undo: `cp ~/.config/dotfiles-backup-2026-10-22-unslop/CLAUDE.md claude/.claude/CLAUDE.md`.

## 2026-10-22 — Claude Code setup in the repo

- Global `~/.claude/CLAUDE.md`: new "Machine setup" section (config lives in `~/dotfiles`, add Homebrew installs to the `Brewfile`, user makes commits and destructive commands, preview visual changes before applying).
- New `CLAUDE.md` at the repo root (not a Stow package): how the repo works, commit and changelog rules, how to verify each tool, and the gotchas found while setting it up.
- New Stow package `claude`: `~/.claude/CLAUDE.md`, `~/.claude/settings.json` and `~/.claude/skills/unslop/` are now symlinks into `claude/.claude/`. The `music-profile` skill and everything else in `~/.claude` stay out of the repo.
- `README.md`: `claude` row in the package table, `claude` added to the setup `stow` command, notes on what the package leaves out and on the root `CLAUDE.md`.
- Backup: `~/.config/dotfiles-prestow-2026-10-22/claude/` (`CLAUDE.md` before the new section, `settings.json`, `skills/unslop/`).
- Undo: `stow -D claude`, then copy the backups back into `~/.claude/`.

## 2026-10-22 — README: link to the lint configs gist

- `README.md`: new "Related" section linking the public gist [JS/TS linting and formatting](https://gist.github.com/narcizo/aa5406716b8c018e3e42913f42dc4858) (`eslint.config.mjs`, `.oxlintrc.json`, `.prettierrc`). They're per-project configs, so the gist stays their source.
- Gists from this session were deleted by the user: `.zshrc`, `starship.toml`, Ghostty, Zellij and Karabiner.

## 2026-10-22 — Karabiner, VS Code and a Brewfile

On branch `add-karabiner-vscode-brewfile`.

- New Stow package `karabiner`: moved the whole `~/.config/karabiner/` folder into the repo and stowed it, so `~/.config/karabiner` is a folder symlink (Karabiner replaces `karabiner.json` on save, which would break a file symlink). Restarted Karabiner's user service (`launchctl kickstart -k gui/501/org.pqrs.service.agent.Karabiner-Console-User-Server`); it reads the config through the link (1 profile, 4 rules).
- `.gitignore`: added `karabiner/.config/karabiner/automatic_backups/`.
- Added `assets/complex_modifications/narcizos-rules.json` ("Narcizo's Custom Rules", 4 rules) from the Karabiner gist, so the importable rule set lives in the repo before the gist is deleted. Its rules are identical to the 4 active ones in `karabiner.json`; Karabiner only reads it from "Add predefined rule".
- New Stow package `vscode`: `~/Library/Application Support/Code/User/settings.json` is now a symlink into the repo. No `keybindings.json` or snippets existed.
- Installed `mas` (App Store CLI) with Homebrew.
- New `Brewfile` (122 entries): 1 tap, 22 formulae, 51 casks (the 4 already brew-installed plus apps installed by hand that have a cask), 10 App Store apps, 37 VS Code extensions. Picked `helium-browser` and `zen` by matching bundle IDs (`net.imput.helium`, `app.zen-browser.zen`). Left out `npm "corepack"`: it ships with Node, which fnm manages per version.
- `brew bundle check` parses the file. It reports "needs install" for hand-installed apps and for VS Code extensions (no `code` on PATH here, only the zsh alias); that's expected on this Mac.
- `README.md`: new packages, Brewfile setup steps, manual-install checklist, and a warning that switching branches changes live configs.
- Backups before the move: `~/.config/dotfiles-prestow-2026-10-22/karabiner/` and `vscode-settings.json`.
- Undo: `stow -D karabiner vscode`, copy the backups back, delete the `Brewfile`.

## 2026-10-22 — Moved configs into ~/dotfiles with GNU Stow

- Installed `stow` with Homebrew.
- Created `~/dotfiles` with four Stow packages: `zsh`, `starship`, `ghostty`, `zellij` (see `README.md` for the layout).
- Moved the real files into the repo and ran `stow -t ~ zsh starship ghostty zellij`. `~/.zshrc`, `~/.config/starship.toml`, `~/.config/ghostty`, and `~/.config/zellij/{config.kdl,layouts,themes,scripts}` are now symlinks into the repo.
- Ghostty config moved from `~/Library/Application Support/com.mitchellh.ghostty/config` to `~/.config/ghostty/config` (Ghostty's XDG path). The old file is gone, so only one config loads.
- Zellij backup files (`config.kdl.bak*`) stay in `~/.config/zellij/`, outside the repo.
- This changelog moved from `~/.config/dotfiles-changelog.md` to `~/dotfiles/CHANGELOG.md`.
- `~/.config/theme-snapshots/2026-10-22-rose-pine/restore.sh` updated: Ghostty path changed to `~/.config/ghostty/config`, and themes are copied into the folder instead of replacing it (which would have broken the symlink).
- Backup of all files before the move: `~/.config/dotfiles-prestow-2026-10-22/`.
- Undo: `cd ~/dotfiles && stow -D zsh starship ghostty zellij`, then copy the files from the backup folder back to their places (Ghostty's to the old App Support path or `~/.config/ghostty/config`).

## 2026-10-22 — Synced configs to GitHub gists

- `.zshrc` gist ([ac153c63…](https://gist.github.com/narcizo/ac153c63f56a469e0ee5d43a5da55a30), public): already matched the local file, no change.
- `starship.toml` gist ([9a6b61a8…](https://gist.github.com/narcizo/9a6b61a822ab8887295635fa15a14229), secret): updated with the current pill/clock-icon config. The gist version was older (no pill, clock or status; `min_time = 200`) and is still in the gist's revision history.
- New secret gist [Ghostty config](https://gist.github.com/narcizo/16a507aee285b596c5686caf41eb4af2): `ghostty-config`.
- New secret gist [Zellij config](https://gist.github.com/narcizo/bde989de54c96fc6ac3afc7832162e17): `config.kdl`, `compact-gruvbox.kdl`, `compact-gruvbox.swap.kdl`, `gruvbox-zjstatus.kdl`, `zjstatus-sys.sh`, plus a `README.md` listing where each file goes.
- Scanned for secrets before upload: none found. Files only contain `/Users/narcizo` paths.
- Not uploaded: this changelog, the backups, the theme snapshot.

## 2026-10-22 — Starship: clock icon before the time

- `~/.config/starship.toml`: `[time] format` changed from `'[· $time]($style)'` to `'[󰅐 $time]($style)'` (Nerd Font `nf-md-clock_outline`, U+F0150, the same icon as uptime in the zjstatus bar).
- Backup: `~/.config/starship.toml.bak-2026-10-22-dot` (the middle-dot version)
- Undo: restore that backup.

## 2026-10-22 — Starship: middle dot before the clock

- `~/.config/starship.toml`: `[time] format` changed from `'[│ $time]($style)'` to `'[· $time]($style)'`.
- Result: `( narcizo in ~ ) took 2s ✘ 130 · 21:02:15` / `╰─➜`
- Backup: `~/.config/starship.toml.bak-2026-10-22-bar` (the `│` version)
- Undo: restore that backup.

## 2026-10-22 — Starship: clock after the info

- `~/.config/starship.toml`:
  - Removed `$fill` from `format` (now `... $all$time$line_break ...`) and deleted the `[fill]` section, so the clock is no longer pushed to the right edge.
  - `[time] format` is now `'[│ $time]($style)'`: a dim `│` separator before the clock.
- Result: `( narcizo in sale-io ) on master via Node took 2s ✘ 130 │ 20:57:57` / `╰─➜`
- Backup: `~/.config/starship.toml.bak-2026-10-22-pillright` (pill with the clock on the right)
- Undo: restore that backup.

## 2026-10-22 — Starship: gray pill instead of the dim line

- `~/.config/starship.toml`:
  - `format` now wraps `$username$directory` in a rounded pill: Nerd Font caps `` / `` in `#3c3836` (same gray as the zjstatus bar), with a `bg:#3c3836` text group between them.
  - `[username] style_user` and new `[directory] style` / `read_only_style` carry `bg:#3c3836`. Without it, Starship resets the background on those words.
  - `[fill] symbol` changed from `'─'` to `' '`: no line, the clock stays on the right edge.
  - Duration, `✘ code`, git and Node stay outside the pill; `╰─➜` unchanged.
- Result: `( narcizo in ~ ) took 46s            20:52:45` / `╰─➜`
- Backup: `~/.config/starship.toml.bak-2026-10-22-line` (the dim-line version)
- Undo: restore that backup.

## 2026-10-22 — Starship: dropped the top corner

- `~/.config/starship.toml`: removed `[╭─](bright-black) ` from `format`, so the first line starts at `narcizo` again. The `╰─` before the arrow stays.
- Result: `narcizo in ~ took 46s ──────── 20:44:58` / `╰─➜`
- Backup: `~/.config/starship.toml.bak-2026-10-22-topcorner`
- Undo: restore that backup.

## 2026-10-22 — Starship: corners, clock and failure marker

- `~/.config/starship.toml`:
  - `format` is now `'[╭─](bright-black) $all$fill $time$line_break[╰─](bright-black)$character'`: dim box corners join the two prompt lines, and the clock sits at the right end of the rule.
  - Added `[time]` (enabled, `%T`, dim `bright-black`, no "at" prefix).
  - Added `[status]` (enabled, `✘ <code>` in bold red, shown only when the last command failed; Ctrl-C shows 130).
- Result: `╭─ narcizo in ~ took 46s ✘ 1 ──────── 20:41:18` / `╰─➜`
- Backup: `~/.config/starship.toml.bak-2026-10-22-corners` (the version with the plain rule)
- Undo: restore that backup.

## 2026-10-22 — Starship: duration before the rule

- `~/.config/starship.toml`: `format` is now `'$all$fill$line_break$character'`. `cmd_duration` comes from `$all`, so it sits before the rule (`narcizo in ~ took 46s ────`). Added a trailing space to the `cmd_duration` format so it doesn't touch the line.
- Backup: same as below (`~/.config/starship.toml.bak-2026-10-22`, from before the rule was added).

## 2026-10-22 — Starship: dim rule on the prompt line

- `~/.config/starship.toml`:
  - Added `format = '$all$fill $cmd_duration$line_break$character'` so a dim `─` line fills the rest of the `narcizo in ~` line, with `took 11s` at the right end when shown.
  - Added `[fill]` with `symbol = '─'` and `style = 'bright-black'` (Gruvbox gray).
- No change needed for jumping: Ghostty's defaults already bind Cmd+↑ / Cmd+↓ (and Cmd+Shift+↑/↓) to `jump_to_prompt`. This only works outside Zellij, which keeps its own scrollback.
- Backup: `~/.config/starship.toml.bak-2026-10-22`
- Note: the theme snapshot's `restore.sh` also restores `starship.toml`, so running it removes this rule too.
- Undo: restore the backup, or delete the `format` line and the `[fill]` section.

## 2026-10-22 — Zellij: memory icon

- `~/.config/zellij/config.kdl`, zjstatus `format_right`: memory icon changed from `nf-md-memory` (U+F035B, a chip that looked like the CPU icon) to `nf-fa-memory` (U+EFC5, a RAM stick). Checked that Ghostty's bundled Symbols Nerd Font has it.
- Backup: `~/.config/zellij/config.kdl.bak-2026-10-22-memicon`
- Undo: restore the backup.

## 2026-10-22 — Fix: CPU widget overloaded the Mac

- Problem: the zjstatus CPU widget ran `top -l 2 -n 0 -s 1`, which takes about 1s. zjstatus kept starting new runs before old ones finished, in every Zellij session, so dozens of `top` processes piled up. Load average hit about 240, and shell startup went from about 0.1s to 2–9s.
- `~/.config/zellij/scripts/zjstatus-sys.sh`: the `cpu` subcommand now sums `ps -A -o %cpu` and divides by core count (about 0.02s). It's a smoothed average, so it reacts more slowly than `top`.
- Killed the leftover `top` processes. Running sessions picked up the fix right away because they call the script by path. No config change needed.
- Rule for future widgets: commands must return instantly. Nothing that sleeps or samples over time.
- Undo: not recommended. The old line is in the changelog entry for the system widgets.

## 2026-10-22 — Ghostty: Gruvbox Dark (trial)

- Snapshot of the previous state (Rose Pine Ghostty + Gruvbox Zellij) in `~/.config/theme-snapshots/2026-10-22-rose-pine/`: Ghostty config, Zellij `config.kdl` and `themes/`, `starship.toml`, plus `restore.sh`.
- `~/Library/Application Support/com.mitchellh.ghostty/config`:
  - `theme = Rose Pine` commented out, `theme = Gruvbox Dark` added (Ghostty built-in).
  - `background = 000000` commented out, so the theme's `#282828` background is used (same as the zjstatus bar's `bg0`).
- No other files changed: Starship, fzf, eza and fast-syntax-highlighting use the terminal's ANSI palette, so they follow Ghostty's theme. Zellij was already Gruvbox.
- Undo: `~/.config/theme-snapshots/2026-10-22-rose-pine/restore.sh`, then reload Ghostty (Cmd+Shift+,).

## 2026-10-22 — Zellij: Gruvbox theme with frames matched to the bar

- Added `~/.config/zellij/themes/gruvbox-zjstatus.kdl`: Zellij 0.42.2's built-in `gruvbox-dark` theme with frame colors changed:
  - `frame_selected`: yellow `#fabd2f` (same as the active tab in the bar; was green `#98971a`).
  - `frame_unselected` (new): gray `#665c54` (same as the NORMAL badge; was the terminal's default white).
  - `frame_highlight` (PANE, RESIZE, MOVE and other non-normal modes): bright orange `#fe8019` (was `#d65d0e`).
- `~/.config/zellij/config.kdl`: replaced the commented `// theme "dracula"` line with `theme "gruvbox-zjstatus"`. This also restyles Zellij's own UI (session manager, plugin screens) in Gruvbox.
- Backup: `~/.config/zellij/config.kdl.bak-2026-10-22-theme`
- Undo: comment the `theme` line out again and delete the theme file.

## 2026-10-22 — Zellij: system widgets in the zjstatus bar

- Added `~/.config/zellij/scripts/zjstatus-sys.sh` (executable). Subcommands:
  - `uptime`: time since boot from `kern.boottime`, e.g. `21d 8h` (or `5h 12m` under a day).
  - `cpu`: overall CPU % from the second sample of `top -l 2` (takes about 1s, runs in the background).
  - `mem`: used/total RAM like Activity Monitor's "Memory Used" (app + wired + compressed), e.g. `19.9/24G`.
- `~/.config/zellij/config.kdl`, zjstatus block:
  - `format_right` now shows a gray segment with uptime, CPU and memory (Nerd Font icons) before the clock, matching merikan's original two-segment layout.
  - Added `command_uptime_*` (every 60s), `command_cpu_*` (every 5s), `command_mem_*` (every 10s), all calling the script by absolute path.
- Backup: `~/.config/zellij/config.kdl.bak-2026-10-22-widgets`
- Undo: restore the backup and delete the script.

## 2026-10-22 — Zellij: compact-gruvbox as default layout

- `~/.config/zellij/config.kdl`: uncommented the `default_layout` line and set it to `default_layout "compact-gruvbox"`. New sessions open with the zjstatus Gruvbox bar.
- Backup: `~/.config/zellij/config.kdl.bak-2026-10-22-layout`
- Undo: comment the line out again (falls back to Zellij's `default` layout) or set it to `"compact"`.

## 2026-10-22 — Zellij: zjstatus Gruvbox bar

- `~/.config/zellij/config.kdl`: added a `zjstatus` alias inside the `plugins { }` block, with the Gruvbox Dark theme adapted from [merikan/.dotfiles](https://github.com/merikan/.dotfiles/blob/main/config/zellij/themes/zjstatus/gruvbox.kdl).
  - Plugin pinned to zjstatus **v0.21.0** (built for Zellij 0.42.x). zjstatus v0.25.0 requires Zellij >= 0.45, so upgrading one means upgrading the other.
  - Changes vs upstream: right side shows only the clock (dropped `user@host` and its `command_user`/`command_host` widgets), timezone set to `America/Sao_Paulo`, fixed copy-paste labels (`mode_rename_tab`/`mode_rename_pane` now say RENAME, `mode_session` says SESSION), light-mode palette comments removed.
  - Backup: `~/.config/zellij/config.kdl.bak-2026-10-22`
- Added `~/.config/zellij/layouts/compact-gruvbox.kdl`: compact layout with the zjstatus bar (pane `size=2` for the border line plus the bar).
- Added `~/.config/zellij/layouts/compact-gruvbox.swap.kdl`: built-in compact swap layouts (vertical, horizontal, stacked, floating) with `compact-bar` replaced by `zjstatus`.
- Made the default layout in the entry above.
- Undo: restore the config backup and delete both layout files.

## 2026-10-22 — zsh: plugins and init-bun

- Installed with Homebrew: `fzf`, `zoxide`, `eza`.
- `~/.zshrc`:
  - Reordered plugins: `zsh-completions` → `compinit` → `fzf-tab` → `zsh-better-npm-completion` → autosuggestions → fast-syntax-highlighting → you-should-use.
  - Added zinit plugins `Aloxaf/fzf-tab` and `lukechilds/zsh-better-npm-completion`, plus fzf-tab zstyles (eza previews for `cd` and `z`, `<`/`>` to switch groups).
  - Added `source <(fzf --zsh)` and `eval "$(zoxide init zsh)"` at the end.
  - `ll`, `lt`, `ltd` now use eza (`tree` was not installed, so `lt`/`ltd` were broken).
  - Added `init-bun` function.
- Backup: `~/.zshrc.bak-2026-10-22-plugins`
- Undo: restore the backup; `brew uninstall fzf zoxide eza` if unwanted.

## 2026-10-22 — zsh: replaced with gist version, dropped Oh My Zsh

- `~/.zshrc` replaced with the gist [narcizo/ac153c63…](https://gist.github.com/narcizo/ac153c63f56a469e0ee5d43a5da55a30), plus `compinit` (with `~/.zsh/completions` on `fpath`) and the bun `BUN_INSTALL`/`PATH` lines.
  - Dropped from the old file: Oh My Zsh, nvm and its `.nvmrc` hook, avn, cursor-shape escape, `NPM_TOKEN` export.
- Oh My Zsh folder renamed to `~/.oh-my-zsh.bak-2026-10-22` (not deleted).
- Copied `_bun`, `_docker`, `_kubectl` completions from Oh My Zsh to `~/.zsh/completions/`.
- Removed `~/.zcompdump` (regenerated cache).
- Installed `fnm` with Homebrew; installed Node 22 (default) and 24 with fnm. `~/.nvm` left in place, unused.
- Backup: `~/.zshrc.bak-2026-10-22`
- Undo: restore the backup and rename `~/.oh-my-zsh.bak-2026-10-22` back to `~/.oh-my-zsh`.

## Open items

- `~/.npmrc` still references `${NPM_TOKEN}`, which is no longer set. Remove the line or set the token another way, and rotate the token (it is in plaintext in `~/.zshrc.bak-2026-10-22`).
- Once happy, delete the backups and `~/.oh-my-zsh.bak-2026-10-22`; optionally remove `~/.nvm` and the unused `zdharma---fast-syntax-highlighting` zinit clone.
- The gist doesn't include the plugin, eza, fzf, zoxide or init-bun changes yet.
