# HTTP Authentication Design Doc

## Introduction

This document outlines the design and rationale behind an HTTP Message Signature based authentication mechanism for HTTP calls made to Internet Computer canisters via the HTTP Gateway Protocol. The goal of this mechanism is to provide request integrity, authentication, and prevention of replay attacks while considering performance optimizations and interoperability with existing HTTP Signature specifications.

The document focuses on the canister and client levels, ensuring flexibility for developers to implement custom solutions. The core protocol and the HTTP Gateway Protocol remain unaffected.

The design goals of this authentication mechanism include security requirements such as request integrity, authentication, and prevention of replay attacks, performance considerations for signature verification overhead on boundary nodes and canisters, interoperability with existing HTTP Signature specifications, and a positive developer experience encompassing ease of implementation and compatibility with existing authentication mechanisms.

## Scope

The scope of this authentication mechanism encompasses the interactions between clients, boundary nodes, and canisters. It aims to provide request integrity, authentication, and prevention of replay attacks while considering performance optimizations and interoperability with existing HTTP Signature specifications.

This feature operates exclusively on the canister and client levels, and therefore does not impact the core protocol or the HTTP Gateway Protocol in any way. HTTP Gateways simply forwards any request headers without interpreting their content and the replica receives an anonymously signed request as usual.

## Design Goals

### Security

This design should replicate the security model of the existing ICP [authentication protocol](https://internetcomputer.org/docs/current/references/ic-interface-spec#authentication) as much as possible. Including security guarantees for:

- Request integrity and authentication.
- Prevention of replay attacks.

### Performance Considerations

- Signature verification overhead on boundary nodes and canisters.

### Interoperability

Compliance with the existing HTTP Signature specifications and other relevant standards is sought after as much as possible.

Using standard browser APIs is also important.

### Developer Experience

- Ease of implementation in frontend applications.
- Compatibility with IC’s existing authentication mechanisms.

It should be kept in mind that responses created for specific users can't be certified for the authenticated user. Even if you include the target principal in the request path, query parameter, or header, this doesn't prevent users from requesting another user's data. The canister could reject these requests, but this wouldn't pass response verification. A possible solution is to extend response verification to include authentication support, potentially using CEL expressions.

## Background and Motivation

### Current Authentication Mechanisms on the IC

- Existing approaches (e.g., anonymous requests, ingress signatures).
- Limitations of current methods.

### Why HTTP Message Signatures?

- Benefits of request integrity, non-repudiation, and authentication.
- Comparison with alternative approaches (e.g., OAuth, JWT, mTLS).

## High-Level Architecture

- Request flow: Client → Boundary Node → Canister.

## Design Overview

### The `Signature` and `Signature-Input` headers

The `Signature` and `Signature-Input` headers are used in an entirely spec-compliant way, albeit with a few restrictions, to improve security.

When creating a signature and determining the signature parameters, clients **_must_** do this in a consistent manner so that repeated attempts to create a signature on the same request will output the same signature (barring timestamps and nonces). The order of signature parameters must exactly match the order that HTTP fields and derived components were used to build the signature input.

#### HTTP Fields

[Forbidden headers](./appendices.md#forbidden-headers) cannot be controlled programmatically and so must not be included in the HTTP Message Signature. This unfortunately includes the `Accept-Encoding` header, which is discussed further in the [Security Considerations](#security-considerations) section.

The `Content-Digest` header **_should_** be included, if the request body would affect the canister’s response. Generic implementations should include this by default, with the option for developers to explicitly exclude it they want to.

Other request headers **_should_** be included, if they would affect the canister’s response. Generic implementations should allow developers to include any additional request headers that they want to include in the signature.

#### Derived Components

The HTTP Message Signatures specification includes the concept of [derived components](https://datatracker.ietf.org/doc/html/rfc9421#name-derived-components), that allow for including information in a signature that are not covered by standard HTTP fields.

[@method](https://datatracker.ietf.org/doc/html/rfc9421#content-request-method) **_should_** be included, if the request’s method would affect the canister’s response.

[@target-uri](https://datatracker.ietf.org/doc/html/rfc9421#content-target-uri) **_should not_** be included. This component includes the URL protocol, hostname, path and query parameters. Query parameters should be optional and canisters should be agnostic of protocol and hostname, particularly the hostname as it is usually controlled by a centralized party.

[@authority](https://datatracker.ietf.org/doc/html/rfc9421#content-request-authority) **should not** be included. This component corresponds to the URL hostname and canisters should behave agnostically of the URL hostname since they are normally controlled by a centralized party.

[@scheme](https://datatracker.ietf.org/doc/html/rfc9421#content-request-scheme) **should not** be included. This component corresponds to the URL protocol and canisters should behave agnostically of the URL protocol.

[@request-target](https://datatracker.ietf.org/doc/html/rfc9421#content-request-target) **should not** be included. This component includes the URL path and query parameters. Query parameters should be optional.

[@path](https://datatracker.ietf.org/doc/html/rfc9421#content-request-path) **should** be included. This component corresponds to the URL path.

[@query](https://datatracker.ietf.org/doc/html/rfc9421#content-request-query) **_should_** be included, if there are any request query parameters present that would affect the canister’s response.

[@query-param](https://datatracker.ietf.org/doc/html/rfc9421#content-request-query-param) **should** be included, if there are any request query parameters present that would affect the canister’s response and they are [form URL encoded](https://url.spec.whatwg.org/#application/x-www-form-urlencoded).

[@status](https://datatracker.ietf.org/doc/html/rfc9421#content-status-code) **should not** be included. This is only for responses.

All optional components **_should_** be included by default by any generic implementations, with the option for developers to explicitly exclude them if they need to.

#### Signature Parameters

### The `Signature-Key` header

The `Signature-Key` header is a custom designed header introduced as part of this design to facilitate the transmission of the public key that was used to generate the signature in the `Signature` header, along with the corresponding delegation, if relevant.

- `bigint` is not JSON-serializable so the `string` data type is used instead.
- Signatures are [representation-independent hash](https://internetcomputer.org/docs/current/references/ic-interface-spec#hash-of-map).

The optional `delegations` array is based on ICP’s current [authentication mechanism](https://internetcomputer.org/docs/current/references/ic-interface-spec#authentication), adapted for web using concepts from the [JWK format](./appendices.md#json-web-key).

```typescript
type SignatureKey = BaseSignatureKey | DelegatedSignatureKey;

interface BaseSignatureKey {
  pubKey: Jwk;
}

interface DelegatedSignatureKey extends BaseSignatureKey {
  principal: string;
  delegations: Delegation[];
}

interface Delegation {
  delegation: {
    pubKey: string; // Base64 encoded public key
    expiration: string; // Expiration of the delegation, in nanoseconds since 1970-01-01.
    targets: string[]; // Array of principals in their textual format.
  };
  sig: string; // Base64URL-encoded signature on the `delegation` map.
}

type Jwk = JwkEc | JwkEd25519;

interface BaseJwk<Kty extends string, Crv extends string> {
  key: Kty; // Key type
  crv: Crv; // Key curve
}

interface JwkEcdsa extends BaseJwk<'EC', 'P-256' | 'secp256k1'> {
  x: string; // Base64URL-encoded X coordinate
  y: string; // Base64URL-encoded Y coordinate
}

interface JwkEd25519 extends BaseJwk<'OKP', 'Ed25519'> {
  x: string; // Base64URL-encoded public key
}
```

The final value of the `Signature-Key` header is the [Base64URL](./appendices.md#base64url-encoding)-encoded, JSON-encoded `SignatureKey` object.

### Signature Generation and Verification

- Signed HTTP headers and payloads.
- Signature formats and algorithms.
- Key distribution and management.

### Signature Verification

The signature input **_must_** be recreated in the same manner as the client. This can be accomplished by respecting the order of signature parameters provided by the client in the `Signature-Input` header.

Handling Expired and Replayed Requests

- Timestamp inclusion and validation.
- Use of nonce or challenge-response mechanisms.

### Integration with IC Identity System

- Mapping HTTP Signatures to IC principals.
- Compatibility with Internet Identity and WebAuthn.

### Replica Verification of HTTP Message Signatures

## Implementation Details

- **Client-Side Implementation**
  - Libraries and tools for signing requests.
  - Example code for generating HTTP signatures.
- **Boundary Node Role**
  - Signature verification process.
  - Handling invalid or missing signatures.
- **Canister Handling of Authenticated Requests**
  - Propagating authentication information to canisters.
  - Use cases for authentication (e.g., access control, API rate limiting).

## Security Considerations

- **Threat Model**
  - Potential attack vectors (e.g., replay attacks, key compromise).
- **Mitigation Strategies**
  - Request expiration and nonce validation.
  - Secure key storage and rotation.

### The `Accept-Encoding` header

The `Accept-Encoding` header cannot be programmatically controlled because it is a [forbidden header](./appendices.md#forbidden-headers). Any attempt to set this header will either result in an error or be overridden by the user agent. Therefore, it cannot be safely included in an HTTP Message Signature.

The current practice of making unauthenticated HTTP requests is no less secure than sending authenticated requests that do not include the `Accept-Encoding` header in the authentication. However, these unauthenticated requests are typically limited to retrieving static assets via `GET` requests and do not modify sensitive user data. In both scenarios, an untrusted intermediary could potentially initiate a denial of service attack by manipulating the `Accept-Encoding` header to request an unsupported encoding by the user agent.

To mitigate this, canister developers should only support encodings that are widely compatible with user agents. Currently, Gzip and Brotli are broadly supported, but Zstd should be avoided due to its lack of support in Safari and other less common browsers. Note that end users running the [local HTTP proxy](https://github.com/dfinity/http-proxy) could also resolve these security concerns.

### Target Canister Method / Call Type

Standard ICP [Request ID generation](https://internetcomputer.org/docs/current/references/ic-interface-spec#request-id) includes the target `request_type` and `method_name`. These concepts are not included in the HTTP Message Signature for two reasons:

- The [Upgrade to Update Call](https://internetcomputer.org/docs/current/references/http-gateway-protocol-spec#upgrade-to-update-calls) feature of the HTTP Gateway Protocol requires an HTTP Gateway to reissue a `query` call as an `update` call on behalf of the user. This would require changing the parameters of the request and resigning it, which the HTTP Gateway is unable to do.
- `method_name` essentially corresponds to the `@method` and `@path` derived components.
- `request_type` is always `”call”` so there’s no mapping for that.

As long as canisters only use this method of request authentication on the `http_request` and `http_request_update` canister methods, the exclusion of `request_type` and `method_name` should not pose any security risks.

## Performance and Scalability

### Impact on Clients

Using this protocol should be much more efficient for clients than using the standard agent. The signature generation and signing may be similar in terms of computation costs, but the replacement of CBOR and Candid encoding with JSON and base64 encoding greatly reduces the overall burden. Bundle size will be significantly smaller by excluding the entire agent library and replacing it with an extremely small library handling this signature scheme (PoC library bundle size is \~1kb Gzipped).

### Impact on HTTP Gateways

HTTP Gateways will receive a much larger portion of traffic if they are no longer just handling requests for static assets, but also API calls as well. [Community Hosted HTTP Gateways](./appendices.md#community-hosted-http-gateways) would help to mitigate this.

### Impact on API Boundary Nodes

There is no significant additional overhead for API Boundary Nodes.

Leveraging the [Upgrade to Update Call](https://internetcomputer.org/docs/current/references/http-gateway-protocol-spec#upgrade-to-update-calls) feature of the HTTP Gateway will result in making more `query` calls that would have originally been made directly as `update` calls using the agent. [Caching the Upgrade to Update Call decision](./appendices.md#upgrade-to-update-call-cache) would help to mitigate this.

## Benchmarks

The cycle cost of verifying canister signatures for the Internet Identity delegations may be quite significant. [Replica Verification of HTTP Message Signatures](./appendices.md#replica-verification-of-http-message-signatures) would help to mitigate this.

Cycles calculated based on the [execution cost](https://internetcomputer.org/docs/references/cycles-cost-formulas#execution) at the time of writing.

Total cycles = 5,000,000 + `cycle_cost` \* `instruction_count`.

Cycle to USD = $0.00000000001325 USD

| Name                                                        | Instructions  | Cycles        | Cost             | Parse Headers | Validate Signature | Validate Delegation Chain |
| ----------------------------------------------------------- | ------------- | ------------- | ---------------- | ------------- | ------------------ | ------------------------- |
| Header parsing                                              |               |               |                  |               |                    |                           |
| `parse_http_signature_headers_http_get`                     | 1,559,946     | 6,559,946     | 0.0000869192845  | Yes           | No                 | No                        |
| `parse_http_signature_headers_http_post`                    | 1,557,136     | 6,557,136     | 0.000086882052   | Yes           | No                 | No                        |
| Delegation chain verification                               |               |               |                  |               |                    |                           |
| `validate_delegation_and_get_principal_http_get`            | 1,647,814,518 | 1,652,814,518 | 0.0218997923635  | No            | No                 | Yes                       |
| `validate_delegation_and_get_principal_http_post`           | 1,647,814,160 | 1,652,814,160 | 0.02189978762    | No            | No                 | Yes                       |
| Signature verification                                      |               |               |                  |               |                    |                           |
| `verify_sig_http_get`                                       | 128,552,942   | 133,552,942   | 0.0017695764815  | No            | Yes                | No                        |
| `verify_sig_http_post`                                      | 128,472,105   | 133,472,105   | 0.00176850539125 | No            | Yes                | No                        |
| Full flow                                                   |               |               |                  |               |                    |                           |
| `validate_http_signature_headers_http_get_with_delegation`  | 1,777,927,716 | 1,782,927,716 | 0.023623792237   | Yes           | Yes                | Yes                       |
| `validate_http_signature_headers_http_post_with_delegation` | 1,777,843,711 | 1,782,843,711 | 0.02362267917075 | Yes           | Yes                | Yes                       |
| Header parsing and signature verification                   |               |               |                  |               |                    |                           |
| `validate_http_signature_headers_http_get_no_delegation`    | 130,713,090   | 135,713,090   | 0.0017981984425  | Yes           | Yes                | No                        |
| `validate_http_signature_headers_http_post_no_delegation`   | 130,629,443   | 135,629,443   | 0.00179709011975 | Yes           | Yes                | No                        |

## Open Questions and Future Work

- Support for additional signature schemes.
- Improvements in developer tooling.
- Potential standardization efforts.
- Authentication aware response verification.

## Proof of Concept

A proof of concept has been prepared and is available in the [dfinity/http-auth-poc](https://github.com/dfinity/http-auth-poc) repository.

## Conclusion

- Summary of key points.
- Next steps for implementation and adoption.
