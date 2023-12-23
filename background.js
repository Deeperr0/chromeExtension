// Constants or configurations
const TWITTER_API_URL = "https://api.twitter.com/2/tweets/";
const YOUR_TWITTER_BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN"; // Replace with your actual Twitter Bearer token

// Function to fetch tweet and replies based on a tweet ID
async function fetchTweetAndReplies(tweetId) {
	const twitterAPIURL = `${TWITTER_API_URL}${tweetId}/replies`;

	try {
		const response = await fetch(twitterAPIURL, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${YOUR_TWITTER_BEARER_TOKEN}`,
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch tweet and replies. Status: ${response.status}`
			);
		}

		const tweetData = await response.json();
		return tweetData;
	} catch (error) {
		console.error("Error fetching tweet and replies:", error);
		return null;
	}
}

// Function to generate a reply using OpenAI API (replace this with your actual OpenAI API logic)
async function generateReply(prompt) {
	// Implement logic to interact with OpenAI API to generate a reply based on the provided prompt
	// This is a placeholder for demo purposes
	return new Promise((resolve) => {
		// Simulate a delay to mimic API call
		setTimeout(() => {
			const generatedReply = `Generated reply for prompt: "${prompt}"`;
			resolve(generatedReply);
		}, 2000); // Simulating a 2-second delay
	});
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "regenerateReply") {
		// Assuming you have a prompt available for regeneration or fetch tweet data
		const prompt = "Your prompt for regeneration"; // Replace with your actual prompt or fetched tweet data

		generateReply(prompt)
			.then((generatedReply) => {
				if (generatedReply) {
					console.log("Generated reply:", generatedReply);
					sendResponse({ generatedReply }); // Send the generated reply back to the popup
				} else {
					sendResponse({}); // Indicate that reply regeneration failed
				}
			})
			.catch((error) => {
				console.error("Error generating reply:", error);
				sendResponse({}); // Indicate that reply regeneration failed due to an error
			});

		// Return true to inform Chrome that the response will be sent asynchronously
		return true;
	}
});
