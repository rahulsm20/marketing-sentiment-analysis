# openapi_client.DefaultApi

All URIs are relative to *http://localhost:4004*

Method | HTTP request | Description
------------- | ------------- | -------------
[**conversations_get**](DefaultApi.md#conversations_get) | **GET** /conversations | List conversations
[**conversations_id_get**](DefaultApi.md#conversations_id_get) | **GET** /conversations/{id} | Get a conversation by ID
[**conversations_id_patch**](DefaultApi.md#conversations_id_patch) | **PATCH** /conversations/{id} | Update a conversation status or metadata
[**conversations_post**](DefaultApi.md#conversations_post) | **POST** /conversations | Create a new conversation
[**messages_conversation_id_get**](DefaultApi.md#messages_conversation_id_get) | **GET** /messages/{conversationId} | Get messages in a conversation
[**messages_post**](DefaultApi.md#messages_post) | **POST** /messages | Create a new message
[**products_get**](DefaultApi.md#products_get) | **GET** /products | Get products by query


# **conversations_get**
> List[Conversation] conversations_get(user_id=user_id)

List conversations

### Example


```python
import openapi_client
from openapi_client.models.conversation import Conversation
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    user_id = 'user_id_example' # str |  (optional)

    try:
        # List conversations
        api_response = api_instance.conversations_get(user_id=user_id)
        print("The response of DefaultApi->conversations_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->conversations_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | [optional] 

### Return type

[**List[Conversation]**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of conversations |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversations_id_get**
> Conversation conversations_id_get(id)

Get a conversation by ID

### Example


```python
import openapi_client
from openapi_client.models.conversation import Conversation
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 

    try:
        # Get a conversation by ID
        api_response = api_instance.conversations_id_get(id)
        print("The response of DefaultApi->conversations_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->conversations_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Conversation retrieved |  -  |
**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversations_id_patch**
> Conversation conversations_id_patch(id, status, update_conversation_request)

Update a conversation status or metadata

### Example


```python
import openapi_client
from openapi_client.models.conversation import Conversation
from openapi_client.models.conversation_status import ConversationStatus
from openapi_client.models.update_conversation_request import UpdateConversationRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    id = 'id_example' # str | 
    status = openapi_client.ConversationStatus() # ConversationStatus | 
    update_conversation_request = openapi_client.UpdateConversationRequest() # UpdateConversationRequest | 

    try:
        # Update a conversation status or metadata
        api_response = api_instance.conversations_id_patch(id, status, update_conversation_request)
        print("The response of DefaultApi->conversations_id_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->conversations_id_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**|  | 
 **status** | [**ConversationStatus**](.md)|  | 
 **update_conversation_request** | [**UpdateConversationRequest**](UpdateConversationRequest.md)|  | 

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Conversation updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **conversations_post**
> Conversation conversations_post(create_conversation_request)

Create a new conversation

### Example


```python
import openapi_client
from openapi_client.models.conversation import Conversation
from openapi_client.models.create_conversation_request import CreateConversationRequest
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    create_conversation_request = openapi_client.CreateConversationRequest() # CreateConversationRequest | 

    try:
        # Create a new conversation
        api_response = api_instance.conversations_post(create_conversation_request)
        print("The response of DefaultApi->conversations_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->conversations_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_conversation_request** | [**CreateConversationRequest**](CreateConversationRequest.md)|  | 

### Return type

[**Conversation**](Conversation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Conversation created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messages_conversation_id_get**
> List[Message] messages_conversation_id_get(conversation_id, user_id)

Get messages in a conversation

### Example


```python
import openapi_client
from openapi_client.models.message import Message
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    conversation_id = 'conversation_id_example' # str | 
    user_id = 'user_id_example' # str | 

    try:
        # Get messages in a conversation
        api_response = api_instance.messages_conversation_id_get(conversation_id, user_id)
        print("The response of DefaultApi->messages_conversation_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->messages_conversation_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **conversation_id** | **str**|  | 
 **user_id** | **str**|  | 

### Return type

[**List[Message]**](Message.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of messages |  -  |
**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messages_post**
> Message messages_post(create_message_request)

Create a new message

### Example


```python
import openapi_client
from openapi_client.models.create_message_request import CreateMessageRequest
from openapi_client.models.message import Message
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    create_message_request = openapi_client.CreateMessageRequest() # CreateMessageRequest | 

    try:
        # Create a new message
        api_response = api_instance.messages_post(create_message_request)
        print("The response of DefaultApi->messages_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->messages_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_message_request** | [**CreateMessageRequest**](CreateMessageRequest.md)|  | 

### Return type

[**Message**](Message.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Message created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **products_get**
> List[object] products_get(query)

Get products by query

### Example


```python
import openapi_client
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:4004
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost:4004"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.DefaultApi(api_client)
    query = 'query_example' # str | 

    try:
        # Get products by query
        api_response = api_instance.products_get(query)
        print("The response of DefaultApi->products_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->products_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **query** | **str**|  | 

### Return type

**List[object]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | List of products |  -  |
**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

