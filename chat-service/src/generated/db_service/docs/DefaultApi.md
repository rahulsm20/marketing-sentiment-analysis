# DefaultApi

All URIs are relative to *http://localhost:4004*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**conversationsGet**](DefaultApi.md#conversationsget) | **GET** /conversations | List conversations |
| [**conversationsIdGet**](DefaultApi.md#conversationsidget) | **GET** /conversations/{id} | Get a conversation by ID |
| [**conversationsIdPatch**](DefaultApi.md#conversationsidpatch) | **PATCH** /conversations/{id} | Update a conversation status or metadata |
| [**conversationsPost**](DefaultApi.md#conversationspost) | **POST** /conversations | Create a new conversation |
| [**messagesConversationIdGet**](DefaultApi.md#messagesconversationidget) | **GET** /messages/{conversationId} | Get messages in a conversation |
| [**messagesPost**](DefaultApi.md#messagespost) | **POST** /messages | Create a new message |
| [**productsGet**](DefaultApi.md#productsget) | **GET** /products | Get products by query |



## conversationsGet

> Array&lt;Conversation&gt; conversationsGet(userId)

List conversations

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ConversationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string (optional)
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ConversationsGetRequest;

  try {
    const data = await api.conversationsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;Conversation&gt;**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of conversations |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## conversationsIdGet

> Conversation conversationsIdGet(id)

Get a conversation by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ConversationsIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ConversationsIdGetRequest;

  try {
    const data = await api.conversationsIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Conversation retrieved |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## conversationsIdPatch

> Conversation conversationsIdPatch(id, status, updateConversationRequest)

Update a conversation status or metadata

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ConversationsIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // ConversationStatus
    status: ...,
    // UpdateConversationRequest
    updateConversationRequest: ...,
  } satisfies ConversationsIdPatchRequest;

  try {
    const data = await api.conversationsIdPatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **status** | `ConversationStatus` |  | [Defaults to `undefined`] [Enum: pending, in_progress, completed, scraping, generation, embedding] |
| **updateConversationRequest** | [UpdateConversationRequest](UpdateConversationRequest.md) |  | |

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Conversation updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## conversationsPost

> Conversation conversationsPost(createConversationRequest)

Create a new conversation

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ConversationsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // CreateConversationRequest
    createConversationRequest: ...,
  } satisfies ConversationsPostRequest;

  try {
    const data = await api.conversationsPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createConversationRequest** | [CreateConversationRequest](CreateConversationRequest.md) |  | |

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Conversation created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## messagesConversationIdGet

> Array&lt;Message&gt; messagesConversationIdGet(conversationId, userId)

Get messages in a conversation

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { MessagesConversationIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    conversationId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies MessagesConversationIdGetRequest;

  try {
    const data = await api.messagesConversationIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **conversationId** | `string` |  | [Defaults to `undefined`] |
| **userId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;Message&gt;**](Message.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of messages |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## messagesPost

> Message messagesPost(createMessageRequest)

Create a new message

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { MessagesPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // CreateMessageRequest
    createMessageRequest: ...,
  } satisfies MessagesPostRequest;

  try {
    const data = await api.messagesPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createMessageRequest** | [CreateMessageRequest](CreateMessageRequest.md) |  | |

### Return type

[**Message**](Message.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Message created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## productsGet

> Array&lt;object&gt; productsGet(query)

Get products by query

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ProductsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    query: query_example,
  } satisfies ProductsGetRequest;

  try {
    const data = await api.productsGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **query** | `string` |  | [Defaults to `undefined`] |

### Return type

**Array<object>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of products |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

