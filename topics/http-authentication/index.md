# HTTP Authentication

The following documents together provide a comprehensive understanding of the HTTP Authentication mechanism and its supporting standards.

## Design Document

The HTTP Authentication [design document](./design-doc.md) outlines the design and rationale behind an HTTP Message Signature-based authentication mechanism. It covers the goals, architecture, and implementation details, focusing on providing request integrity, authentication, and prevention of replay attacks while ensuring performance and interoperability.

## Appendices

The design doc [appendices](./appendices.md) provide supplementary information, including references to standards like HTTP Message Signatures ([RFC 9421](https://datatracker.ietf.org/doc/html/rfc9421)), JSON Web Key ([RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517)), and Base64URL encoding ([RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648)). They also discuss forbidden headers and their implications for HTTP authentication.
