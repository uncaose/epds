# EPDS Work Router

Classify every natural-language request before implementation. The router does not do all work itself. It determines the task type, required perspectives, approval gate, and next artifact.

## TRIVIAL

Examples: copy change, isolated bug, narrow style change, existing test adjustment.

- Perspectives: Builder or Minimum Change
- Implementation: allowed
- Required: reproduction or test check

## FEATURE

Examples: a user-flow change with a known problem and success criteria.

- Perspectives: Product Owner + Builder + Test Engineer
- Implementation: after acceptance criteria and non-goals are confirmed
- Required: affected user scenario and tests

## EXPLORATORY

Examples: idea, unclear feature direction, user problem research.

- Perspectives: Product Strategist + UX Researcher
- Implementation: not allowed
- Required: problem, assumptions, options, minimum experiment, metrics, stop rule

## STRATEGIC

Examples: pricing, monetization, retention, growth, core game loop, AI adoption, content model, platform shift.

- Perspectives: Product Strategist + Reality Checker + Domain Specialist when necessary
- Implementation: not allowed before owner approval
- Required: alternatives including do nothing, cost, risk, metric, decision rule

## SENSITIVE

Examples: PII, payment, authentication, authorization, API key, recording, deletion, external transmission, production data.

- Perspectives: Privacy/Security Reviewer + Architect
- Implementation: not allowed before owner approval
- Required: data flow, threat/risk review, rollback, verification

## RELEASE

Examples: deployment, performance, infrastructure, CI/CD, store submission.

- Perspectives: Release Engineer + Test Engineer + Reality Checker
- Production deployment: not allowed before independent GO
- Required: staging, rollback, observability, real-environment evidence

## GROWTH

Examples: landing page, pricing message, ASO, short-form content, advertising, community, acquisition/conversion.

- Perspectives: Growth Strategist + Experiment Designer
- Execution: after experiment design
- Required: audience, channel, message, cost limit, metric, stop rule

## Output format

