/** Build LeetCode-style problem content from a short spec */

export function lcBody(task, examples, constraints = []) {
  return {
    description: task,
    examples: examples.length >= 2 ? examples : [
      ...examples,
      { input: "See constraints for edge cases.", output: "Match reference solution.", explanation: "Hidden tests cover additional cases." },
    ].slice(0, 2),
    constraints: constraints.length ? constraints : ["Follow the problem statement.", "Match expected output."],
  };
}

export function pyCases(visible, hidden) {
  return [
    { id: "1", ...visible, isHidden: false },
    ...(hidden ? [{ id: "2", ...hidden, isHidden: true }] : []),
  ];
}
