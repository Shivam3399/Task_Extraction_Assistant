# Task Extraction Assistant

![Task Extraction Assistant](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A powerful web application that extracts actionable tasks from unstructured text. Simply paste your meeting notes, emails, or any text content, and the Task Extraction Assistant will identify and organize tasks, deadlines, assignees, and categories.

## ✨ Features

- **Task Extraction**: Automatically identify tasks from unstructured text
- **Category Classification**: Automatically categorize tasks (Meetings, Documentation, Planning, etc.)
- **Person Assignment**: Identify who is responsible for each task
- **Deadline Detection**: Extract deadlines and due dates from the text
- **Multiple Views**: Toggle between grid and list views
- **Category Filtering**: Filter tasks by category
- **Export Options**: Download tasks as CSV or plain text
- **File Upload**: Upload text files for task extraction
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Natural Language Processing**: Custom algorithms for task extraction

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn

## 🚀 Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/task-extraction-assistant.git
   cd task-extraction-assistant
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## 🌐 Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Deploy

## 📝 Usage

1. **Enter Text**: Type or paste unstructured text in the input area
2. **Upload File**: Alternatively, upload a text file using the upload button
3. **Extract Tasks**: Click the "Extract Tasks" button to process the text
4. **View Results**: Review the extracted tasks, categorized and organized
5. **Filter Tasks**: Use the tabs to filter tasks by category
6. **Change View**: Toggle between grid and list views
7. **Download**: Export tasks as CSV or plain text files

## 📊 Example

Input:
\`\`\`
John needs to submit the quarterly report by Friday. The team should meet to discuss the project at 3 PM tomorrow. Sarah will prepare the presentation slides for the client meeting next week.
\`\`\`

Output:
- Task: Submit quarterly report
  - Who: John
  - Deadline: Friday
  - Category: Documentation

- Task: Meet to discuss the project
  - Who: Team
  - Deadline: Tomorrow at 3 PM
  - Category: Meeting

- Task: Prepare presentation slides
  - Who: Sarah
  - Deadline: Next week
  - Category: Documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Natural language processing techniques inspired by various open-source projects
- UI design inspired by modern web applications
- Special thanks to all contributors and users who provide feedback

---

Made with ❤️ by [Your Name]
