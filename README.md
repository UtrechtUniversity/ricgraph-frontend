# Proof of concept for a modern frontend user interface for Ricgraph (Research in context graph)

This repository contains a proof of concept for a modern 
frontend user interface for Ricgraph 
(Research in context graph, [www.ricgraph.eu](https://www.ricgraph.eu)).
Its purpose is
to inspire people to develop a modern frontend for Ricgraph that fits their needs.
By building such a frontend, you can use the research information in Ricgraph
without the need to build your own backend that
collects and organizes
research information (since all of that is already available and
accessible via the Ricgraph REST API).

Ricgraph has its own user interface that comes with it. 
If you run it, the backend provides a user interface.
The code in this repository will
create a different user interface for Ricgraph,
independent of Ricgraph itself.
You can use it to 
create your own frontend user interface for Ricgraph,
that uses the Ricgraph REST API. It is
written in [TypeScript](https://www.typescriptlang.org) 
and uses [React](https://react.dev) with a 
[Bootstrap theme](https://react-bootstrap.netlify.app).


### Why this code is not used to replace the Ricgraph backend user interface
The code in this repository is not used to replace the Ricgraph backend 
user interface, for the following reasons:
- This code does not implement all features currently in
  the Ricgraph backend user interface.
- Some functionality of this frontend is slower than
  the same functionality in the Ricgraph backend user interface.
- It might contain bugs.
- Since my knowledge of TypeScript and React is limited, I do not
  feel comfortable in maintaining it.
- For some other reasons, read the disclaimer below.

### Disclaimer
The code in this repository is a proof of concept.
It has been developed by a student, by a Large Language Model (LLM),
and by me.
The student was doing an
HBO-ICT Graduation project *Development of a modern
frontend-backend user interface for Ricgraph*, Feb. - Sept. 2026
(read more at
[Ricgraph projects with
students](https://docs.ricgraph.eu/ricgraph_outreach.html#ricgraph-projects-with-students)).
My knowledge of TypeScript and React is not sufficient to be
able to determine whether the resulting code
follows generally accepted guidelines
for writing TypeScript and React using a Bootstrap theme.
Also, I don't know whether the structure
or the componentization that this code uses
is a sensible one.
Please keep this in mind when you reuse this code.

Let me know what you are planning to develop,
and please share it with the community.
I hope it may inspire you to
develop a modern frontend for Ricgraph that fits your needs.

### Contact
For more information, contact 
[Rik D.T. Janssen](https://www.ricgraph.eu/contact.html).


## How to's
In the text below, it is assumed that
[WebStorm from JetBrains](https://www.jetbrains.com/webstorm)
is used. Instructions for other development environments may differ.

### How to install for development

The frontend has been tested on Ricgraph v3.4 and v3.5.

There are several methods to install using WebStorm.

- Using a zip file.
  - Download the zip file from this GitHub repository. Use the green button
    at the top right `<> Code`, and choose *Download ZIP* at the bottom
    of the pop-up window.
  - Unzip it in a directory.
  - Open WebStorm and choose "Open...". Do not use "New Project", 
    because it will overwrite package.json.
  - In the "Open..." dialog, select the directory where your have unzipped
    the zip file above.
- By cloning this GitHub repository in WebStorm.

  Two things may happen after you have started WebStorm (by e.g. clicking on
  its icon).
  - You get the WebStorm opening screen:
    - Make sure that *Version control* is `Git`.
    - In field *URL*,
      type `https://github.com/UtrechtUniversity/ricgraph-frontend`.
    - You may want to change the directory in field *Directory*.
    - Click *Clone*.
  - You get a previously opened repository:
    - From the menubar, 
      choose *File → New → Project from Version Control...*.
    - Make sure that *Version control* is `Git`.
    - In field *URL*, 
      type `https://github.com/UtrechtUniversity/ricgraph-frontend`.
    - You may want to change the directory in field *Directory*.
    - Click *Clone*.

Then continue with the following steps:

- WebStorm may ask you to install the dependencies. If so, answer 'yes'.
- If not, type `npm install` in WebStorms terminal.
- Copy file *vite.config.ts-sample* to *vite.config.ts*. 
- Read the next section to set the link to the Ricgraph backend.

### How to set the link to the Ricgraph backend
To prevent CORS issues, a proxy is set up in this project, 
so you can actually make REST API requests to a running backend. 
If your Ricgraph backend is running locally and on port 3030, 
there should be no issues. If not, you will need to modify
file *vite.config.ts*.

By default, the frontend will access the backend on
[http://127.0.0.1:3030/api](http://127.0.0.1:3030/api).
This will only work if you have installed your own version of Ricgraph.
You may prefer to use an existing backend, such as the backend provided
with the [Pilot project Open Ricgraph demo 
server](https://www.ricgraph.eu/pilot-project-open-ricgraph-demo-server.html).

You can set your Ricgraph backend in file *vite.config.ts* and modify the line
```
const RICGRAPH_API = 'http://127.0.0.1:3030/api';
```
to fit your backend.
You can find the REST API server of the open Ricgraph demo server
by going to the page
[Pilot project Open Ricgraph demo
server](https://www.ricgraph.eu/pilot-project-open-ricgraph-demo-server.html).
That page lists the link to the Open Ricgraph demo server.
Click on it and then 
click the button "REST API doc" in the top bar. 
Then, in the left column, click
on "API servers". Put that value instead of
*http://127.0.0.1:3030/api* in the `const` above.


### How to run
- Type `npm run dev` in WebStorms terminal.
- You can access the frontend in your favorite web browser
  on [http://localhost:5173](http://localhost:5173).

The page will reload if you make edits to the code.
You will also see any lint errors in the console.


### How to debug
This has only done once, so the following may be incorrect.
Follow these steps.

Create a single Run/Debug Configuration in WebStorm:
- In WebStorm, open your project root (where package.json and vite.config.ts live).
- Go to: Run → Edit Configurations...
  - In the left panel, click the + button → choose npm.
  
  Enter the following values:
  - Name: dev (vite)
  - Command: run
  - Scripts: dev
  - Package.json: click ... and select your project’s package.json
  - Click the Browser/Live Edit tab (top of the same dialog).
  - Set: launch browser
  - Browser: Chrome
  - URL: the exact URL where the frontend lives, e.g.
    [http://localhost:5173](http://localhost:5173).
  - Check *Start JavaScript debugger after launch*.

Automagically, a JavaScript debug has been made with the name
*dev (vite) JavaScript*.
- Check whether the values are the same as in the previous list.
- Check Ensure breakpoints are detected when loading scripts (if present).
- Click OK to save.

You should now see *dev* in the run configuration dropdown on the 
WebStorm toolbar.

After doing this, you will be able to set breakpoints in the code and inspect
variables.


### How to build the frontend for production use
Note: this text has not been checked for correctness yet.

- To build the app, type `npm run build`.

This builds the app for production to the *dist* folder.
It bundles the React frontend in production mode and optimizes the 
build for the best performance.
The build is minified, and it includes the hashes,
so your app is ready to be deployed.

For deploying read [Deploy your
  application](https://www.jetbrains.com/help/webstorm/deploying-applications.html), or ask your favorite AI chatbot.
