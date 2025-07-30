# HTTP Authentication Design Doc Appendices

## References

### HTTP Message Signatures

The HTTP Message Signature specification ([RFC 9421](https://datatracker.ietf.org/doc/html/rfc9421)) defines a mechanism for creating, encoding, and verifying digital signatures or message authentication codes (MACs) over components of an HTTP message. This ensures the integrity and authenticity of HTTP requests and responses, even when messages are transformed by intermediaries or partially unknown to the signer.

#### Key Features:

- Supports signing of both requests and responses across any HTTP method.
- Employs a variety of cryptographic algorithms, including HMAC, ECDSA, and Ed25519.
- Provides a flexible framework for defining signature policies tailored to application needs.
- Enables secure communication for both public and private APIs.

#### Benefits:

- **Enhanced Security:** Protects against tampering, man-in-the-middle attacks, and replay attacks.
- **Reliability:** Ensures messages remain unaltered during transit.
- **Non-Repudiation:** Verifies that a message was sent or received by a specific party.

Additionally, the specification introduces mechanisms for negotiating the use of signatures in ongoing HTTP exchanges, making it a versatile tool for securing HTTP communications. By focusing on application-relevant components and adhering to strict canonicalization rules, HTTP Message Signatures simplify implementation while maintaining robust security guarantees.

### JSON Web Key

The JSON Web Key (JWK) specification ([RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517)) defines a standardized JSON-based format for representing cryptographic keys. This format facilitates the secure exchange of keys between systems and applications.

JWKs can represent both symmetric and asymmetric keys and are commonly used for signing, encryption, and authentication purposes. The specification supports a wide range of key types and algorithms, ensuring flexibility and extensibility.

#### Key Features:

- **Standardized Format:** JWKs use a consistent JSON structure, making them easy to parse and process.
- **Flexibility:** Supports various key types and cryptographic algorithms.
- **Extensibility:** Allows for the addition of new key types and parameters as needed.
- **Interoperability:** Designed for use with protocols like JSON Web Signature (JWS) and JSON Web Encryption (JWE).

JWKs are essential for developers needing a secure and interoperable method to exchange cryptographic keys. Their design emphasizes simplicity, security, and compatibility with existing standards.

### Base64URL Encoding

Base64URL encoding, as defined in [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648), is a URL-safe variant of Base64 encoding. It modifies the standard Base64 alphabet by replacing:

- `'+'` with `'-'`
- `'/'` with `'_'`
- Omitting the padding character `'='` when not required.

This ensures compatibility with URLs and filenames, where certain characters have special meanings.

#### Key Features:

- **Web-Safe:** Avoids characters that may be misinterpreted in URLs or file paths.
- **Efficient Encoding:** Encodes binary data, such as cryptographic keys or tokens, in a compact and readable format.
- **Padding Behavior:** Padding (`=`) is optional and often omitted when the data length is known, reducing overhead.

#### Common Use Cases:

- Encoding JSON Web Tokens (JWTs).
- Transmitting binary data in web applications.
- Ensuring safe data representation in query strings and headers.

By adhering to the guidelines in RFC 4648, Base64URL encoding provides a robust and interoperable method for encoding data in web-safe contexts.

### Forbidden Headers

[Forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name) are HTTP headers that web browsers restrict from being set or modified via JavaScript. These restrictions, defined in the [Fetch specification](https://fetch.spec.whatwg.org/), ensure the security and proper functioning of browser-server communication.

#### Common Forbidden Headers:

- `Connection`: Managed by the browser to control connection persistence.
- `Content-Length`: Automatically calculated by the browser based on the request body.
- `Date`: Set by the server to indicate the time of message generation.
- `Host`: Specifies the domain of the server; handled internally by the browser.
- `Transfer-Encoding`: Used for chunked data transfer, which is managed by the browser.

#### Why Are These Headers Restricted?

Forbidden headers are reserved for browser or server use to:

- Prevent security vulnerabilities, such as header injection attacks.
- Ensure compatibility with HTTP standards and intermediaries.
- Avoid conflicts with browser-managed behaviors.

#### Developer Guidance:

- **Avoid Manual Overrides**: Let the browser handle these headers to maintain security and compliance.
- **Use Alternative Headers**: For custom metadata, use headers like `X-Custom-Header` or `Authorization`.
- **Understand Browser Behavior**: Refer to the [Fetch specification](https://fetch.spec.whatwg.org/) for detailed rules on header management.

By adhering to these guidelines, developers can ensure secure and reliable HTTP communication.

## Related Initiatives

### Community Hosted HTTP Gateways

This initiative empowers ICP community members to host and manage HTTP Gateways independently, reducing reliance on the DFINITY-run HTTP Gateway ([dfinity/ic-gateway/](https://github.com/dfinity/ic-gateway/)). By exploring simplified hosting solutions, such as serverless platforms, it lowers technical barriers, streamlines deployment, and minimizes maintenance efforts. The goal is to foster a decentralized, resilient ecosystem of HTTP Gateways, enabling the community to focus on building applications rather than managing infrastructure.

### Upgrade to Update Call Cache

This initiative aims to enhance the efficiency of the HTTP Gateway by introducing a caching mechanism for the "Upgrade to Update Call" feature. By caching decisions to upgrade query calls to update calls, the system reduces redundant query calls to canisters, improving response times and lowering computational overhead.

#### Key Benefits:

- **Efficiency:** Minimizes unnecessary query calls, optimizing resource usage.
- **Performance:** Accelerates response times for frequently accessed resources.

#### Standards Alignment:

The caching mechanism will adhere to established HTTP caching standards, ensuring compatibility and fostering a robust, standardized approach.

#### Trust and Reliability:

Response verification is integral to this initiative. Before caching any upgrade decision, the system will validate responses to maintain integrity and trustworthiness.

This effort underscores the commitment to improving performance while aligning with HTTP best practices.

### Replica Verification of HTTP Message Signatures

This initiative introduces system APIs for verifying canister and BLS signatures, ensuring secure and efficient communication on the Internet Computer.

#### Purpose

The APIs provide a reliable mechanism for verifying digital signatures, safeguarding the integrity and authenticity of HTTP messages. This is critical for secure interactions between canisters and external systems.

#### Key Benefits

- **Efficiency**: Reduces computational overhead, achieving up to **50% cycle savings** compared to in-canister verification.
- **Scalability**: Frees up canister resources, enabling higher throughput and horizontal scaling.
- **Security**: Supports robust signature schemes like Ed25519, ECDSA, and BLS for diverse application needs.

#### Alignment with Internet Computer Goals

By streamlining signature verification, this initiative enhances scalability, strengthens security, and simplifies the developer experience. It empowers the Internet Computer to support a growing ecosystem while maintaining cost-effectiveness and performance.

1. **Purpose**: Provide a robust mechanism for verifying digital signatures, ensuring the integrity and authenticity of HTTP messages. This is essential for secure communication between canisters and external systems.

2. **Cycle Savings**: By leveraging system APIs, signature verification tasks are executed with significantly reduced computational overhead. Preliminary benchmarks indicate that this approach can save up to **50% of the cycles** compared to traditional in-canister verification methods. These savings directly translate into lower operational costs for developers and increased efficiency for canister operations.

3. **Scalability and Resource Management**: Offloading signature verification to optimized system APIs reduces the resource burden on individual canisters. This allows canisters to allocate more cycles to core application logic, improving throughput and enabling the Internet Computer to handle higher traffic volumes. Additionally, the reduced cycle consumption enhances the platform's ability to scale horizontally, supporting a growing number of applications and users without compromising performance.

4. **Alignment with Broader Goals**: This initiative aligns with the Internet Computer's overarching objectives of scalability and enhancing developer experience. By streamlining signature verification, it simplifies the development process for canister developers while ensuring the platform remains robust and cost-effective.
