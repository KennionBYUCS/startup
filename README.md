# Sketch Accuracy Checker
## Specification Deliverables
### Elevator Pitch
Accurately drawing geometric shapes can be difficult without the aid of external tools. What if there was a way to practice? This project compares user-drawn shapes to regular polygons and calculates average accuracy rate based on distance from the center. User-submitted shapes will be automatically scaled and rotated to align with the desired shape type. Users can also locally submit their own simple shapes for practice purposes. Highest accuracy rates for each shape type (not including user-submitted shapes) will be displayed on a scoreboard with all-time high scores. Global high scores for each shape type will be visible for registered users.
### Key Features
There will be three shape types available from a drop-down menu:
1. Regular polygons. The user can select the number of sides on the polygon from `n = 3` sides to `n = 12` sides.
2. Ellipses. The user can select the focal distance of the ellipse. Note a focal distance of 0 will generate a perfect circle.
3. User-generated shapes. The user will first draw a simple curve, then will set a name for their shape. This shape will be stored locally in the drop down menu until the user is logged out of the system.

Once a shape type has been selected, the user will be taken to a screen where they attempt to reproduce their selected shape. The user can select if they would like their chosen shape to be visible or invisible while drawing. Scores will be stored separately in the database for visible and invisible shapes.

The visual center of user-drawn shapes will be located using the algorithm found [here](https://github.com/mapbox/polylabel), then aligned and rotated to match as closely as possible to the original shape. Accuracy will be determined by comparing the scaled distance of points on the curve to the distances on the original curve. 

New shape types can permanently be added from the backend.

### Design
The below images show the separate pages that will be utilized for this program.\
Home page:
![Startup page](startup_pg_1.png)
Login page:
![Login page](startup_pg_2.png)
Shape interface page:
![Main page](startup_pg_3.png)
Drawing page:
![Gameplay page](startup_pg_4.png)

### Technologies Used
I am going to use the required technologies in the following ways.

- **HTML** - Four HTML pages as shown in Design section. Hyperlinks and dropdown menus used to select shape choices.
- **CSS** - Colors, whitespace, and graphic effects while drawing shapes. Scoreboard formatting.
- **JavaScript** - Provides login, buttons, backend calls.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving global and personal high scores
  - submitting global and personal high scores
- **DB/Login** - Store users and high scores in database. Register and login users. Credentials securely stored in database. Can't submit scores unless authenticated.
- **WebSocket** - Notifications are sent to all users when global high scores change.
- **React** - Web framework.

#### Note for the TAs
I'm not terribly familiar with the details for the above technologies, thus I will fill out more specifications as I learn about them and incorporate them into my project.
