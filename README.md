

### Transferring to production (docker registry)

#### Step 1 Build the application and docker image
```
docker build --build-arg BUILD_ENV=<<CHOOSE_DEV_OR_PROD>> -t atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>> .
```
Examples:
```
docker build --build-arg BUILD_ENV=dev -t atan-frontend:dev.2.17.26 .
docker build --build-arg BUILD_ENV=prod -t atan-frontend:prod.2.17.26 .
```

#### Step 2 Tag the image
```
docker tag atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>> dockreg.dmrpacific.com/atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>>
```

Examples:
```
docker tag atan-frontend:dev.2.17.26 dockreg.dmrpacific.com/atan-frontend:dev.2.17.26
docker tag atan-frontend:prod.2.17.26 dockreg.dmrpacific.com/atan-frontend:prod.2.17.26

```
#### Step 3 Push image
```
docker push dockreg.dmrpacific.com/atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>>
```

Examples
```
docker push dockreg.dmrpacific.com/atan-frontend:dev.2.17.26
docker push dockreg.dmrpacific.com/atan-frontend:prod.2.17.26


```

#### Step 3 Pull image (from prod server)
```
docker pull dockreg.dmrpacific.com/atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>>
```

Examples
```
docker pull dockreg.dmrpacific.com/atan-frontend:dev.2.17.26
docker pull dockreg.dmrpacific.com/atan-frontend:prod.2.17.26


```
#### Step 4 Stop image (from prod server)
docker stop atan-frontend # stop the old container
docker rm atan-frontend # remove the old container


#### Step 5 Start image (from prod server)
Run image on host port 4000 since dmrpacific will be running on port 3000
```
docker run -d \
  --name atan-frontend \
  --network web \
  dockreg.dmrpacific.com/atan-frontend:<<CHOOSE_DEV_OR_PROD>>.<<MONTH>>.<<DAY>>.<<YEAR>>
```

```
# DEV
docker run -d \
  --name atan-frontend \
  --network web \
  dockreg.dmrpacific.com/atan-frontend:dev.2.17.26


# PROD
docker run -d \
  --name atan-frontend \
  --network web \
  dockreg.dmrpacific.com/atan-frontend:prod.2.17.26
```
### Extra Step - Restarting an older image if current does not work

dadadadada


### Transferring to production without a docker registry
Build image locally

```
docker build -t atan-frontend .
```

save image as tar file for ftp

```
# docker save -o <PATH_TO_WHERE_YOU_WANT_IT>\atan-frontend.tar atan-frontend 

docker save -o C:\Users\nelbo\Documents\DOCKER_TARZ\atan-frontend.tar atan-frontend 
```

FTP using FileZilla

From production server as root change ownership of tar to dockeruser

as root
```
chown dockeruser:dockeruser /home/noahe/atan-frontend.tar
mv /home/noahe/atan-frontend.tar /tmp/
```

as dockeruser
load it into local docker image registery
```
docker load -i /tmp/atan-frontend.tar
```

Run
```
docker run -d -p 4000:4000 atan-frontend
```









# Project Setup
npm install --save-dev dotenv-cli


npm install --save-dev rimraf

npm install --save-dev cpx

keeping updated for time and updated_by
https://medium.com/@tbobm/tracking-row-level-changes-in-postgresql-4455f91ab8d1

tracking changes in postgresql by having a hstory table
https://www.cybertec-postgresql.com/en/tracking-changes-in-postgresql/


INSERT INTO cms.eesuacc (oauid, oapwd, oasts, oalnam, oafnam, oami, oaname, oafoad)
VALUES 
('RICHE_TAITANO', '$2a$10$wB9TbZAPlME5mkoJV4OiOOnydS6.RNz6kjra5HhYw3hR2o12lS4ZO', 'A', 'Taitano', 'Riche', '', 'Taitano, Riche', 'Mr.'),
('CADE_TAITANO', '$2a$10$wB9TbZAPlME5mkoJV4OiOOnydS6.RNz6kjra5HhYw3hR2o12lS4ZO', 'A', 'Taitano', 'Cade', '', 'Taitano, Cade', 'Mr.'),
('NOAH_ELBO', '$2a$10$wB9TbZAPlME5mkoJV4OiOOnydS6.RNz6kjra5HhYw3hR2o12lS4ZO', 'A', 'Elbo', 'Noah', 'L', 'Elbo, Noah', 'Mr.');


INSERT INTO CMS.EESUGM (OMUID, OMGID) 
VALUES 
('RICHE_TAITANO', 'TRACKER'),
('NOAH_ELBO', 'TRACKER'),

('CADE_TAITANO', 'TRACKER');
-- SELECT * FROM CMS.EESUACC
SELECT * FROM CMS.EESUGM 
## Pushing changes to dev/prod environment
Before this section you must:
- Have your build folder ready (prod or dev).
- Have an active user account for dev server (10.69.6.40) and prod server (10.69.88.38). If you do not have one, request for one.
- Set up your filezilla account for file transfer (see 'Setting Up FileZilla for File Transfer' section) to the server.
- Have MOBAX installed and setup for SSH sessions with the servers. (see 'Setting up MOBAX')

Using FileZilla, connect to the server and transfer the build/dev folder or build/prod to a folder in your user account's home directory.

Open MOBAX for the server and log in as 'nodeuser' (the account we use to manage the frontend's pm2 instance)

Navigate to the project directory.
```bash
cd /home/sites/frontends/dmrpacific
```

Stop the application from running.
```bash
pm2 stop dmrpacific
```

Delete the old build.
```bash
sudo rm -fr build
```

Transfer the new build into the project directory as 'build' from wherever you stored it in your home directory.

Replace {{ENVIRONMENT}} with either dev or prod, depending on which build you're deploying.
```bash
sudo mv /home/noahe/{{ENVIRONMENT}} build
```

Navigate to build directory and install packages
```bash
cd build
sudo npm install
```

Start the application using pm2:
```bash
pm2 start atlas
```
You should be able to access the application directly through port 3000. However since we've configured a reverse proxy with NGINX, the server (with HTTPS support) is accessible only via the default ports 443 and 80.


# TailAdmin Next.js - Free Next.js Tailwind Admin Dashboard Template

TailAdmin is a free and open-source admin dashboard template built on **Next.js and Tailwind CSS** providing developers with everything they need to create a feature-rich and data-driven: back-end, dashboard, or admin panel solution for any sort of web project.

![TailAdmin - Next.js Dashboard Preview](./banner.png)

With TailAdmin Next.js, you get access to all the necessary dashboard UI components, elements, and pages required to build a high-quality and complete dashboard or admin panel. Whether you're building a dashboard or admin panel for a complex web application or a simple website.

TailAdmin utilizes the powerful features of **Next.js 16** and common features of Next.js such as server-side rendering (SSR), static site generation (SSG), and seamless API route integration. Combined with the advancements of **React 19** and the robustness of **TypeScript**, TailAdmin is the perfect solution to help get your project up and running quickly.

## Overview

TailAdmin provides essential UI components and layouts for building feature-rich, data-driven admin dashboards and control panels. It's built on:

* Next.js 16.x
* React 19
* TypeScript
* Tailwind CSS V4

### Quick Links

* [✨ Visit Website](https://tailadmin.com)
* [📄 Documentation](https://tailadmin.com/docs)
* [⬇️ Download](https://tailadmin.com/download)
* [🖌️ Figma Design File (Community Edition)](https://www.figma.com/community/file/1463141366275764364)
* [⚡ Get PRO Version](https://tailadmin.com/pricing)

### Demos

* [Free Version](https://nextjs-free-demo.tailadmin.com)
* [Pro Version](https://nextjs-demo.tailadmin.com)

### Other Versions

* [HTML Version](https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template)
* [React Version](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard)
* [Vue.js Version](https://github.com/TailAdmin/vue-tailwind-admin-dashboard)

## Installation

### Prerequisites

To get started with TailAdmin, ensure you have the following prerequisites installed and set up:

* Node.js 18.x or later (recommended to use Node.js 20.x or later)

### Cloning the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard.git
```

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

   > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Components

TailAdmin is a pre-designed starting point for building a web-based dashboard using Next.js and Tailwind CSS. The template includes:

* Sophisticated and accessible sidebar
* Data visualization components
* Profile management and custom 404 page
* Tables and Charts(Line and Bar)
* Authentication forms and input elements
* Alerts, Dropdowns, Modals, Buttons and more
* Can't forget Dark Mode 🕶️

All components are built with React and styled using Tailwind CSS for easy customization.

## Feature Comparison

### Free Version

* 1 Unique Dashboard
* 30+ dashboard components
* 50+ UI elements
* Basic Figma design files
* Community support

### Pro Version

* 7 Unique Dashboards: Analytics, Ecommerce, Marketing, CRM, SaaS, Stocks, Logistics (more coming soon)
* 500+ dashboard components and UI elements
* Complete Figma design file
* Email support

To learn more about pro version features and pricing, visit our [pricing page](https://tailadmin.com/pricing).

## Changelog

### Version 2.1.0 - [November 15, 2025]

* Updated to Next.js 16.x
* Fixed all reported minor bugs

### Version 2.0.2 - [March 25, 2025]

* Upgraded to Next.js 16.x for [CVE-2025-29927](https://nextjs.org/blog/cve-2025-29927) concerns
* Included overrides vectormap for packages to prevent peer dependency errors during installation.
* Migrated from react-flatpickr to flatpickr package for React 19 support

### Version 2.0.1 - [February 27, 2025]

#### Update Overview

* Upgraded to Tailwind CSS v4 for better performance and efficiency.
* Updated class usage to match the latest syntax and features.
* Replaced deprecated class and optimized styles.

#### Next Steps

* Run npm install or yarn install to update dependencies.
* Check for any style changes or compatibility issues.
* Refer to the Tailwind CSS v4 [Migration Guide](https://tailwindcss.com/docs/upgrade-guide) on this release. if needed.
* This update keeps the project up to date with the latest Tailwind improvements. 🚀

### v2.0.0 (February 2025)

A major update focused on Next.js 16 implementation and comprehensive redesign.

#### Major Improvements

* Complete redesign using Next.js 16 App Router and React Server Components
* Enhanced user interface with Next.js-optimized components
* Improved responsiveness and accessibility
* New features including collapsible sidebar, chat screens, and calendar
* Redesigned authentication using Next.js App Router and server actions
* Updated data visualization using ApexCharts for React

#### Breaking Changes

* Migrated from Next.js 14 to Next.js 16
* Chart components now use ApexCharts for React
* Authentication flow updated to use Server Actions and middleware

[Read more](https://tailadmin.com/docs/update-logs/nextjs) on this release.

### v1.3.4 (July 01, 2024)

* Fixed JSvectormap rendering issues

### v1.3.3 (June 20, 2024)

* Fixed build error related to Loader component

### v1.3.2 (June 19, 2024)

* Added ClickOutside component for dropdown menus
* Refactored sidebar components
* Updated Jsvectormap package

### v1.3.1 (Feb 12, 2024)

* Fixed layout naming consistency
* Updated styles

### v1.3.0 (Feb 05, 2024)

* Upgraded to Next.js 14
* Added Flatpickr integration
* Improved form elements
* Enhanced multiselect functionality
* Added default layout component

## License

TailAdmin Next.js Free Version is released under the MIT License.

## Support
If you find this project helpful, please consider giving it a star on GitHub. Your support helps us continue developing and maintaining this template.
