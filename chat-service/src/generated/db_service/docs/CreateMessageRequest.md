
# CreateMessageRequest


## Properties

Name | Type
------------ | -------------
`userId` | string
`conversationId` | string
`content` | string
`role` | [MessageRole](MessageRole.md)

## Example

```typescript
import type { CreateMessageRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "userId": null,
  "conversationId": null,
  "content": null,
  "role": null,
} satisfies CreateMessageRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateMessageRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


