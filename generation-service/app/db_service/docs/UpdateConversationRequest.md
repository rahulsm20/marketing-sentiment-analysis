# UpdateConversationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | [**ConversationStatus**](ConversationStatus.md) |  | [optional] 
**openai_conv_id** | **str** |  | [optional] 

## Example

```python
from openapi_client.models.update_conversation_request import UpdateConversationRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateConversationRequest from a JSON string
update_conversation_request_instance = UpdateConversationRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateConversationRequest.to_json())

# convert the object into a dict
update_conversation_request_dict = update_conversation_request_instance.to_dict()
# create an instance of UpdateConversationRequest from a dict
update_conversation_request_from_dict = UpdateConversationRequest.from_dict(update_conversation_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


