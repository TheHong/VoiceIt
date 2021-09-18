# VoiceIt

## Setup Instructions
### Setup backend
1. (Optional) Setup a venv and activate it \[[1](#sources)\]
1. ```pip install -r requirements.txt```

### Setup frontend
1. Navigate into frontend folder
1. ```npm install```

## Running Instructions
### Option 1: Seperate servers 
1. Run the backend: ```flask run``` in one terminal at root directory.
1. Run the webpage: ```npm run start``` in another terminal at the frontend folder.
1. Navigate to the webpage indicated in the second terminal.

### Option 2: Same server
1. (Optional if build folder already exists)```npm run build``` in the frontend folder.
1. ```flask run``` at root directory.
1. Navigate to the webpage indicated in the terminal.

### Option 3: Deployed
TBD


## <a name="sources"></a>Sources
\[0\] https://realpython.com/python-virtual-environments-a-primer/