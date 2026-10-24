# dotfiles

My macOS setup, managed with [GNU Stow](https://www.gnu.org/software/stow/) and a [Brewfile](Brewfile): zsh + zinit, Starship, Ghostty and Zellij in Gruvbox Dark, plus Karabiner, VS Code, my global Claude Code instructions and the apps I use.

Each top-level folder is a Stow package whose contents mirror the home directory. Stow symlinks them into `~`, so editing `~/.zshrc` edits the file in this repo.

| Package     | Files                                                          | Linked to                 |
| ----------- | -------------------------------------------------------------- | ------------------------- |
| `zsh`       | `.zshrc`                                                       | `~/.zshrc`                |
| `starship`  | `.config/starship.toml`                                        | `~/.config/starship.toml` |
| `ghostty`   | `.config/ghostty/config`                                       | `~/.config/ghostty/`      |
| `zellij`    | `.config/zellij/config.kdl`, `layouts/`, `themes/`, `scripts/` | `~/.config/zellij/`       |
| `karabiner` | `.config/karabiner/` (whole folder)                            | `~/.config/karabiner/`    |
| `vscode`    | `Library/Application Support/Code/User/settings.json`          | same path under `~`       |
| `claude`    | `.claude/CLAUDE.md`, `settings.json`, `skills/unslop/`         | `~/.claude/`              |

## Set up a new Mac

1. Install [Homebrew](https://brew.sh) and sign in to the App Store.

2. Set up an SSH key for GitHub (needed to clone and push over SSH).

   ```bash
   ssh-keygen -t ed25519 -C "<your email>"
   ```

   Create `~/.ssh/config` (then `chmod 600 ~/.ssh/config`) so macOS loads the key from the Keychain and you aren't asked for the passphrase after every reboot:

   ```
   Host *
     AddKeysToAgent yes
     UseKeychain yes
     IdentityFile ~/.ssh/id_ed25519
   ```

   Store the passphrase in the Keychain, then add the public key to GitHub (Settings → SSH and GPG keys, or `gh ssh-key add ~/.ssh/id_ed25519.pub` once `gh` is installed):

   ```bash
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

   `~/.ssh/config` stays out of this repo on purpose: SSH configs tend to collect host names and servers.

3. Clone the repo and install everything:

   ```bash
   brew install git stow
   git clone git@github.com:narcizo/dotfiles.git ~/dotfiles
   brew bundle --file=~/dotfiles/Brewfile
   ```

   The Brewfile installs CLI tools, apps (casks), App Store apps (through `mas`) and VS Code extensions. Remove lines for anything you don't want first.

4. Link the configs:

   ```bash
   cd ~/dotfiles && stow zsh starship ghostty zellij karabiner vscode claude
   ```

   Stow refuses to overwrite real files. If a config already exists (e.g. a default `~/.zshrc`, or VS Code's first-run `settings.json`), move it aside first, or run `stow --adopt <package>` to pull it into the repo and then `git diff` to decide what to keep.

5. First runs: zinit installs itself and its plugins on the first shell start. Zellij downloads the zjstatus plugin the first time it starts; click the bar and press `y` to grant its permissions. Karabiner and Logi Options+ need their macOS permissions approved in System Settings.

6. Install what Homebrew can't (below).

### Manual installs

No Homebrew cask or App Store entry for these:

- [ ] Steven Slate Audio Center
- [ ] XLN Online Installer
- [ ] Spitfire LABS
- [ ] Neural Amp Modeler (plugin and app)
- [ ] Blackmagic Proxy Generator Lite
- [ ] Riot Client
- [ ] Runner

Music plugins and instruments come back through their own managers once those are installed: Native Access, Splice, Spitfire Audio, Waves Central, UA Connect, iZotope Product Portal, IK Product Manager, iLok License Manager.

## Day to day

- Edit configs in place (`zshconfig`, `starshipconfig`, `ghosttyconfig`); the changes land here. Commit when happy.
- New file in an existing package: put it in the package folder, then `stow -R <package>`.
- New tool: create a folder that mirrors its path under `~`, e.g. `tmux/.tmux.conf`, then `stow tmux`.
- Remove a package's links: `stow -D <package>`.
- New app or CLI tool: add it to the `Brewfile`. `brew bundle check --file=~/dotfiles/Brewfile --verbose` lists what's missing.

## Related

- [JS/TS linting and formatting configs](https://gist.github.com/narcizo/aa5406716b8c018e3e42913f42dc4858): `eslint.config.mjs` (React), `.oxlintrc.json` (NestJS) and `.prettierrc`. These are per-project files, so they live in a gist to copy into each project, not in a Stow package.

## Notes

- The files here are the live configs, so checking out another branch changes them immediately. A package that only exists on one branch disappears when you switch away from it, leaving broken symlinks. Merge before switching back.
- Ghostty reads `~/.config/ghostty/config`. Don't keep a second config in `~/Library/Application Support/com.mitchellh.ghostty/`: Ghostty loads that one too, after this one.
- Karabiner is linked as a whole folder because it saves `karabiner.json` by replacing the file, which would break a file-level symlink. Its `automatic_backups/` folder is gitignored.
- Karabiner's rules come from `karabiner-ts/index.ts` (not a Stow package). Edit it, then run `bun install` once and `bun run build` in `karabiner-ts/`; `bun run dry-run` prints the result without writing. It replaces only the profile's complex modifications, so device settings in `karabiner.json` stay. Rules added in the Karabiner app are overwritten on the next build. The layers: hold Right Cmd for symbols, hold Tab for a right-hand numpad.
- The `claude` package links only `CLAUDE.md`, `settings.json` and the `unslop` skill. The rest of `~/.claude` (history, sessions, caches, other skills) stays local. `CLAUDE.md` mentions a `music-profile` skill that isn't in this repo.
- `CLAUDE.md` at the repo root (not in a package) tells Claude Code how to work in this repo.
- zjstatus is pinned to v0.21.0, which matches Zellij 0.42.x. zjstatus >= 0.25 needs Zellij >= 0.45, so upgrade both together.
- The zjstatus widgets call `~/.config/zellij/scripts/zjstatus-sys.sh`. Widget commands must return instantly, or they pile up.
- Icons need a Nerd Font. Ghostty's default font includes the symbols.
- `CHANGELOG.md` records why things are set up the way they are, with undo steps.
