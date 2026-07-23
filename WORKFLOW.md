# AI Workflow Comparison

## Overview

This exercise compares two AI-assisted development approaches while implementing a React Settings Form.

In the first round, I used a single vague prompt with no additional context. In the second round, I used a structured prompt with detailed requirements, constraints, accessibility guidelines, testing instructions, and a verification step.

## Round One (Vague Prompt)

Prompt:
> Create a React settings form.

The generated component contained the basic form fields and a submit button. However, it lacked validation, accessibility improvements, tests, and a verification process. It required additional manual review to identify missing features.

## Round Two (Structured Prompt)

The second prompt specified React Hook Form, Zod validation, accessibility requirements, testing, and a verification loop.

The generated implementation included proper validation, accessible labels, keyboard-friendly controls, disabled submit state, success feedback, and unit tests. The code was more complete and required fewer manual changes.

## Correctness

The structured prompt produced a more reliable implementation because it clearly defined expected behavior and constraints. The vague prompt left many important details unspecified.

## Accessibility

The vague implementation lacked proper accessibility support. The structured implementation included labels for all inputs, aria-live validation messages, and keyboard accessibility.

## Edge Cases

The structured implementation handled empty required fields, invalid email formats, and disabled the submit button while submitting. These cases were either missing or incomplete in the vague implementation.

## Review Effort

Although writing the detailed prompt took slightly longer, it significantly reduced the overall review and debugging effort. The vague prompt appeared faster initially but required more manual corrections afterward.

## AI Mistake I Caught

The first implementation accepted invalid email addresses because no validation was generated. I identified this issue during review and corrected it in the structured version.

## Conclusion

This exercise demonstrated that providing clear requirements, constraints, examples, and verification instructions leads to higher-quality AI-generated code. Structured prompting improved correctness, accessibility, maintainability, and reduced overall development effort.