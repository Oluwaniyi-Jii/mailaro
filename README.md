# Mailaro

Personal MailSuite-style email tracker.

## Product Direction

Mailaro helps a person understand what happens after they send an email. The first useful version focuses on Gmail, open tracking, link tracking, notifications, and a small activity dashboard.

The product is built around one shared event system:

```text
Email sent
	|
	+--> Open event ----+
	|                   |
	+--> Click event ---+--> Timeline --> Notifications --> Alerts --> Analytics
```

PDF tracking is deliberately separate. It can be added later without changing the earlier tracking model.

## First Shippable Version

The first release is intentionally small:

1. Google login and Gmail permission setup
2. Chrome extension support
3. Track or untrack an outgoing Gmail message
4. One tracking identity for each recipient
5. Open pixel and open history
6. Link rewriting and click history
7. Tracking indicators inside Gmail
8. Browser and email notifications
9. A basic activity dashboard

The milestone is simple: send an email, have the recipient open or click it, and see the event quickly.

## Priority Order

The stage numbers group related work, but they are not all launch blockers. Build and prove the product in this order:

1. **V1: Core product** — Stages 0 through 7
	- Gmail access, the extension, tracked sends, open tracking, link tracking, notifications, and the basic dashboard.
	- Release this as soon as the end-to-end MVP checks pass.
2. **V1.5: Useful reminders** — Stage 8
	- Not-opened, no-reply, open-spike, and revival alerts.
	- Build these only after real tracking events exist.
3. **V2: Deeper reporting** — Stage 9
	- Time-to-open, time-to-click, trends, domain summaries, and advanced statistics.
	- Derive every metric from the existing event records.
4. **V3: Gmail experience and hardening** — Stages 10 and 11
	- Gmail polish, edge cases, reliability, privacy, security, and release operations.
	- Some reliability and security work is required before V1 launch; the later work improves scale and resilience.
5. **V4: Optional document tracking** — Stage 12
	- Start only after a separate product decision confirms that PDF tracking is worth building.

Do not delay the first release for sophisticated alerts, analytics, or PDF support. The core question is whether a user can send a tracked Gmail message and reliably see opens, clicks, and notifications.

## Commit-by-Commit Roadmap

Each item below is intended to be one small commit. The commit names use plain English and intentionally vary their wording. They do not use `feat:` or `fix:` prefixes. Keep commits in this order unless a later technical discovery requires a small adjustment.

### Stage 0: Decide the Shape

1. **Write down the first release boundaries**
   - State that Gmail, open tracking, link tracking, notifications, and the basic dashboard are the first release.
   - Mark smart alerts, advanced analytics, Gmail polish, and PDF tracking as later work.
   - Make clear that PDFs must not be required by the earlier stages.

2. **Choose the first technology stack**
   - Record the web app, API, database, background worker, and Chrome extension choices.
   - Record how local development, testing, and production deployment will work.
	- Decide where the Gmail message is captured, modified, and sent, and document the trust boundary between the extension and server.
   - Avoid adding a service unless the first release needs it.

3. **Draw the first system boundaries and test the Gmail path**
	- Separate the Gmail extension, web dashboard, API, tracking endpoints, event processor, and notification sender.
	- Give each boundary one clear responsibility.
	- Run a small technical spike before building the full extension: capture a test compose message, preserve its HTML, insert a harmless test marker, and send it through Gmail.
	- Check signatures, inline images, replies, forwards, multiple recipients, plain text, and attachments where the chosen Gmail integration allows it.
	- Record what must happen in the extension and what must happen on the server.

4. **Create the initial project folders**
   - Add folders for the API, dashboard, extension, shared types, database, and tests.
   - Add a short note describing what belongs in each folder.

5. **Make local startup repeatable**
   - Add environment variable examples.
   - Add one command for starting the local services.
   - Add a health endpoint or page so a developer can confirm that the app is running.

6. **Add the first automated check**
   - Run formatting, type checks, linting, and tests from one command.
   - Make an empty or health-check test pass before product code is added.

### Stage 1: Accounts and Gmail Access

7. **Store a user account**
   - Add a user record with an internal ID, email address, display name, and creation time.
   - Keep provider identity separate from the internal user ID.

8. **Show a simple sign-in page**
   - Add a Google sign-in button.
   - Show loading, success, and error states.

9. **Accept the Google identity**
   - Verify the Google identity on the server.
   - Create or find the matching Mailaro user.
   - Start an application session.

10. **Keep the session alive**
	- Add session creation, lookup, expiry, and sign-out.
	- Protect a small private profile endpoint.

11. **Ask for Gmail permission separately**
	- Explain why Gmail access is needed.
	- Request only the scopes needed for sending and reading the user's own message metadata.
	- Handle denial without breaking sign-in.

12. **Save Gmail authorization safely**
	- Store encrypted refresh-token data or use the chosen secret store.
	- Never send provider tokens to the browser or extension page.
	- Add token refresh and revoked-token handling.

13. **Confirm the connected Gmail account**
	- Show the connected address and permission state.
	- Add a disconnect action that removes stored authorization.

14. **Read one Gmail message in development**
	- Add a small server-side Gmail client.
	- Fetch one known message in a development-only check.
	- Normalize the response into an internal message shape.

### Stage 2: Data Model and Event Foundation

15. **Create the tracked email record**
	- Store sender, subject, Gmail message ID, thread ID, sent time, and tracking state.
	- Make the Gmail message ID unique per connected account.

16. **Add recipients to a tracked email**
	- Store recipient address, display name, and a stable recipient ID.
	- Keep recipients separate so one email can have different tracking data per person.

17. **Add a shared tracking event record**
	- Store event type, tracked email ID, recipient ID, event time, request metadata, and a safe event ID.
	- Start with `open` and `click` event types.
	- Keep this table generic enough for notifications and analytics.

18. **Make event writes idempotent**
	- Prevent retries from creating accidental duplicate events when the same event ID is received.
	- Keep repeated genuine opens and clicks as separate events when policy allows them.

19. **Add tracking privacy rules**
	- Store event time, recipient identity, and limited user-agent or source metadata needed for debugging.
	- Do not make IP address, exact location, maps, or location analytics part of the initial product.
	- Add retention and deletion rules.
	- Do not collect more data than the product needs.

20. **Create the event query helpers**
	- Query a recipient's first event, last event, count, and full history.
	- Return empty results cleanly when no event exists.

21. **Write event model tests**
	- Test unique IDs, recipient separation, idempotent writes, first event, last event, count, and history.

### Stage 3: Chrome Extension and Gmail Compose Detection

22. **Create the Chrome extension shell**
	- Add the manifest, background service, Gmail content script, and extension settings page.
	- Limit permissions to the required Gmail pages and API origin.

23. **Detect Gmail compose windows**
	- Find new compose windows and identify their editable body, recipients, subject, and send controls.
	- Handle more than one compose window.

24. **Watch compose changes safely**
	- Detect recipient, subject, body, and send-button changes.
	- Avoid duplicate listeners when Gmail updates its interface.

25. **Add the tracking switch**
	- Show `Tracking: ON` in compose.
	- Allow the sender to turn tracking off before sending.
	- Remember a default tracking choice for the user, while allowing a per-message override.

26. **Add compose tracking options**
	- Add open tracking, link tracking, open notification, and click notification choices.
	- Give each option a predictable default and remember the user's defaults.
	- Make the difference between the default and the current message override clear.

27. **Handle Gmail's changing DOM**
	- Use a small observer and stable selectors.
	- Make the integration fail quietly when Gmail changes unrelated markup.
	- Add a diagnostic mode for local testing.

28. **Test compose detection with fixtures**
	- Add fixtures for one compose window, multiple windows, changed recipients, and a closed draft.

### Stage 4: Sending and Open Tracking

29. **Create a tracking send request**
	- Send the Gmail message metadata and selected tracking options to the API.
	- Validate the current user and connected Gmail account on the server.

30. **Create one tracking identity per recipient**
	- Generate an unguessable tracking token for each recipient.
	- Store only a safe hash or protected form where practical.
	- Never reuse a recipient token across messages.

31. **Build the open pixel URL**
	- Create a tiny image URL containing the message and recipient tracking identity.
	- Keep the URL short and avoid putting personal data in it.

32. **Place the pixel in outgoing HTML**
	- Add the pixel to HTML messages when open tracking is enabled.
	- Preserve the original body and existing HTML.
	- Do not add a pixel when tracking is disabled.

33. **Send the tracked Gmail message**
	- Apply the message changes through Gmail.
	- Save the tracked email and recipient records only after the send is accepted.
	- Return a clear result to the extension.

34. **Receive the first open event**
	- Add the public tracking endpoint.
	- Validate the token, record an open event, and return a transparent one-pixel response.
	- Keep the endpoint fast and safe for repeated requests.

35. **Filter obvious self-opens**
	- Identify opens caused by the sender's own account or known preview behavior.
	- Mark or ignore them according to the documented policy.
	- Keep the raw decision explainable for debugging.

36. **Calculate open summaries**
	- Return first opened time, last opened time, total opens, and open history for each recipient.

37. **Show open status in Gmail**
	- Add a small status indicator beside a sent message.
	- Show sent, opened, open count, and latest open time.
	- Add a link to the detailed tracking view.

38. **Prove the open milestone**
	- Test the full path from send to pixel request to stored event to Gmail status.
	- Record the manual test steps for two different recipient addresses.

### Stage 5: Link Tracking

39. **Find links in outgoing HTML**
	- Parse HTML with a real HTML parser.
	- Preserve link text, attributes, and destination.
	- Ignore mailto links, unsubscribe links, and configured exclusions at first.

40. **Store each tracked link**
	- Add the original URL, link label, position, tracked email, and recipient identity.
	- Keep separate links separate even when their destinations match.

41. **Create tracking URLs**
	- Generate an unguessable click token for each recipient and link.
	- Keep the original destination on the server rather than trusting a browser-provided URL.

42. **Rewrite outgoing links**
	- Replace eligible destinations with Mailaro tracking URLs.
	- Leave the message unchanged when link tracking is off.
	- Prevent double-rewriting when a message is processed twice.

43. **Redirect after recording a click**
	- Add the public click endpoint.
	- Record the click event and redirect to the stored destination.
	- Handle missing, expired, or disabled links with a useful response.

44. **Calculate click summaries**
	- Return first click, last click, total clicks, and click history per recipient and link.

45. **Show links in the email timeline**
	- Display link label, click count, latest click, and recipient.
	- Keep open and click events in one chronological activity view.

46. **Prove the click milestone**
	- Test multiple links, repeated clicks, different recipients, excluded links, and redirect failures.

### Stage 6: Notifications

47. **Create notification preferences**
	- Store browser notification, email notification, first-open, and first-click choices.
	- Use explicit defaults and allow the user to change them.

48. **Queue notification work**
	- Put notification jobs behind the event write so a slow notification provider cannot slow tracking.
	- Make jobs retryable and idempotent.

49. **Send a first-open browser notification**
	- Show `John opened your email` with the subject.
	- Link the notification to the tracking view.

50. **Send a first-click browser notification**
	- Show the recipient and clicked link label.
	- Avoid sending repeated alerts when only the first event is enabled.

51. **Send an open email notification**
	- Create a short email with recipient, subject, time, and a dashboard link.
	- Respect the user's notification preference.

52. **Send a click email notification**
	- Include the clicked link label and time.
	- Do not expose the tracking token.

53. **Add notification controls**
	- Add a settings page for browser and email notifications.
	- Show the current setting in compose when per-message overrides exist.

54. **Test notification behavior**
	- Test first-event rules, disabled preferences, retries, duplicate jobs, and provider errors.

### Stage 7: Basic Tracking Dashboard

55. **Create the tracking list page**
	- List tracked emails with subject, recipients, send time, open status, and click status.
	- Add loading, empty, and error states.

56. **Create the email activity page**
	- Show the email summary and a timeline of sent, open, and click events.
	- Group events by recipient when that improves scanning.

57. **Add basic counters**
	- Show emails tracked, opens, clicks, open rate, and click rate.
	- Define exactly how each number is calculated.

58. **Add recent activity**
	- Show the latest opens and clicks in reverse chronological order.
	- Link every event back to its email.

59. **Add search**
	- Search by subject, recipient, and link label.
	- Make the search work on the server for large datasets.

60. **Add filters and date ranges**
	- Filter by recipient, open or click activity, message, and date range.
	- Keep filter state in the URL so a view can be shared or refreshed.

61. **Export tracking data**
	- Export the currently filtered rows as CSV.
	- Escape commas, quotes, line breaks, and personal data carefully.

62. **Add dashboard access rules**
	- Ensure a user can see only their own tracked messages and events.
	- Test direct access to another user's IDs and tokens.

63. **Test the MVP end to end**
	- Sign in, connect Gmail, send a tracked message, open it, click a link, receive notifications, and inspect the dashboard.

### Stage 8: Smart Alerts from Existing Events (V1.5)

64. **Define alert rules and quiet periods**
	- Add user settings for whether smart alerts are enabled.
	- Decide when repeated activity should be grouped.

65. **Add the not-opened alert**
	- Find messages sent at least 24 hours ago with no valid open event.
	- Make the check repeatable without sending the same alert forever.

66. **Add the no-reply alert**
	- Detect an open message with no detected reply when Gmail data allows it.
	- Clearly label this as an inference rather than a guaranteed fact.

67. **Add the open-spike alert**
	- Detect several opens from one recipient in a short time window.
	- Group the events into one useful alert.

68. **Add the revival alert**
	- Detect a new open after a long inactive period, such as 94 days.
	- Include the time since the previous activity.

69. **Show alerts beside the timeline**
	- Link each alert to the underlying events.
	- Allow the user to dismiss or mute an alert.

### Stage 9: Advanced Analytics (V2)

70. **Add time-to-open values**
	- Calculate send-to-first-open time per recipient and message.

71. **Add time-to-click values**
	- Calculate open-to-first-click time and send-to-first-click time.

72. **Rank links and recipients**
	- Show most-clicked links and most-engaged recipients using existing events.

73. **Draw engagement trends**
	- Show open and click trends over time.
	- Make the selected date range clear.

74. **Add domain analytics**
	- Group events by recipient domain without exposing unrelated users.

75. **Add aggregate statistics**
	- Add totals, averages, medians, and rates where the sample size is meaningful.
	- Explain empty and very small samples in the UI.

76. **Check analytics against raw events**
	- Add tests that compare every metric with hand-calculated event data.

### Stage 10: Gmail Polish and Hardening (V3)

77. **Improve sent-message indicators**
	- Make sent, opened, and clicked states easy to scan.
	- Show a stable layout while data is loading.

78. **Add the Gmail tracking details panel**
	- Show recipient activity, open history, link activity, and a `View tracking` action without leaving Gmail when possible.

79. **Refine compose controls**
	- Make tracking state visible but quiet.
	- Keep open tracking, link tracking, and notification choices easy to change.

80. **Handle Gmail edge cases**
	- Test replies, forwards, drafts, scheduled sends, attachments, plain-text messages, signatures, and multiple accounts.

81. **Improve extension recovery**
	- Recover after Gmail navigation, extension updates, offline periods, and expired sessions.
	- Never block a normal untracked email from sending.

82. **Run an accessibility pass**
	- Add keyboard support, labels, focus states, readable status text, and sufficient contrast.

### Stage 11: Reliability, Privacy, and Release

83. **Add structured application logs**
	- Log event IDs and internal IDs, not tracking tokens or message contents.
	- Add request correlation IDs.

84. **Add service health checks**
	- Check the API, database, queue, Gmail provider, and notification provider separately.

85. **Add rate limits to public tracking endpoints**
	- Limit abusive requests without preventing normal email clients from loading pixels or links.
	- Keep redirect and pixel responses fast.

86. **Add account deletion**
	- Delete or anonymize account data according to the retention policy.
	- Revoke Gmail access and invalidate sessions.

87. **Review provider and browser policies**
	- Check Gmail API, Google OAuth, Chrome Web Store, email, privacy, and consent requirements before launch.

88. **Run a security review**
	- Check authorization, token storage, open redirects, HTML injection, CSV injection, CSRF, XSS, replay, and tenant isolation.

89. **Prepare a staging release**
	- Deploy the API, dashboard, worker, tracking endpoints, and extension test build.
	- Use test Gmail accounts and test notification addresses.

90. **Run the release checklist**
	- Verify sign-in, Gmail connection, tracked send, open, click, notifications, dashboard, deletion, error recovery, and rollback.

91. **Publish the first release**
	- Release the focused Gmail tracker.
	- Watch event delivery, notification failures, extension errors, and support reports.

### Stage 12: PDF Tracking, Only If Needed

92. **Write the PDF product decision**
	- Confirm that users need document tracking enough to justify a new product surface.
	- Keep this decision separate from the email tracking release.

93. **Store a tracked document**
	- Add documents, owners, access identities, expiration, and version records.
	- Reuse the shared event model where the event meaning is the same.

94. **Build a protected PDF viewer**
	- Render a PDF without exposing the source file directly.
	- Add access, expiration, and error states.

95. **Record PDF opens and page views**
	- Track document open, page view, time spent, and download events.
	- Keep document events distinguishable from email opens and clicks.

96. **Add document analytics**
	- Show per-recipient page views, time spent, downloads, and expiration status.
	- Do not change the earlier email dashboard contract unexpectedly.

97. **Test document privacy and expiry**
	- Test unauthorized access, expired documents, repeated views, downloads, and deleted owners.

## Commit Style

Use a commit for one understandable change. Keep the first line short and use a different plain-English form when it reads naturally. Examples:

```text
Write down the first release boundaries
The local app can now start
Store a user account
Ask Google for Gmail access
Keep Gmail tokens out of the browser
Compose windows are detected
Tracking can be turned off before sending
Each recipient gets a private tracking identity
The first open reaches the event store
Links now return to their original destination
John's first open can trigger an alert
Show recent activity on the dashboard
Search the tracking history
The MVP path passes end to end
PDF support remains outside the email release
```

Avoid combining unrelated ideas in one commit. A commit should be easy to review, test, revert, and describe in a release note. Keep implementation commits separate from formatting-only changes and deployment changes.

## Milestones

### Milestone A: A developer can run the app

Complete Stage 0. The project starts locally, checks pass, and the boundaries are written down.

### Milestone B: A user can connect Gmail

Complete Stages 1 and 2. A signed-in user can grant Gmail access, and the server can store the data model safely.

### Milestone C: Opens work

Complete Stages 3 and 4. A user can send a tracked message and see a recipient open event.

### Milestone D: Clicks work

Complete Stage 5. A user can follow link activity without changing the destination.

### Milestone E: The MVP is useful

Complete Stages 6 and 7. Notifications and the basic dashboard make tracking useful without opening developer tools.

### Milestone F: The product gets smarter

Complete Stages 8 and 9 only after the MVP has real event data.

### Milestone G: Gmail feels native

Complete Stage 10 after the core workflow is stable.

### Milestone H: Release with confidence

Complete Stage 11 before public launch.

### Milestone I: Optional document tracking

Start Stage 12 only after a separate product decision supports it.
