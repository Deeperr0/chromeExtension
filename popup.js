// Example usage: Fetch tweet and replies for a specific tweet ID
const tweetId = "1234567890"; // Replace with the actual tweet ID

fetchTweetAndReplies(tweetId)
	.then((data) => {
		if (data) {
			console.log("Fetched tweet and replies:", data);

			// Extracting tweet information
			const tweetInfo = {
				id: data.tweet.id,
				text: data.tweet.text,
				author: {
					username: data.tweet.author.username,
					name: data.tweet.author.name,
				},
				// Extract other tweet-related information as needed
			};

			// Extracting replies information
			const repliesInfo = data.replies.map((reply) => ({
				id: reply.id,
				text: reply.text,
				author: {
					username: reply.author.username,
					name: reply.author.name,
				},
				// Extract other reply-related information as needed
			}));

			// Use tweetInfo and repliesInfo for further processing or UI updates
		}
	})
	.catch((error) => {
		console.error("Error fetching tweet and replies:", error);
	});

// Function to generate a reply using OpenAI API
async function generateReply(prompt) {
	const openaiEndpoint =
		"https://api.openai.com/v1/engines/davinci/completions"; // Replace with the appropriate OpenAI API endpoint

	try {
		const response = await fetch(openaiEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your actual OpenAI API key
			},
			body: JSON.stringify({
				prompt: prompt,
				// Add any other required parameters as per OpenAI's API documentation
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to generate reply from OpenAI API");
		}

		const responseData = await response.json();
		const generatedReply = responseData.choices[0].text.trim(); // Extract generated reply from the response

		return generatedReply;
	} catch (error) {
		console.error("Error generating reply from OpenAI API:", error);
		return null;
	}
}

// Function to update the UI with the generated reply
function updateGeneratedReply(reply) {
	const replyTextArea = document.getElementById("replyText");
	replyTextArea.value = reply;
}
// Function to regenerate reply using background script
function regenerateReply() {
	chrome.runtime.sendMessage({ type: "regenerateReply" }, (response) => {
		if (response && response.generatedReply) {
			updateGeneratedReply(response.generatedReply); // Update the UI with the regenerated reply
		} else {
			console.error("Error regenerating reply");
			// Handle the case where the reply regeneration fails or there's no generated reply
		}
	});
}

// Event listener for the "Generate Reply" button
document.getElementById("generateBtn").addEventListener("click", async () => {
	const tweetData = await fetchTweetAndReplies(); // Fetch tweet data (Replace with your function)

	// Use the fetched tweet data to create a prompt for OpenAI (Customize as needed)
	const prompt = tweetData; // Modify this to structure the prompt based on fetched data

	const generatedReply = await generateReply(prompt); // Generate reply (Replace with your function)
	updateGeneratedReply(generatedReply); // Update the UI with the generated reply

	// Show the output area after generating the reply
	document.getElementById("output").style.display = "block";
});

// Event listener for the "Regenerate" button (to generate a new reply)
document.getElementById("regenerateBtn").addEventListener("click", async () => {
	const tweetData = await fetchTweetAndReplies(); // Fetch tweet data (Replace with your function)

	// Use the fetched tweet data to create a prompt for OpenAI (Customize as needed)
	const prompt = tweetData; // Modify this to structure the prompt based on fetched data

	const regeneratedReply = await generateReply(prompt); // Generate new reply
	updateGeneratedReply(regeneratedReply); // Update the UI with the regenerated reply
});

// Event listener for the "Copy to Clipboard" button
document.getElementById("copyBtn").addEventListener("click", () => {
	const replyTextArea = document.getElementById("replyText");
	replyTextArea.select();
	document.execCommand("copy");
	// Optionally provide some visual feedback or message to the user after copying to clipboard
});

// Function to regenerate reply using background script
function regenerateReply() {
	chrome.runtime.sendMessage({ type: "regenerateReply" }, (response) => {
		if (response && response.generatedReply) {
			updateGeneratedReply(response.generatedReply); // Update the UI with the regenerated reply
		} else {
			console.error("Error regenerating reply");
			// Handle the case where the reply regeneration fails or there's no generated reply
		}
	});
}

// Function to show status message
function showStatusMessage(message, isError = false) {
	const statusElement = document.getElementById("statusMessage");
	statusElement.textContent = message;
	if (isError) {
		statusElement.style.color = "red"; // Optionally style error messages differently
	} else {
		statusElement.style.color = "black"; // Reset color for regular messages
	}
}

// Event listener for the "Regenerate Reply" button
document.getElementById("regenerateBtn").addEventListener("click", () => {
	showStatusMessage("Regenerating reply...");
	regenerateReply().catch((error) => {
		console.error("Error regenerating reply:", error);
		showStatusMessage("Error regenerating reply", true);
	});
});

// Event listener for the "Copy to Clipboard" button
document.getElementById("copyBtn").addEventListener("click", () => {
	copyReplyToClipboard();
	try {
		const successful = document.execCommand("copy");
		if (!successful) {
			throw new Error("Copy to clipboard failed");
		}
		showStatusMessage("Reply copied to clipboard!");
	} catch (error) {
		console.error("Error copying reply:", error);
		showStatusMessage("Error copying reply", true);
	}
});
