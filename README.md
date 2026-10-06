# PDF-Wallah

PDF Wallah is a comprehensive, web-based suite of PDF productivity tools designed to manipulate, convert, and edit document files quickly and efficiently. Built with modern web technologies, it offers a seamless and responsive user experience with dark mode support.

🛠️ Key Features Overview

Here are the primary features available on PDF Wallah:

Merge PDF (/merge-pdf)

Description: Combine multiple PDF files into one single, unified document.

Split PDF (/split-pdf)

Description: Separate specific pages or extract a custom set of pages for easy document management.

Compress PDF (/compress-pdf)

Description: Reduce PDF file size significantly while retaining optimal visual quality.

PDF to Word (/pdf-to-word)

Description: Convert PDF documents into editable Microsoft Word files (.doc, .docx).

Word to PDF (/word-to-pdf)

Description: Convert Word documents (.doc, .docx) into standardized PDF files.

PDF to Excel (/pdf-to-excel)

Description: Extract tables and structured data straight from PDFs into Excel spreadsheets (.xlsx).

PDF to JPG (/pdf-to-jpg)

Description: Convert entire PDF pages into high-quality JPG images or extract embedded images.

Image to PDF (/image-to-pdf)

Description: Convert various image formats (.jpg, .png, .tiff) into a single PDF document.

PDF Editor (/pdf-editor)

Description: Annotate PDFs by adding custom text, shapes, images, and freehand drawings directly.

OCR PDF (/ocr-pdf)

Description: Use Optical Character Recognition (OCR) to convert scanned PDFs into searchable and selectable text.

🧰 Tech Stack & Dependencies

Frontend Framework: React / Next.js

Icon Library: Lucide React

Styling: Tailwind CSS (with support for Light & Dark mode theme toggling)

Language: TypeScript

🚀 Getting Started

Follow these instructions to run PDF Wallah locally on your system.

Prerequisites

Node.js (v16 or higher)

npm, pnpm, or yarn

Installation

Clone the repository:

git clone https://github.com/your-username/pdf-wallah.git
cd pdf-wallah


Install dependencies:

npm install
# or
pnpm install
# or
yarn install


Run the development server:

npm run dev
# or
pnpm dev
# or
yarn dev


Open in browser:
Navigate to http://localhost:3000 to see the application in action.

📂 Project Structure

├── components/          # Reusable UI components
├── config/
│   └── tools.ts         # Feature configurations (PDF_TOOLS list)
├── pages/ or app/       # Application routes & tool pages
├── public/              # Static assets
└── styles/              # Global styles and Tailwind setup


📄 License

This project is licensed under the MIT License.
