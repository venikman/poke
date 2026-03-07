# TS Functional Blueprint

Purpose: generate and review TypeScript in an F#-inspired style for domain safety, explicit states, and pure logic.

## Required patterns

### Exhaustive DU
- Model domain states with discriminated unions and a string `kind` field.
- Every `switch` over a DU must include an exhaustiveness guard:

```ts
default:
  throw new Error(`Unhandled value: ${value satisfies never}`);
```

- For total mappings, require:

```ts
const map = { ... } satisfies Record<UnionType, Target>;
```

### Branded IDs
- Define nominal brands for identifiers and critical units.

```ts
declare const brandSymbol: unique symbol;
type Brand<T, Tag extends string> = T & { readonly [brandSymbol]: Tag };
```

- Domain APIs must accept branded types, not raw primitives.

### Immutable records and collections
- Domain records: all properties `readonly`.
- Collections: `ReadonlyArray<T>`.
- Do not mutate function arguments or shared state.

### Failure and option semantics
- Avoid `null`.
- Use `T | undefined` for optional values.
- For domain failures, return `Result<T, E>` unions instead of throwing.

### Classification-first flow
- Move parsing/classification into matcher functions that return DUs.
- Handle outputs via exhaustive switch.

### Module style
- Use file modules + companion object/function set.
- Avoid classes for domain logic.

## Prompt header (copy/paste)
Use this header before asking for implementation code:

```text
Use TS Functional Blueprint rules:
1) Domain states as discriminated unions with `kind`.
2) Exhaustive DU switches with `satisfies never` in default.
3) Total mappings use `satisfies Record<Union, T>`.
4) Domain objects immutable (`readonly`), collections `ReadonlyArray`.
5) Branded nominal types for IDs and critical measurements.
6) No exceptions for domain failures: use `Result<T,E>`.
7) Classification-first matcher functions, then exhaustive handling.
8) Module-per-domain-type with pure functions; no classes.
```

## Review checklist
- [ ] No boolean blindness for domain decisions; reasons encoded in unions.
- [ ] No raw `string` IDs in domain APIs where brand exists.
- [ ] No mutable domain records or in-place collection mutation.
- [ ] Every DU switch is exhaustive (`satisfies never`).
- [ ] Mapping objects over union keys are total (`satisfies Record<...>`).
- [ ] Domain logic is pure and side-effect free.
