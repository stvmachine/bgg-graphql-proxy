# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the BGG GraphQL Proxy project.

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-graphql-schema-design.md) | GraphQL Schema Design | Accepted | 2024-01-01 |
| [0002](0002-bgg-api-cache-storage-architecture.md) | BGG API, Cache, and Storage Architecture | Accepted | 2024-01-01 |

## What are ADRs?

Architecture Decision Records (ADRs) are documents that capture important architectural decisions made during the development of a project. They help:

- Document the context and reasoning behind decisions
- Provide a historical record of architectural choices
- Enable team members to understand why certain approaches were taken
- Facilitate future decision-making by showing what was considered

## ADR Template

When creating a new ADR, use the following template:

```markdown
# ADR-XXXX: [Title]

## Status
[Proposed | Accepted | Rejected | Superseded]

## Context
[Describe the context and problem statement]

## Decision
[Describe the architectural decision]

## Consequences
[Describe the positive and negative consequences]

## Alternatives Considered
[Describe alternative approaches that were considered]

## References
[Links to relevant documentation, articles, etc.]

## Review Date
[Date for next review]

## Reviewers
[List of people who should review this ADR]
```

## Review Process

ADRs should be reviewed:
- When initially created
- When the status changes
- Annually or when significant changes occur
- When new team members join the project
