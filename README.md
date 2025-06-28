<a name="readme-top"></a>

<br />
<div align="center">

<h1 align="center">Your Space</h1>


[For the app, click here.](https://your-space-fe.onrender.com)

  <p align="center">
    This is the final project for the master in full stack development at <a href="https://www.start2impact.it"> start2impact University</a>. </br>
The delivery was to develop a mockup web app for a hypothetical client company.
I chose to develop a platform for writing and sharing notes for a company that offers psychotherapy.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
        <li><a href="#setting-up">Setting Up</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#flaws">Flaws</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#feedbacks">Feedbacks</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Project Structure

```
your-space/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── landing-page/
│   │   │   ├── login/
│   │   │   ├── patient/
│   │   │   │   ├── calendar/
│   │   │   │   ├── daily-note/
│   │   │   │   ├── diary/
│   │   │   │   ├── list-of-all-therapists/
│   │   │   │   ├── list-of-features/
│   │   │   │   ├── patient-main-page/
│   │   │   │   └── therapist-card/
│   │   │   ├── register/
│   │   │   ├── therapist/
│   │   │   │   ├── list-of-features/
│   │   │   │   ├── list-of-patients/
│   │   │   │   ├── patient-personal-page/
│   │   │   │   └── therapist-main-page/
│   │   │   └── utilities/
│   │   │       ├── navbar/
│   │   │       ├── note-viewer/
│   │   │       ├── overlay-container/
│   │   │       ├── quill-text-editor/
│   │   │       └── search-bar/
│   │   ├── directives/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── interfaces/
│   │   ├── services/
│   │   └── validators/
│   ├── assets/
│   └── environments/
├── .editorconfig
├── .gitignore
├── README.md
├── angular.json
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json

```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Setting up

The project was developed with Angular 19.

<ol>
  <li>
    Clone the repository:
    
    git clone https://github.com/LonneWW/your-space.git
  </li>
  <li>
    Change directory to the project one:
    
    cd your-space
  </li>
  <li>
    Install packages:
    
    npm install
  </li>
  <li>
    Run the development server and try the app:
    
    ng serve
  </li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![ANGULAR][angular-badge]][angular-url]
- [![ANGULAR-MAT][angular-mat-badge]][angular-mat-url]
- [![TS][typescript-badge]][typescript-url]
- [![HTML5][html-badge]][html-url]
- [![SASS][sass-badge]][sass-url]
- <a href="quilljs.com">Quill</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The use is quite intuitive. </br>
To access the platform you need to register (or login with one of the demo accounts that can be found on the landing page).
</br>
The purpose of the application is purely demonstration and does not involve interactions with real credentials or email. For the use of the application, for example, you will never be asked to access the email address entered, so it is highly recommended to use fictitious data.</br>
As you can see during registration or login, the platform allows access to 2 different types of users: patients and therapists. </br>
The application experience will be different depending on the role chosen.</br>
In both cases, the main page will consist of: at the top the button to display the notifications received and one for browsing the application; below, some cards that will direct the user to the different areas of the application as, for the therapist, the patients list and personal page of the individual patient, for the patient, a calendar to view and manage written notes, and for both dedicated areas to take notes. </br>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FLAWS -->

## Flaws

Since it's a mockup app, I've decided to leave some flaws in order to not get stuck trying to make everything perfect.
Here, a small list:

<ol>
  <li>
    The design of the application is extremely simplistic and generally pretty bad.
  </li>
  <li>
    In the first draft of the application, the "calendar" section should have contained a real calendar implemented through "FullCalendar", but for timing I preferred to postpone it.
  </li>
  <li>
    The security system is really simple and in all likelihood easily bypassed. I would have done better to insert some sort of auth token instead of doing a front-end credential check.
  </li>
  <li>
I could have made the project even more modular. For example, creating a component for individual cards and making the "DiaryComponent" a utility component instead of also using it on the therapist side but leaving it in the patients section.
  </li>
</ol>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

- [![Website Portfolio][site-badge]][site-url]
- [![LinkedIn][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEEDBACKS -->

## Feedbacks

If you'd like to spend some of your time to tell me what you think about it or maybe give me some hints to how you would have done things different, I'll be very, very grateful.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[angular-badge]: https://img.shields.io/badge/Angular-white?style=flat&logo=angular&logoColor=purple
[angular-url]: https://angular.dev
[angular-mat-badge]: https://img.shields.io/badge/Angular%20Material-white?logo=angular&logoColor=%2300fbfb
[angular-mat-url]: https://material.angular.io
[typescript-badge]: https://img.shields.io/badge/Typescript-white?style=flat&logo=typescript&logoColor=%233178C6

[typescript-url]: https://angular.dev](https://www.typescriptlang.org
[html-badge]: https://img.shields.io/badge/HTML-white?style=flat&logo=html5&logoColor=%23E34F26
[html-url]: https://html.it
[sass-badge]: https://img.shields.io/badge/SASS-white?style=flat&logo=sass&logoColor=%23CC6699
[sass-url]: https://sass-lang.com
[site-badge]: https://img.shields.io/badge/Website-grey?style=flat
[site-url]: https://lonneww.github.io/portfolio/
[linkedin-shield]: https://img.shields.io/badge/Linkedin-grey?style=flat&logo=linkedin&logoColor=%230A66C2
[linkedin-url]: https://www.linkedin.com/in/samuel-barbieri-100886208/
