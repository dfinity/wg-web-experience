# HTTP Authentication

## Appendices

# References

## HTTP Message Signatures

The HTTP Message Signature specification ([RFC 9421](https://datatracker.ietf.org/doc/html/rfc9421)) provides a mechanism to cryptographically sign HTTP requests or responses. This allows for the verification of the integrity and authenticity of the message, protecting against tampering and providing non-repudiation.

Key features of HTTP Message Signatures:

- Supports signing of both requests and responses.
- Can be used with any HTTP method.
- Uses a variety of cryptographic algorithms, including HMAC, ECDSA, and Ed25519.
- Provides a flexible framework for defining signature policies.
- Can be used to secure both public and private APIs.

HMS has several benefits, including:

- Increased security: Protect against attacks such as man-in-the-middle attacks and replay attacks.
- Improved reliability: Ensure that messages are not corrupted in transit.
- Enhanced non-repudiation: Prove that a message was sent or received by a particular party.

HMS is a valuable tool for securing HTTP communications. It is relatively easy to implement and can be used to significantly improve the security of web applications and APIs.

## JSON Web Key

The JSON Web Key (JWK) specification ([RFC 7517](https://datatracker.ietf.org/doc/html/rfc7517)) defines a common way to represent cryptographic keys in JSON format. This allows keys to be easily transferred between different systems and applications.

JWKs can represent both symmetric and asymmetric keys, and they can be used for a variety of purposes, such as signing and encrypting data, and authenticating users.

The JWK specification defines a number of different key types, each of which has its own set of required and optional parameters. This allows for a wide range of keys to be represented in a consistent way.

JWKs are typically used in conjunction with other protocols, such as JSON Web Signature (JWS) and JSON Web Encryption (JWE). These protocols use JWKs to securely transmit data between different systems and applications.

Here are some of the key features of the JWK specification:

- **Standardized format:** JWKs are represented in a standardized JSON format, which makes them easy to parse and process.
- **Flexible:** JWKs can represent a wide range of key types and algorithms.
- **Extensible:** The JWK specification allows for new key types and algorithms to be added in the future.
- **Secure:** JWKs can be used to securely transmit data between different systems and applications.

The JWK specification is a valuable tool for developers who need to securely exchange cryptographic keys. It is a well-designed and flexible specification that is widely used in a variety of applications.

## Base64URL Encoding

Base64URL ([RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648)) encoding is a variant of Base64 encoding that is designed for use in URLs and other web-safe contexts. It is similar to standard Base64 encoding, but it replaces the following characters:

- `'+'` with `'-'`
- `'/'` with `'_'`
- `'='` (padding character) with `'.'`

This makes it possible to use Base64URL-encoded data in URLs without having to worry about the characters being interpreted as special characters by the web browser.

Base64URL encoding is often used to encode binary data, such as images or videos, for transmission over the web. It is also used in some cryptographic applications, such as JSON Web Tokens (JWTs).

Base64URL encoding is a simple and efficient way to encode binary data for transmission over the web. It is supported by all major web browsers and programming languages.

## Forbidden Headers

[Forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name) (ref: [Fetch](https://fetch.spec.whatwg.org/)) are HTTP headers that are not allowed to be set or modified by web browsers. These headers are typically reserved for use by the browser itself or by web servers, and attempting to set them can result in errors or security vulnerabilities.

Some common forbidden headers include:

- `Connection`
- `Content-Length`
- `Date`
- `Host`
- `Transfer-Encoding`

Trying to set these headers in JavaScript code may result in an error, or the header may be ignored by the browser. It is important to avoid setting forbidden headers, as this can interfere with the proper functioning of the browser and web server and potentially open up security holes.
