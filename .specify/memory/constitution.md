<!--
Sync Impact Report
==================
Version change: (template) → 1.0.0
Bump rationale: Initial ratification — first concrete constitution replacing the
unfilled template. MAJOR baseline established.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Clean & Layered Architecture
  - [PRINCIPLE_2_NAME] → II. Test-First Development (NON-NEGOTIABLE)
  - [PRINCIPLE_3_NAME] → III. Data Integrity & Security
  - [PRINCIPLE_4_NAME] → IV. Clean Code, DRY & KISS
  - [PRINCIPLE_5_NAME] → V. Purposeful Design Patterns
  - (added)           → VI. UX Simplicity & Accessibility

Added sections:
  - Technology & Architecture Constraints (replaces [SECTION_2_NAME])
  - Development Workflow & Quality Gates (replaces [SECTION_3_NAME])

Removed sections: none

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate present; no change needed
  ✅ .specify/templates/spec-template.md — aligns (tech-agnostic requirements); no change needed
  ✅ .specify/templates/tasks-template.md — aligns (test-first ordering, layered paths); no change needed

Follow-up TODOs: none — all placeholders resolved.
-->

# ImobiliariaApp Constitution

## Core Principles

### I. Clean & Layered Architecture

The system MUST be organized into explicit layers with a strictly inward
dependency direction: Domain → Application → Infrastructure/Presentation. The
Domain layer MUST NOT depend on any framework, database, or UI concern. The
backend (ASP.NET Core Web API) exposes the Application layer through controllers;
the frontend (React/Angular SPA) consumes it strictly over the HTTP contract.
Business rules MUST live in the Domain/Application layers, never in controllers,
UI components, or persistence code. Cross-layer leakage (e.g., EF entities
returned to the UI, SQL in a component) is a violation that MUST be corrected
before merge.

**Rationale**: Real estate software carries long-lived business rules (listings,
contracts, commissions). Isolating them from volatile UI and storage choices
keeps the core testable and lets frameworks change without rewriting the domain.

### II. Test-First Development (NON-NEGOTIABLE)

TDD is mandatory for all domain and application logic: write the test, watch it
fail, then implement to make it pass (Red-Green-Refactor). Every functional
requirement MUST be covered by at least one automated test. Bug fixes MUST begin
with a failing test that reproduces the defect. Pull requests that add or change
behavior without accompanying tests MUST NOT be merged.

**Rationale**: Tests written first define the contract and prevent regressions in
financial and client-facing data where silent errors are costly.

### III. Data Integrity & Security

Client, property, and financial data MUST be protected end to end. All external
input MUST be validated at the Application boundary before use. Authentication and
authorization MUST guard every non-public endpoint; access to a resource MUST be
checked against the caller's rights. Secrets MUST NOT be committed to the
repository. Sensitive operations (create/update/delete of core records, auth
events) MUST produce an audit trail. Data at rest and in transit MUST use
encryption appropriate to its sensitivity (HTTPS is the minimum for transit).

**Rationale**: The application handles personal and financial records; a breach or
corruption directly harms clients and legal standing. Integrity and security are
not optional features.

### IV. Clean Code, DRY & KISS

Code MUST be readable and self-explanatory: intention-revealing names, small
focused functions, and minimal nesting. Duplicated logic MUST be extracted to a
single source of truth (DRY). Prefer the simplest solution that satisfies the
requirement (KISS); do not build for hypothetical futures (YAGNI). New code MUST
match the surrounding style, and any code touched SHOULD be left at least as clean
as it was found.

**Rationale**: A small team sustains velocity only when the codebase stays
comprehensible. Simplicity and non-duplication reduce defects and onboarding cost.

### V. Purposeful Design Patterns

Established design patterns (Repository, Factory, Strategy, Dependency Injection,
etc.) MUST be applied where they solve a real, present problem — and only then.
Patterns MUST NOT be introduced speculatively or to add ceremony. When a pattern
is chosen, its use MUST be consistent across the codebase so contributors can rely
on convention. Any abstraction that increases complexity without a demonstrated
need MUST be justified in the plan's Complexity Tracking or removed.

**Rationale**: Patterns are tools for managing real complexity; used reflexively
they become overhead that contradicts KISS. Deliberate, consistent use keeps the
codebase both flexible and simple.

### VI. UX Simplicity & Accessibility

User interfaces for agents and clients MUST be simple, consistent, and
task-focused, minimizing the steps to complete core workflows. Interfaces MUST
meet WCAG 2.1 AA as the accessibility baseline: keyboard navigability, sufficient
contrast, labeled controls, and screen-reader compatibility. User-facing errors
MUST be clear and actionable. Speculative or rarely used UI features SHOULD be
deferred in favor of the primary journeys.

The application must support multilingual capabilities, including Brazilian Portuguese, 
English, and Spanish. The option to toggle the language of the entire website must be 
integrated into the header, represented by three flags: Brazil, Spain, and the 
United Kingdom. Clicking a specific flag should immediately transition the website to 
the selected language.

**Rationale**: The product serves non-technical real estate professionals and
their clients; usability and accessibility determine adoption and legal
compliance more than feature count.

## Technology & Architecture Constraints

- **Backend**: ASP.NET Core Web API (.NET 10), organized by the layered architecture
  in Principle I.
- **Frontend**: A single-page application in React or Angular, consuming the API
  strictly over its published HTTP contract; no direct database access.
- **API contract**: RESTful, versioned, and documented (e.g., OpenAPI). Breaking
  contract changes require a new version.
- **Persistence**: A relational database is the default for core records;
  migrations MUST be version-controlled and reversible where feasible.
- **Configuration & secrets**: Environment-based configuration; secrets supplied
  at runtime, never hard-coded or committed.
- **Testing tooling**: Automated unit and integration tests run in CI; the build
  MUST fail on test failures.

## Development Workflow & Quality Gates

- **Branch & review**: Work happens on feature branches merged via pull request.
  Every PR requires at least one review (self-review with checklist is acceptable
  for a solo maintainer) confirming constitution compliance.
- **Quality gates before merge**: build passes, all tests green, linting/formatting
  clean, and new behavior is covered by tests.
- **Spec-driven flow**: Features follow the Spec Kit flow (specify → plan → tasks →
  implement). The plan's Constitution Check gate MUST pass before implementation.
- **Versioning**: The product and its API follow Semantic Versioning
  (MAJOR.MINOR.PATCH).
- **Complexity justification**: Any deviation from these principles MUST be
  recorded in the plan's Complexity Tracking with the reason and the simpler
  alternative that was rejected.

## Governance

This constitution supersedes other development practices; where guidance conflicts,
the constitution wins. Amendments are made by editing this file via pull request
with a short rationale in the description; approval by the maintainer is required.

Versioning of this constitution follows Semantic Versioning:

- **MAJOR**: Backward-incompatible governance changes or removal/redefinition of a
  principle.
- **MINOR**: A new principle or section, or materially expanded guidance.
- **PATCH**: Clarifications and wording fixes with no semantic change.

All pull requests MUST verify compliance with these principles; reviewers reject
non-compliant changes unless a justified exception is recorded in Complexity
Tracking. This being a small-team project, ceremony is kept lightweight, but the
gates above are not skippable. Runtime and contributor guidance lives in
`README.md` and the `.specify/` templates, which MUST stay consistent with this
constitution.

**Version**: 1.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
