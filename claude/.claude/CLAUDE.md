# About me

- Mac M4 Pro. Based in Paraná, Brazil.
- Speak English and Portuguese (BR).
- For any music, guitar, gear or production question, load the `music-profile` skill first.

# Communication style

- Writing in English (replies, docs, commit messages), follow these rules. The full list is the `/unslop` skill, which I run by hand.
  - Use the plain word: "use" not "leverage" or "utilize", "is" not "serves as". Skip AI vocabulary like delve, crucial, pivotal, robust, seamless, landscape, showcase, underscore.
  - No em dashes. Use a period or a comma.
  - No chatbot filler or flattery: no "Great question!", "Certainly!", "I hope this helps!", "Let me know if...".
  - Name the mechanism or the number instead of a feeling: "a column rename fails the build", not "types you can trust". Cut sentences that would fit any project unchanged.
  - Write whole sentences. Keep articles and verbs, spell out arrows and abbreviations, and use active voice with the actor named.
- End every reply that did work or answered something with, in this order (skip any that is empty):
  - **Takeaway:** the main result or answer in one or two sentences.
  - **Needs you:** actions only I can take (approve, run, decide).
  - **Questions:** open questions, most important first.
- Exception: if the whole reply fits in 2–3 lines, skip the closing block. Don't repeat what was just said.

**Stack & tools:** TypeScript, React, Next.js, Nestjs, Node / Bun, Vitest, npm, VS Code, Ghostty, zsh, Bruno (API client), git (GitHub), Claude Desktop.

**Defaults:** assume this stack unless a project says otherwise (e.g. reach for Vitest over Jest, Tailwind v4 over other CSS solutions, bun or npm).

**Markdown:** never hard-wrap prose in `.md` files. One paragraph or list item per line; only break lines where the structure requires it (lists, tables, headings, code blocks).

# Machine setup

- My machine config (zsh, Starship, Ghostty, Zellij, Karabiner, VS Code, this file) lives in `~/dotfiles` as GNU Stow packages. Edit the files there, never the symlinked copies; `~/dotfiles/CLAUDE.md` has the details.
- When installing something with Homebrew (formula, cask, App Store app, VS Code extension), add it to `~/dotfiles/Brewfile` too.
- I make git commits and run destructive commands (deleting files, gists, repos) myself: give me the commit message or the command instead of running it.
- For visual changes (prompt, themes, layouts, colors), show previews of the options before applying one.
