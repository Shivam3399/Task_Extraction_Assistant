import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function installDependencies() {
  console.log("Installing required Python dependencies...");
  
  const dependencies = [
    "nltk",
    "tabulate",
    "spacy",
    "dateparser"
  ];
  
  for (const dep of dependencies) {
    console.log(`\nInstalling ${dep}...`);
    try {
      const { stdout, stderr } = await execAsync(`pip install ${dep}`);
      console.log(stdout);
    } catch (error) {
      console.error(`Error installing ${dep}:`, error.message);
    }
  }
  
  // Install spaCy English model
  console.log("\nInstalling spaCy English model...");
  try {
    const { stdout, stderr } = await execAsync(`python -m spacy download en_core_web_sm`);
    console.log(stdout);
  } catch (error) {
    console.error("Error installing spaCy English model:", error.message);
  }
}

installDependencies().catch(error => {
  console.error("Error in dependency installation:", error);
});
