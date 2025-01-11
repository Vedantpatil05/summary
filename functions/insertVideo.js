export default async function handler(req, res) {
        if (req.method !== "POST") {
          return res.status(405).json({ error: "Method not allowed. Use POST." });
        }
      
        try {
          const { summary } = req.body;
      
          // Validate input
          if (!summary || typeof summary !== "string") {
            return res.status(400).json({ error: "Invalid input. 'summary' is required and should be a string." });
          }
      
          // GraphQL mutation query for video_requests table
          const query = `
            mutation insertVideoRequest($summary: String!) {
              insert_video_requests(objects: { summary: $summary }) {
                returning {
                  id
                  summary
                }
              }
            }
          `;
      
          // Send request to Hasura GraphQL API
          const response = await fetch("https://peckulhthvxhspgygnbs.hasura.ap-south-1.nhost.run/v1/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "s3aBLC@yW8S0'goPj!y7',BeMz#Bu#7i",
            },
            body: JSON.stringify({
              query,
              variables: { summary },
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            res.status(200).json(data);
          } else {
            res.status(400).json({
              error: "Failed to insert data",
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
      