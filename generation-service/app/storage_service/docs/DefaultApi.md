# storage_service_client.DefaultApi

All URIs are relative to *http://localhost:4006*

Method | HTTP request | Description
------------- | ------------- | -------------
[**file_id_get**](DefaultApi.md#file_id_get) | **GET** /file/{id} | Get a file by id
[**file_post**](DefaultApi.md#file_post) | **POST** /file | Upload file


# **file_id_get**
> File file_id_get(id)

Get a file by id

### Example


```python
import storage_service_client
from storage_service_client.models.file import File
from storage_service_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4006
# See configuration.py for a list of all supported configuration parameters.
configuration = storage_service_client.Configuration(
    host = "http://localhost:4006"
)


# Enter a context with an instance of the API client
with storage_service_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = storage_service_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get a file by id
        api_response = api_instance.file_id_get(id)
        print("The response of DefaultApi->file_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->file_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**File**](File.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | File retrieved |  -  |
**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **file_post**
> File file_post(upload_file_request)

Upload file

### Example


```python
import storage_service_client
from storage_service_client.models.file import File
from storage_service_client.models.upload_file_request import UploadFileRequest
from storage_service_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4006
# See configuration.py for a list of all supported configuration parameters.
configuration = storage_service_client.Configuration(
    host = "http://localhost:4006"
)


# Enter a context with an instance of the API client
with storage_service_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = storage_service_client.DefaultApi(api_client)
    upload_file_request = storage_service_client.UploadFileRequest() # UploadFileRequest | 

    try:
        # Upload file
        api_response = api_instance.file_post(upload_file_request)
        print("The response of DefaultApi->file_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->file_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **upload_file_request** | [**UploadFileRequest**](UploadFileRequest.md)|  | 

### Return type

[**File**](File.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | File uploaded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

