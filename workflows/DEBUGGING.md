# Debugging Workflow

- Reproduce the issue or inspect reliable logs/errors before changing code.
- Trace the failure to its root cause; do not merely hide the visible symptom.
- Check the relevant call chain, data shape, state transitions, environment/configuration, and API response.
- Form a testable hypothesis and change one coherent cause at a time.
- Avoid broad refactors during a focused bug fix.
- Add a regression test when practical and appropriate.
- Verify both the original failure and likely neighboring regressions.
- Do not fabricate logs, runtime results, or reproductions. If the issue cannot be reproduced, say what was inspected and what remains uncertain.
