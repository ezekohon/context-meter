# context-meter

Claude Code mod that pins a live usage line under the prompt, updated after every turn:

```
ctx 84k/200k (42%) · $1.23 · five_hour 18% · seven_day 5%
```

Context tokens / window, session cost, and rate-limit usage.

## Install

```
/plugin install context-meter --marketplace ezekohon/context-meter
```

Or point `CLAUDE_CODE_PLUGIN_DIRS` at a local clone.

## Develop

```
claude plugin validate .
claude plugin test .
```
