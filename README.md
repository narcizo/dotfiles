# dotfiles

My macOS terminal setup, managed with [GNU Stow](https://www.gnu.org/software/stow/): zsh + zinit, Starship, Ghostty and Zellij, all in Gruvbox Dark.

Each top-level folder is a Stow package whose contents mirror the home directory. Stow symlinks them into `~`, so editing `~/.zshrc` edits the file in this repo.

| Package | Files | Linked to |
|---|---|---|
| `zsh` | `.zshrc` | `~/.zshrc` |
| `starship` | `.config/starship.toml` | `~/.config/starship.toml` |
| `ghostty` | `.config/ghostty/config` | `~/.config/ghostty/` |
| `zellij` | `.config/zellij/config.kdl`, `layouts/`, `themes/`, `scripts/` | `~/.config/zellij/` |

## Set up a new Mac

```bash
brew install stow starship zellij fnm fzf zoxide eza thefuck
git clone git@github.com:narcizo/dotfiles.git ~/dotfiles
cd ~/dotfiles
stow zsh starship ghostty zellij
```

Stow refuses to overwrite real files. If a config already exists (e.g. a default `~/.zshrc`), move it aside first, or run `stow --adopt <package>` to pull it into the repo and then `git diff` to decide what to keep.

zinit installs itself and its plugins on the first shell start. Zellij downloads the zjstatus plugin the first time it starts; click the bar and press `y` to grant its permissions.

## Day to day

- Edit configs in place (`zshconfig`, `starshipconfig`, `ghosttyconfig`); the changes land here. Commit when happy.
- New file in an existing package: put it in the package folder, then `stow -R <package>`.
- New tool: create a folder that mirrors its path under `~`, e.g. `tmux/.tmux.conf`, then `stow tmux`.
- Remove a package's links: `stow -D <package>`.

## Notes

- Ghostty reads `~/.config/ghostty/config`. Don't keep a second config in `~/Library/Application Support/com.mitchellh.ghostty/`: Ghostty loads that one too, after this one.
- zjstatus is pinned to v0.21.0, which matches Zellij 0.42.x. zjstatus >= 0.25 needs Zellij >= 0.45, so upgrade both together.
- The zjstatus widgets call `~/.config/zellij/scripts/zjstatus-sys.sh`. Widget commands must return instantly, or they pile up.
- Icons need a Nerd Font. Ghostty's default font includes the symbols.
- `CHANGELOG.md` records why things are set up the way they are, with undo steps.
