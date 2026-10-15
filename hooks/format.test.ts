import { expect, test } from 'claude-code/testing'

import { format } from './register'

test('formats context, cost and rate limits', () => {
  expect(
    format({
      context: { tokens: 84_312, window: 200_000, percent: 42 },
      cost: { usd: 1.234 },
      rateLimits: [{ kind: 'five_hour', percentUsed: 17.6 }],
    }),
  ).toBe('ctx 84k/200k (42%) · $1.23 · five_hour 18%')
})

test('before first response', () => {
  expect(format({ context: { window: 1_000_000 }, rateLimits: [] })).toBe('ctx 0/1000k')
})
