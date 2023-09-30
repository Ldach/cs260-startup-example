# cs260-README.md
## Startup Specification
### Elevator Pitch
I am planning on making a simplified version of Battleship with people online. After creating an account or logging into a pre-existing account, the user has the option to play against a randomly generated or pre-set battleship layout or create their own layout that can be challenged by others. While the opponent's actions will always be decided by the computer, you can also choose to challenge the layout of another user.

### Key Features
**Play Battleship:** Users can play a simplified version of Battleship against a computer

**Save Layouts:** Users will be able to create a ship layout that will be saved and can be challenged by others

**Challenge Others:** Instead of playing against a random setup, you can challenge a layout created by another user


### Technologies
**Authentication:** Upon opening the website, users will be greeted by a login screen where they will be able to create an account or log in. Account information will be saved so they can continue to log in using the same account

**Database data:** Each player can save a board layout to a database that can then be played against by all other users. They can also update their board at any time.

**WebSocket data:** The server will render notifications for when a user creates or updates their board layout

### Images
![Mock](better_battleship_sketch.jpg)
