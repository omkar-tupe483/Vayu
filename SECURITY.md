# Security Policy

## Supported Versions
Vayu receives active security patches on the `main` branch.

## Reporting a Vulnerability
If you discover a security vulnerability within Vayu, please report it privately by opening a security advisory on GitHub or emailing the repository maintainer.

## Security Practices
- Environment secrets are kept exclusively on the server and are never bundled into client assets.
- Strict Content Security Policy (CSP) headers prevent cross-site scripting and unauthorized domain connections.
- Inputs are length-capped and sanitized against prompt-injection attempts.
- In-memory rate limiting prevents abuse of backend generation endpoints.
- All dependencies are monitored and verified via package audits.
