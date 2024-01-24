# Homepare API

Homepare API is the backend for the Homepare app.

## Clone Repository

```bash
git clone https://github.com/Team-20-Homies/homepare-backend.git
```


# List of Active Endpoints

https://homepare-backend.onrender.com/



## /homes (GET)
Retrieves list of all homes in DB
```
Required JSON:
{ authorization: “x-access-token <token>” }
```


## /collections (GET/POST)
- GET: retrieves list of all searches
  
```
Required JSON:
userID
{ authorization: “x-access-token <token>” }
```
Returned JSON:

- POST: allows user to create new filter
```
Required JSON:
Search_name
userID
houseID
{ authorization: “x-access-token <token>” }
```
```
Returned JSON: 
_id
Search_name
userID
houseID
```


## /register (POST)
POST: creates user
```
Required JSON:
username
password
email
```
```
Accepted JSON but not Requires:
first_name
last_name
address
```

## /login (POST)
POST: allows the user to login after they have registered. Creates token
```
Required JSON:
username
password
Returned JSON
x-access-token: <token>
userId: <userId>
```

## /user-preference (POST/ PUT)
POST: allows user to add questionnaire results to DB
```
Required JSON(for PUT only send fields being updated):
Address
Bedrooms
Bathrooms
Yard
Garage
Hoa
{ authorization: “x-access-token <token>” }
```
```
Returned JSON:
Address
Bedrooms
Bathrooms
Yard
Garage
Hoa
```
GET: allows the user to see the results of their questionnaire and compare it to homes
```
Required JSON:
{ authorization: “x-access-token <token>” }
```
```
JSON Response:
_id
Address
Bedrooms
Bathrooms
Yard
Garage
Hoa
userID
```

## /homes/:id (GET/PUT)
GET: allows user to view the listing details for each home
PUT: allows the user to edit the listing details for each home
```
Required JSON:
houseID
address
property_type
bedrooms
half_baths
full_baths
living_area
yard
garage
hoa
images
notes
sentiment
archived
CollectionID
{ authorization: “x-access-token <token>” }
```
```
Returned JSON:
houseID
address
property_type
bedrooms
half_baths
full_baths
living_area
yard
garage
hoa
images
notes
sentiment
archived
CollectionID
```

## /collections/:id (PUT)
PUT: allows user to update filter data
```
RequiredJSON:
collectionID
Search_name
userID
houseID
{ authorization: “x-access-token <token>” }
```
```
Returned JSON:
collectionID
Search_name
userID
houseID
```

## /logout (POST)
POST: allows user to logout. Destroys token
```
Required JSON:
{ authorization: “x-access-token <token>” }
```

## /user (PUT)
PUT: allows the user to update username, password, and email
```
Required JSON (Token and only the fields being updated need to be passed):
{ authorization: “x-access-token <token>” }
username
password
email
```
```
Returned JSON:
username
password
email
first_name
last_name
address
```


## /collections-details (GET)
Allows the logged in user to get all collections they have access with imbedded array of homes contained within that collection
```
Required JSON:
{ authorization: “x-access-token <token>” }
```
```
Response:
search_name
searchID
homeArray [ ]
houseID
address
property_type
bedrooms
half_baths
full_baths
living_area
yard
garage
hoa
images
notes
sentiment
archived
CollectionID
```
## /images (GET)
Allows user to scrap Zillow for images based on address
```
Required JSON:
{ authorization: “x-access-token <token>” }
Address (from search bar)
```
```
Response:
{image id: 
     {image size: image url},
}
```