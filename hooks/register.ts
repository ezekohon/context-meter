import type { Register, SessionContextUsage, SessionCost, SessionRateLimit } from 'claude-code'

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
    $.ui.status(format(await $.session.usage()))
    return r
  })

  on('session.measure', ($, e, next) => {
    $.ui.status(format(e))
    return next(e)
  })
}
