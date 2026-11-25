# Comments
- Every module, class, and component (React, Vue, Svelte, web component) has one JSDoc/TSDoc block with a summary and a @remarks section, and nothing else is a doc comment: no @param, @returns, @type, @prop or per-member docs. Types and prop names carry that information.
- The summary is the first 1-2 sentences of the block and says what the thing is.
- The @remarks section says in more detail what it does: what state or props it holds, what it renders or exports, what it guarantees, and what a reader needs to know before using it (side effects, required context or providers, browser APIs it touches).
- Remarks describe the code as it is. They never refer to how it used to work, what it replaced, or what is planned.
- Every other comment is a regular // comment (or /* */ in CSS, <!-- --> in HTML) of 1-2 sentences, and only where the code cannot say it: a browser quirk, a non-obvious CSS hack, a workaround for a library bug, a magic number.
- No giant comments, no comments on every function or prop, no history, no commented-out code, and no TODOs in place of an issue tracker.

# Example:

```ts
/**
 * A dropdown that lets the user pick one option from a searchable list.
 *
 * @remarks
 * Holds the open state and the current search text; the selected value is
 * controlled by the parent through `value` and `onChange`. Closes on outside
 * click and Escape, and traps focus while open. Must be rendered inside a
 * `PortalProvider` because the menu is portaled to the document body.
 */
export function Combobox({ value, onChange, options }: ComboboxProps) {
  // Safari fires blur before click on the menu, so selection waits a tick.
  ...
}
```