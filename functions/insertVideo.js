export default async function handler(req, res) {
        // Allow only POST requests
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed. Use POST." });
        }
      
        try {
          // Extract youtube_url and summary from the request body
          const { youtube_url, summary } = req.body;
      
          // Validate inputs
          if (!youtube_url || typeof youtube_url !== "string") {
            return res.status(400).json({ error: "Invalid input. 'youtube_url' is required and should be a string." });
          }
          if (!summary || typeof summary !== "string") {
            return res.status(400).json({ error: "Invalid input. 'summary' is required and should be a string." });
          }
      
          // GraphQL mutation query for updating the video_requests table
          const query = `
            mutation updateVideoRequest($youtube_url: String!, $summary: String!) {
              update_video_requests(
                where: { youtube_url: { _eq: $youtube_url } }, 
                _set: { summary: $summary }
              ) {
                returning {
                  id
                  youtube_url
                  summary
                }
              }
            }
          `;
      
          // Hasura GraphQL endpoint
          const HASURA_GRAPHQL_API = "https://peckulhthvxhspgygnbs.hasura.ap-south-1.nhost.run/v1/graphql";
          const HASURA_ADMIN_SECRET = "s3aBLC@yW8S0'goPj!y7',BeMz#Bu#7i"; // Update with your secret
      
          // Send request to Hasura GraphQL API
          const response = await fetch(HASURA_GRAPHQL_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
            },
            body: JSON.stringify({
              query,
              variables: { youtube_url, summary },
            }),
          });
      
          // Parse the response
          const data = await response.json();
      
          if (response.ok) {
            res.status(200).json(data);
          } else {
            res.status(400).json({
              error: "Failed to update data",
              details: data.errors || "Unknown error occurred",
            });
          }
        } catch (err) {
          res.status(500).json({
            error: "Internal server error",
            details: err.message,
          });
        }
      }
      