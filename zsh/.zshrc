# ============================================
# Zinit Plugin Manager
# ============================================
# Installs zinit automatically if not present
if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit" && command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

# ============================================
# Completions — must load before compinit
# ============================================
zinit light zsh-users/zsh-completions

# Local completion files (bun, docker, kubectl)
fpath=(~/.zsh/completions $fpath)
autoload -Uz compinit && compinit

# Case-insensitive tab completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# ============================================
# Zinit Plugins — order matters
# ============================================
# fzf-tab goes after compinit, before plugins that wrap widgets
zinit light Aloxaf/fzf-tab
zinit light lukechilds/zsh-better-npm-completion
zinit light zsh-users/zsh-autosuggestions
zinit light zdharma-continuum/fast-syntax-highlighting
zinit light MichaelAquilina/zsh-you-should-use

# fzf-tab: replace the default menu, preview folders with eza
zstyle ':completion:*' menu no
zstyle ':completion:*:descriptions' format '[%d]'
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'eza -1 --color=always $realpath'
zstyle ':fzf-tab:complete:__zoxide_z:*' fzf-preview 'eza -1 --color=always $realpath'
zstyle ':fzf-tab:*' switch-group '<' '>'

# ============================================
# Prompt — Starship
# ============================================
eval "$(starship init zsh)"

# ============================================
# Node Version Manager — fnm
# ============================================
# Automatically switches Node version when .nvmrc or .node-version is found
eval "$(fnm env --use-on-cd --shell zsh)"

# ============================================
# thefuck — lazy loaded for faster startup
# ============================================
# Type "fuck" to correct your previous command
fuck() {
  unfunction fuck
  eval $(thefuck --alias)
  fuck "$@"
}

# ============================================
# PATH
# ============================================
export PATH="$HOME/.local/bin:$PATH"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# ============================================
# Aliases — Editor / Config Files
# ============================================
alias code="/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code"
alias dot="code ~/dotfiles"

# ============================================
# Aliases — Shell Utilities
# ============================================
alias ll="eza -la --git --group-directories-first --icons"
alias lt="eza --tree --git-ignore --icons"
alias ltd="eza --tree -D -icons"
alias zshrc="source ~/.zshrc"
alias tmuxrc="source ~/.tmuxrc.sh"
alias ss="history | grep"

# ============================================
# Aliases — Media Downloads
# ============================================
# Download YouTube audio as MP3
alias getit="yt-dlp --extract-audio --audio-format mp3 -o \"$HOME/Music/Music/%(title)s-%(id)s.%(ext)s\""

# Download YouTube audio as FLAC (best quality, with thumbnail)
alias yt="yt-dlp --no-playlist -x --audio-format flac --audio-quality 0 --embed-thumbnail -o \"$HOME/Music/yt-dlp/%(title)s.%(ext)s\""

# ============================================
# Aliases — Android Emulator
# ============================================
alias droid="$HOME/Library/Android/sdk/emulator/emulator -avd Pixel_3a_API_34_extension_level_7_arm64-v8a"

# ============================================
# Functions
# ============================================

# Create a directory and cd into it
function mkcd() {
  mkdir "$1" && cd "$1"
}

# Scaffold a new TypeScript project with nodemon + tsx
function node-init() {
  local project="${1:?Usage: init-ts <project-name>}"
  mkdir "$project" && cd "$project" &&
  npm init -y &&
  npm pkg set type="module" &&
  npm install --save-dev typescript tsx nodemon @types/node &&
  npx tsc --init &&
  sed -i '' 's/"types": \[\]/"types": ["node"]/' tsconfig.json &&
  mkdir src &&
  touch src/index.ts &&
  npm pkg set scripts.start="npx nodemon --exec tsx src/index.ts" &&
  echo "TypeScript project '$project' ready!"
}

# Scaffold a new Bun project with a watch-mode dev script
function bun-init() {
  local project="${1:?Usage: init-bun <project-name>}"
  bun init -y "$project" && cd "$project" &&
  bun pm pkg set scripts.watch="bun --watch index.ts"
  bun pm pkg set scripts.hot="bun --hot index.ts"
}

# ============================================
# fzf — Ctrl-R history, Ctrl-T files, Alt-C cd
# ============================================
source <(fzf --zsh)

# ============================================
# zoxide — smarter cd, keep last
# ============================================
eval "$(zoxide init zsh)"
