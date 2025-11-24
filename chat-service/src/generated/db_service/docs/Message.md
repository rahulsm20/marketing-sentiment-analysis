
# Message


## Properties

Name | Type
------------ | -------------
`id` | string
`conversationId` | string
`content` | string
`role` | [MessageRole](MessageRole.md)
`createdAt` | Date
`updatedAt` | Date
`userId` | string

## Example

```typescript
import type { Message } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "conversationId": null,
  "content": null,
  "role": null,
  "createdAt": null,
  "updatedAt": null,
  "userId": null,
} satisfies Message

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Message
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


