// Using dynamic import to handle the ESM module
export async function getNotionClient() {
	const { NotionAPI } = await import("notion-client");
	return new NotionAPI();
}

// Cache the client instance
let clientInstance: any = null;

export async function getNotionAPI() {
	if (!clientInstance) {
		const { NotionAPI } = await import("notion-client");
		clientInstance = new NotionAPI();
	}
	return clientInstance;
}
