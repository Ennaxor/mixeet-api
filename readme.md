# MIXEET 

##API
###User endpoints ~~~~
####Signing:
`(GET) /users/signin`

####User private info [auth]:
`(GET) /users/me`

####User public info:
`(GET) /users/:email`

######Parameters: 

* email [string]

####User playlists [auth]:
`(GET) /users/playlists`

####User modify info [auth]:
`(POST) /users/me/modify`

####User new location [auth]:
`(POST) /users/location/new`

######Parameters: 

* api\_reference\_id ~ external api content id

###User endpoints ~~~~

