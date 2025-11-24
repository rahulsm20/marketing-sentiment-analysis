# DefaultApi

All URIs are relative to *http://localhost:4006*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**idGet**](DefaultApi.md#idget) | **GET** /{id} | Get a file by id |
| [**rootPost**](DefaultApi.md#rootpost) | **POST** / | Upload file |



## idGet

> any idGet(id)

Get a file by id

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { IdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies IdGetRequest;

  try {
    const data = await api.idGet(body);
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

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | File retrieved |  -  |
| **404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rootPost

> any rootPost(uploadFileRequest)

Upload file

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { RootPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // UploadFileRequest
    uploadFileRequest: ...,
  } satisfies RootPostRequest;

  try {
    const data = await api.rootPost(body);
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
| **uploadFileRequest** | [UploadFileRequest](UploadFileRequest.md) |  | |

### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | File uploaded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

