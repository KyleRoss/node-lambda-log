# lambdalog.dev

Since Lambda Log has become more widely used and is growing, it was time to upgrade the documentation and web presence of this package. This website provides a brief overview of the package along with much more extensive documentation than previously with just a README file. Here's an overview of the website:

- Statically-generated using [Next.js](https://nextjs.org/).
- Hosted on [Vercel](https://vercel.com/).
- Top-level domain: [lambdalog.dev](https://lambdalog.dev)
- All content is manually managed using MDX files.
- Custom design using [TailwindCSS](https://tailwindcss.com). _No UI Kits._



**This is version 2 of the website.**

The first version of the website used Gatsby and Styled Components which was messy and had multiple issues when running on Github pages. Instead of trying to jerry-rig the old site, I've completely rebuilt the site from the ground-up using Next.js and TailwindCSS with a more user-friendly and accessible design along with much better documentation.



## Getting Started

1. Ensure you have Node v14+ installed on your machine.

2. Clone this repo to your local machine and `cd` to the `node-lambda-log/site` directory.

3. Create a `.env` file in the root of the site and insert the following:

   ```
   TORCHLIGHT_TOKEN=
   ```

   **Note:** In order to render the code blocks locally, you must [sign up](https://app.torchlight.dev/register?plan=free_month) for a free API Key with [Torchlight](https://torchlight.dev/). Paste your API Key as the value of the environment variable above.

4. Run `npm i` in terminal to install the dependencies.

5. Start the application locally using `npm run dev`.

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.



## Documentation Content

The MDX files containing the content of the documentation pages are located in `site/docs`.



## Deployment

This site is built and deployed every time there is a push or merge to the `master` branch. The build process takes place on Vercel and is deployed automatically.
