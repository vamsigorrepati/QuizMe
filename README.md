# Welcome to QuizMe!

## About

In the realm of study tools, students are consistently in search of the latest and most effective study techniques to optimize their time spent learning. Quizlet has long dominated this market with its innovative features and rich array of study materials. Nevertheless, over the past few years, many of the features that users have come to appreciate are now obscured behind a paywall. In light of this, students are actively exploring alternative options. Enter Quizme, a Quizlet clone equipped with all the original features of the study platform, bringing it back to the essentials.

QuizMe uses a technology stack of React.js for the presentation tier, Python (Flask) for the application tier, and MySQL for the data management tier.

## Code Structure

- In the `frontend` folder, we include all our components and styling. Every page is build out in a seperate file with a corresponding css file under styles. The RoutesController handles all the navigations and Navbar is a global component where each page is called inside of.

- In the `backend` folder, we have an app.py which handles all the GET and POST calls to the database to retrieve information depending on function. database.py handles the mysql setup and runserver.py actually runs the backend.

- The database is stored in `quizme.sql` where you can dump your contents into this sql file.

## Local Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/en/download/).
2. Install [MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/).
3. In the `frontend` folder, install modules with `npm install`
4. In the `backend` folder, install Python packages with `pip3 install -r requirements.txt`

### Secrets

In the `backend` folder, update `database.py` with your MySQL database credentials:
* `DATABASE_USER`: Your MySQL username
* `DATABASE_PWD`: Your MySQL password
* `DATABASE_HOST`: Your MySQL host (usually "localhost" if the database is on the same machine)
* `DATABASE_PORT`: Your MySQL port (default is 3306)
* `DATABASE_NAME`: The name of your MySQL database
For the remainder of these instructions, replace the relevant variables with your chosen MySQL credentials.

### Import Database

1. Start MySQL using the `mysql` command
2. Run `CREATE DATABASE DATABASE_NAME;`
3. Quit MySQL using the `QUIT;` commmand
4. Import the database using `mysql -uDATABASE_USER -pDATABASE_PWD -hDATABASE_HOST -PDATABASE_PORT DATABASE_NAME < quizme.sql` (Do NOT include any spaces between flags and arguments)

### Run Frontend

In the `frontend` folder, run `npm start`

### Run Backend

In the `backend` folder, run `python3 runserver.py 80`

### Export Database

Export the database using `mysqldump -uDATABASE_USER -pDATABASE_PWD -hDATABASE_HOST -PDATABASE_PORT DATABASE_NAME > quizme.sql` (Do NOT include any spaces between flags and arguments)

### ------- Features ------- ####

Login:
- Email Verification
- Password/User_id hashing

Signup:
- Email, username, and password fields

Verification
- Shows message to verify Email

Home:
- Shows User Recent Activity (if logged in)
- Shows User Streak (if logged in)
- Shows Popular Sets
- Shows Popular Creators (Based on most favortied decks from other users)

Navbar:
- QuizMe (home page reroute)
- Your Library (need to be logged in)
- Search
- Create-set (need to be logged in)
- Login (initial button)
- Profile (replaces login once logged in)

Create-Set:
- Flags, need a title, description, and at least one card
- Add new cards
- Filters out empty cards
- Delete Cards

Edit-Mode Create-Set:
- Delete Cards
- Edit Terms/Definitions
- Delete Deck
- A back to set route
- Clicking Done saves changes and routes you back to the deck

Set-Page:
- Flash Card Functionality
- Can Favorite Other Users/Your Own Decks (If Logged in)
- Can Edit terms/definitions by row (a check to match user_id for the deck with seesion id)
- Add or Remove Button (a check to match user_id for the deck with seesion id)

Library:
- Shows Decks based on dropdown:
- Recent activity: Which set you viewed last
- Created: Your Decks
- Favorites: All your favorited decks
- Can search within each dropdown

Navbar Search Page:
- Can search for study sets, click enter
- Route to Search Page
- Shows Study Sets
- Preview button to view all terms/definitions

Profile:
- Shows your profile and all your sets
- Can view other people's profile by clicking on their username on one of their sets, or if their a top creator on the home page

Setting:
- Allows you to delete your account

### ------- Challenges ------- ####

Our project initially faced a significant challenge: we had to pivot from our original idea after two weeks of collaboration with advisors and YaleHealth. We were planning a Mental Health resource platform intended for all students on campus. However, we realized that our goal was too ambitious given the constraints of our project timeline and the feasibility of a partnership.

We redirected our efforts towards creating QuizMe, a Quizlet-like application. In the planning stage, we brainstormed a wide range of features and mapped them onto our delivery timeline. We started with the front end, crafting each component from scratch and investing substantial time in learning CSS. While using Next.js would have been simpler due to its pre-built components, we found greater satisfaction in developing our own custom styles.

During our weekly check-ins, it became apparent that the initial two-week delay had significantly impacted our progress. The design phase alone consumed a considerable amount of time. Midway through, we decided to collectively focus on developing a functional backend, dedicating numerous hours to understanding MySQL database setup. Though working with Flask and querying the database was relatively familiar territory, thanks to our experience with app.py in problem sets, setting up the initial database with a 'db_creation.txt' file and a 'database.py' to manage MySQL login proved to be challenging.

Once the setup was complete, we delved into the intricate process of determining which routes to create, identifying the necessary information, and strategizing on how to reuse routes to minimize redundant data fetching. This phase was an extensive experimental journey, enhancing our efficiency and deepening our understanding of database structures and the importance of associating IDs with users, decks, cards, favorites, etc., for various functions.

Ultimately, we succeeded in creating a website that we are immensely proud of. It embodies the result of countless late nights and hours of hard work, including extensive debugging. We meticulously tested every aspect of our site, from CSS text-wrapping to dynamic sizing, ensuring that input fields and text remained within their designated containers. The final product is not just a testament to our technical skills but also our resilience and adaptability in the face of unexpected challenges.

### ------- Future Plans ------- ####

Streaks
- In the future, we intend to introduce a 'streak' feature that will log and store recent activities along with their dates. This will enable us to track consecutive activities for displaying streaks. As of now, the front-end interface is ready. The next steps involve integrating a backend 'GET' request and developing a function to calculate the duration of the streak.

Search History
- Adding a search history feature that displays a dropdown of previous searches when a user starts typing would be highly beneficial. It would enable users to easily recall and access the search terms or sets they have looked up in the past.

Search Autofill
- We can enhance the search function by integrating an autofill feature that cross-references the user's input with set title information in our database. This will ensure that the suggestions provided are relevant and match the content we have, improving the overall search experience for the user.

Quiz Functionality
- We currently offer a flashcard feature for studying, but expanding our platform to include a quiz function with multiple-choice questions, fill-in-the-blank exercises, and other interactive formats would greatly enhance user engagement and the overall learning experience.

Dragability
- In the future having a dragability to adjust cards into a different order would be ideal. We started to work on this feature extensivley however ran into many issues of the indexes saving the card correctly. We ended up scraping the feature as it required many changes to the database to get it working.