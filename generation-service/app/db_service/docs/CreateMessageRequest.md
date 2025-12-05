# CreateMessageRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **str** |  | [optional] 
**conversation_id** | **str** |  | 
**content** | **str** |  | 
**role** | [**MessageRole**](MessageRole.md) |  | 

## Example

```python
from db_service_client.models.create_message_request import CreateMessageRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateMessageRequest from a JSON string
create_message_request_instance = CreateMessageRequest.from_json(json)
# print the JSON string representation of the object
print(CreateMessageRequest.to_json())

# convert the object into a dict
create_message_request_dict = create_message_request_instance.to_dict()
# create an instance of CreateMessageRequest from a dict
create_message_request_from_dict = CreateMessageRequest.from_dict(create_message_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


