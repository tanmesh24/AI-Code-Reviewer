import axios from 'axios';

export const postPRComment = async (prData, comment) => {
  const url = prData.comments_url;
  await axios.post(url, {
    body: comment
  }, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
};
