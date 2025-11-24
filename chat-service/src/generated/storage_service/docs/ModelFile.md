
# ModelFile


## Properties

Name | Type
------------ | -------------
`id` | string
`url` | string
`filename` | string
`signedUrl` | string
`filetype` | string
`createdAt` | Date
`updatedAt` | Date
`userId` | string

## Example

```typescript
import type { ModelFile } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "url": null,
  "filename": null,
  "signedUrl": null,
  "filetype": null,
  "createdAt": null,
  "updatedAt": null,
  "userId": null,
} satisfies ModelFile

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelFile
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


