export interface DiffCharacter {
  value: string;
  correct: boolean;
  missing?: boolean;
}

/**
 * Alinea una respuesta con la esperada usando distancia de edición. Así una omisión no desplaza
 * y marca como incorrecto todo lo que viene después.
 */
export function alignAnswer(input: string, expected: string): DiffCharacter[] {
  const actual = [...input];
  const target = [...expected];
  const costs = Array.from({ length: actual.length + 1 }, () =>
    Array<number>(target.length + 1).fill(0),
  );

  for (let i = 0; i <= actual.length; i += 1) costs[i][0] = i;
  for (let j = 0; j <= target.length; j += 1) costs[0][j] = j;

  for (let i = 1; i <= actual.length; i += 1) {
    for (let j = 1; j <= target.length; j += 1) {
      const same = actual[i - 1].toLocaleLowerCase() === target[j - 1].toLocaleLowerCase();
      const substitution = costs[i - 1][j - 1] + (same ? 0 : 1);
      costs[i][j] = Math.min(substitution, costs[i - 1][j] + 1, costs[i][j - 1] + 1);
    }
  }

  const aligned: DiffCharacter[] = [];
  let i = actual.length;
  let j = target.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const same = actual[i - 1].toLocaleLowerCase() === target[j - 1].toLocaleLowerCase();
      const diagonalCost = costs[i - 1][j - 1] + (same ? 0 : 1);
      if (costs[i][j] === diagonalCost) {
        aligned.push({ value: actual[i - 1], correct: same });
        i -= 1;
        j -= 1;
        continue;
      }
    }
    if (i > 0 && costs[i][j] === costs[i - 1][j] + 1) {
      aligned.push({ value: actual[i - 1], correct: false });
      i -= 1;
      continue;
    }
    aligned.push({ value: '＿', correct: false, missing: true });
    j -= 1;
  }

  return aligned.reverse();
}
