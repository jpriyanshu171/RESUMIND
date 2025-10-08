# RESUMIND - AI-Powered Smart Resume Feedback

[![Stars](https://img.shields.io/github/stars/jpriyanshu171/RESUMIND?style=social)](https://github.com/jpriyanshu171/RESUMIND)
[![Forks](https://img.shields.io/github/forks/jpriyanshu171/RESUMIND?style=social)](https://github.com/jpriyanshu171/RESUMIND)

RESUMIND is an AI-powered web application designed to analyze, score, and improve your resume with actionable insights. Get intelligent feedback to help you stand out and land your dream job.

## Key Features & Benefits

*   **AI-Powered Analysis:**  Leverages AI to analyze your resume for keywords, structure, and content quality.
*   **Actionable Insights:**  Provides specific recommendations on how to improve your resume.
*   **ATS Compatibility Check:**  Evaluates your resume's compatibility with Applicant Tracking Systems (ATS).
*   **Resume Scoring:**  Generates a comprehensive score based on various key metrics.
*   **User-Friendly Interface:**  Easy-to-use web interface for seamless resume analysis.
*   **Summary Generation:**  Provides a concise summary of your resume's strengths and weaknesses.
*   **Dockerized:** Easily deployable and scalable using Docker.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** (version 20 or higher) - [https://nodejs.org/](https://nodejs.org/)
*   **npm:** (Node Package Manager) - Usually installed with Node.js
*   **Docker:** (optional, for containerized deployment) - [https://www.docker.com/](https://www.docker.com/)

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/jpriyanshu171/RESUMIND.git
    cd RESUMIND
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This command will start the application in development mode, usually accessible at `http://localhost:3000`.

4.  **Building the Application:**

    To build the application for production:

    ```bash
    npm run build
    ```

5.  **Running with Docker (Optional):**

    ```bash
    docker build -t resumind .
    docker run -p 3000:3000 resumind
    ```

    This will build a Docker image named `resumind` and run it, exposing the application on port 3000.

## Project Structure

```
├── .dockerignore
├── .gitignore
├── Dockerfile
└── app/
    ├── app.css
    └── components/
        ├── ATS.tsx
        ├── Accordion.tsx
        ├── Details.tsx
        ├── FileUploader.tsx
        ├── Navbar.tsx
        ├── ResumeCard.tsx
        ├── ScoreBadge.tsx
        ├── ScoreCircle.tsx
        ├── ScoreGauge.tsx
        ├── Summary.tsx
    └── lib/
        ├── pdf2image.ts
        ├── puter.ts
        ├── utils.ts
```

*   `.dockerignore`: Specifies intentionally untracked files that Docker should ignore.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `Dockerfile`: Configuration file used by Docker to build container images.
*   `app/app.css`: Main CSS file for the application, including Tailwind CSS configurations.
*   `app/components/`: Contains React components used in the application's UI.
*   `app/lib/`: Contains utility functions and helper modules.
    *   `pdf2image.ts`: Converts PDF files to images for analysis.
    *   `puter.ts`: Integration with Puter for user authentication and file storage.
    *   `utils.ts`:  Utility functions like `cn` (classnames) and `formatSize`.

## Usage Examples & API Documentation (if applicable)

This is a front-end application primarily interacting with external services. There's no inherent API documentation for this specific repository.  The `puter.ts` file interacts with the Puter service.  Refer to the Puter documentation for their API usage.

```typescript
// Example usage of cn function from app/lib/utils.ts
import { cn } from "./lib/utils"

function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 bg-blue-500 text-white",
        className
      )}
      {...props}
    />
  )
}
```

## Configuration Options

*   **Environment Variables:**  While not explicitly defined in provided files, the application might rely on environment variables for configurations such as API keys, Puter integration details, etc. Refer to Puter documentation for their required environment variables.

## Contributing Guidelines

We welcome contributions to RESUMIND! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests.
4.  Submit a pull request with a clear description of your changes.

## License Information

License not specified. All rights reserved.

## Acknowledgments

*   This project utilizes the following open-source libraries:
    *   Tailwind CSS
    *   pdfjs-dist
    *   clsx
    *   tailwind-merge
    *   Zustand
*   Thanks to Puter for providing user authentication and file storage solutions.
