# [Search Marvel](http://searchmarvel.herokuapp.com/)

### About
This is a  MEAN stack app using socket.io, and consuming the Twitter API to create a Marvel Comics wiki.  While growing up I've always enjoyed reading comics so I wanted to create an app that reflects that.  I created an API to hold relevant information for most comic book characters in the Marvel universe.  This app utilizes two-way binding from Angular to search in real-time for the users favorite (or not so favorite) comic book character and retrieving biographical information about that character.  The latest original tweets about that character are then shown in each character page.

### Technologies Used
* Express/Node.js
* MongoDB
* Mongoose
* AngularJS
* Socket.io
* JavaScript
* Bootstrap
* Twitter API

### Features
* Search for your favorite comic book character
* Read biographical information for characters in the Marvel universe
* Update information about characters
* See what is trending on Twitter about each character

### Approach Taken
I initially wanted to consume the Marvel API but repeatedly got 500 errors so I changed my approach and created my own API. I found JSON files for the characters and then imported them into MongoDB. This API lets users search for their favorite Marvel character to display however they please.

### Upcoming Additions
* Add responsive design for pictures on the index page.
* Improve performance when searching for characters.

### Screenshots
##### Home
![Home](https://github.com/chyiyenwang/marvel/blob/master/screenshots/Home.png "Home Page")

##### Search
![Search](https://github.com/chyiyenwang/marvel/blob/master/screenshots/Search.png "Search Page")

##### Character
![Search](https://github.com/chyiyenwang/marvel/blob/master/screenshots/Character.png "Character Page")

##### Twitter
![Search](https://github.com/chyiyenwang/marvel/blob/master/screenshots/Twitter.png "Twitter Page")

