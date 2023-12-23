// Function to extract tweet ID from the current Twitter page
function getTweetId() {
	const pathname = window.location.pathname;
	const pathSegments = pathname.split("/");
	const tweetIndex = pathSegments.indexOf("status");

	if (tweetIndex !== -1 && pathSegments.length > tweetIndex + 1) {
		return pathSegments[tweetIndex + 1];
	}

	return null;
}

// Send the tweet ID to the extension's background script
const tweetId = getTweetId();
if (tweetId) {
	chrome.runtime.sendMessage({ type: "tweetId", data: tweetId });
}
