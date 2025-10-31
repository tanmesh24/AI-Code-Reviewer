import axios from 'axios';

export const analyzeWithAI = async (files) => {
  const response = await axios.post('https://api-inference.huggingface.co/models/your-model', {
    inputs: files.join('\n')
  }, {
    headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` }
  });
  return response.data;
};
