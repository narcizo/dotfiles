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
  // top row: ! @ # $ %   & * ^ => (y is Cmd+Y; => on p, below)
  q: [1, true], w: [2, true], e: [3, true], r: [4, true], t: [5, true],
  u: [7, true], i: [8, true], o: [6, true],
  // home row: { ( [ = -   _ + ] ) } :  (: on ' too while getting used to v)
  a: ['[', true], s: [9, true], d: ['[', false], f: ['=', false], g: ['-', false],
  h: ['-', true], j: ['=', true], k: [']', false], l: [0, true], ';': [']', true], "'": [';', true],
  // bottom row: | ` " : ~   ? < / > \
  z: ['\\', true], x: ['`', false], c: ["'", true], v: [';', true], b: ['`', true],
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

  // Right Cmd stays a real Cmd while held, so every key without a symbol (and mouse or
  // trackpad clicks) acts as Cmd + that key. Tapped alone it sends Backspace; held
  // modifiers pass through (Option + tap deletes a word). The short timeout keeps a
  // Cmd+click from also sending Backspace, since Karabiner doesn't see trackpad clicks.
  // Tap then press again and hold: the second press holds Backspace, so macOS key repeat
  // keeps deleting. The tap flag clears 300 ms after the first press (the delayed-action
  // timer starts on key down, not release).
  rule('Right Cmd: tap for Backspace, tap then hold to repeat it').manipulators([
    map('right_command', null, 'any')
      .condition(ifVar('right_command tapped', 1))
      .to('delete_or_backspace'),
    map('right_command', null, 'any')
      .to('right_command')
      .toIfAlone('delete_or_backspace')
      .toIfAlone(toSetVar('right_command tapped', 1))
      .toDelayedAction(toSetVar('right_command tapped', 0), toSetVar('right_command tapped', 0))
      .parameters({
        'basic.to_if_alone_timeout_milliseconds': 250,
        'basic.to_delayed_action_delay_milliseconds': 300,
      }),
  ]),

  // Karabiner lifts the mandatory Right Cmd while it sends each symbol.
  rule('Symbol layer (Right Cmd + key)').manipulators([
    ...Object.entries(symbols).map(([from, [key, shifted]]) =>
      map(from as FromKeyParam, 'right_command').to(toKey(key, shifted ? 'left_shift' : undefined)),
    ),
    map('p', 'right_command').to('=').to('.', 'left_shift'), // =>
  ]),

  // Only plain Tab: Cmd+Tab, Ctrl+Tab and Shift+Tab pass through untouched.
  layer('tab', 'number-layer').manipulators([
    ...Object.entries(numbers).map(([from, to]) => map(from as FromKeyParam).to(to)),
    ...numberLayerBlocked.map((k) => map(k as FromKeyParam).toNone()),
  ]),

  // ' is the accent dead key on Brazilian - Pro, so it gets the home-row pinky. Only plain
  // presses swap; Shift and the layers still see the physical keys. Last so the number layer
  // blocks these keys first.
  rule('Swap plain ; and \'').manipulators([
    map(';', null, 'caps_lock').to("'"),
    map("'", null, 'caps_lock').to(';'),
  ]),
])
