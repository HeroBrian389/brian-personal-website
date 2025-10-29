const {
	PUBLIC_GITHUB_PROFILE_URL,
	PUBLIC_LINKEDIN_PROFILE_URL,
	PUBLIC_EMAIL_ADDRESS
} = import.meta.env;

// Social links configuration using environment variables
export const socialLinks = {
	github: PUBLIC_GITHUB_PROFILE_URL ?? "https://github.com/herobrian389",
	linkedin: PUBLIC_LINKEDIN_PROFILE_URL ?? "https://linkedin.com/in/briankelleher0",
	email: PUBLIC_EMAIL_ADDRESS ?? "brian@microdoc.ie"
};

// Extract just the username from GitHub URL for API calls
export const githubUsername = socialLinks.github.split("/").pop() || "herobrian389";
