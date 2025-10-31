import { analyzeWithESLint } from './services/eslintService.js';
import { analyzeWithAI } from './services/aiService.js';
import { postPRComment } from './services/githubService.js';

export default async function webhookHandler(req, res) {
  const event = req.body;

  if (event.action === 'opened' || event.action === 'synchronize') {
    const prData = event.pull_request;
    const files = await fetchPRFiles(prData);
    
    const eslintResults = analyzeWithESLint(files);
    const aiResults = await analyzeWithAI(files);

    const feedback = generateFeedback(eslintResults, aiResults);  
    await postPRComment(prData, feedback);
  }

  res.status(200).send('Webhook received');
}
