import { atom, read, update } from 'claude-code'
import type { Register, SessionContextUsage, SessionCost, SessionRateLimit } from 'claude-code'

const line = atom({ plugin: 'context-meter', key: 'line' } as const, null)

const k = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`)

export const format = (u: { context: SessionContextUsage; cost?: SessionCost; rateLimits: SessionRateLimit[] }) => {
  const { tokens, window, percent } = u.context
  const parts = [`ctx ${k(tokens ?? 0)}/${k(window)}${percent === undefined ? '' : ` (${Math.round(percent)}%)`}`]
  if (u.cost) parts.push(`$${u.cost.usd.toFixed(2)}`)
  for (const r of u.rateLimits) parts.push(`${r.kind} ${Math.round(r.percentUsed)}%`)
  return parts.join(' · ')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const r = await next(e)
    const text = format(await $.session.usage())
    await update($, line, () => text)
    return r
  })

  on('session.measure', async ($, e, next) => {
    const text = format(e)
    await update($, line, () => text)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const text = await read($, line)
    if (e.props.hasSurvey || text === null) return next(e)

    const { Text } = $.ui.resolve(e)
    return <Text dimColor>{text}</Text>
  })
}
