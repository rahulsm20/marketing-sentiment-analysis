# File


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**url** | **str** |  | [optional] 
**filename** | **str** |  | 
**signed_url** | **str** |  | 
**filetype** | **str** |  | 
**created_at** | **datetime** |  | [optional] 
**updated_at** | **datetime** |  | [optional] 
**user_id** | **str** |  | [optional] 

## Example

```python
from storage_service_client.models.file import File

# TODO update the JSON string below
json = "{}"
# create an instance of File from a JSON string
file_instance = File.from_json(json)
# print the JSON string representation of the object
print(File.to_json())

# convert the object into a dict
file_dict = file_instance.to_dict()
# create an instance of File from a dict
file_from_dict = File.from_dict(file_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


