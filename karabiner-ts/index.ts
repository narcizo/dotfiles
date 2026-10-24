// Generates the complex modifications in ~/.config/karabiner/karabiner.json.
// Run `bun run build` after editing. Device settings in karabiner.json are left alone.
import {
  ifVar,
  layer,
  map,
  rule,
  toKey,
  toSetVar,
  writeToProfile,
  type FromKeyParam,
  type ToKeyParam,
} from 'karabiner.ts'

// Symbol layer while Right Cmd is held. [key, shifted]
const symbols: Record<string, [ToKeyParam, boolean]> = {
  // top row: ! @ # $ %   ^ & * => (o, below) and p is blocked
  q: [1, true], w: [2, true], e: [3, true], r: [4, true], t: [5, true],
  y: [6, true], u: [7, true], i: [8, true],
  // home row: { ( [ = -   _ + ] ) }
  a: ['[', true], s: [9, true], d: ['[', false], f: ['=', false], g: ['-', false],
  h: ['-', true], j: ['=', true], k: [']', false], l: [0, true], ';': [']', true],
  // bottom row: | ` " ' ~   ? < / > \
  z: ['\\', true], x: ['`', false], c: ["'", true], v: ["'", false], b: ['`', true],
  n: ['/', true], m: [',', true], ',': ['/', false], '.': ['.', true], '/': ['\\', false],
}

// Number layer while Tab is held: a numpad under the right hand.
const numbers: Record<string, ToKeyParam> = {
  u: 7, i: 8, o: 9,
  j: 4, k: 5, l: 6,
  m: 1, ',': 2, '.': 3,
  spacebar: 0,
}

// Every other letter and punctuation key does nothing on the number layer, so a stray press types nothing.
const numberLayerBlocked = [..."qwertyuiopasdfghjkl;zxcvbnm,./'[]\\`-="].filter((k) => !(k in numbers))

writeToProfile(process.argv.includes('--dry-run') ? '--dry-run' : 'Default profile', [
  rule('Change ESC key to Delete (for left-side Delete)').manipulators([
    map('escape').to('delete_forward'),
  ]),

  rule('Ctrl + h/j/k/l as vim arrow keys').manipulators([
    map('h', 'left_control', 'any').to('left_arrow'),
    map('j', 'left_control', 'any').to('down_arrow'),
    map('k', 'left_control', 'any').to('up_arrow'),
    map('l', 'left_control', 'any').to('right_arrow'),
  ]),

  rule('Change double tap right ⇧ key to caps lock').manipulators([
    map('right_shift', null, 'any')
      .condition(ifVar('right_shift pressed', 1))
      .to('caps_lock'),
    map('right_shift', null, 'any')
      .toVar('right_shift pressed', 1)
      .to('right_shift')
      .toDelayedAction(toSetVar('right_shift pressed', 0), toSetVar('right_shift pressed', 0)),
  ]),

  // The right_shift manipulator must come first: the plain one accepts any modifier.
  rule('Post escape if caps is pressed alone, left_ctrl otherwise, caps + right_shift to delete').manipulators([
    map('caps_lock', 'right_shift').to('delete_or_backspace'),
    map('caps_lock', null, 'any').to('left_control').toIfAlone('escape'),
  ]),

  // layer() refuses modifier keys, so Right Cmd sets the variable itself.
  // Tapped alone it sends Backspace; held modifiers pass through (Option + tap deletes a word).
  rule('Hold Right Cmd for the symbol layer, tap for Backspace').manipulators([
    map('right_command', null, 'any')
      .toVar('symbol-layer', 1)
      .toAfterKeyUp(toSetVar('symbol-layer', 0))
      .toIfAlone('delete_or_backspace'),
  ]),

  rule('Symbol layer', ifVar('symbol-layer', 1)).manipulators([
    ...Object.entries(symbols).map(([from, [key, shifted]]) =>
      map(from as FromKeyParam).to(toKey(key, shifted ? 'left_shift' : undefined)),
    ),
    map('o').to('=').to('.', 'left_shift'), // =>
    map('p').toNone(), // free slot

    // Keep Right Cmd + number and Right Cmd + Space as Cmd shortcuts for Raycast.
    ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const).map((n) => map(n).to(n, 'left_command')),
    map('spacebar').to('spacebar', 'left_command'),
  ]),

  // Only plain Tab: Cmd+Tab, Ctrl+Tab and Shift+Tab pass through untouched.
  layer('tab', 'number-layer').manipulators([
    ...Object.entries(numbers).map(([from, to]) => map(from as FromKeyParam).to(to)),
    ...numberLayerBlocked.map((k) => map(k as FromKeyParam).toNone()),
  ]),
])
