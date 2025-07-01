// Type definitions for notion-client
declare module 'notion-client' {
  export class NotionAPI {
    constructor(options?: { apiBaseUrl?: string });
    getPage(pageId: string, options?: any): Promise<any>;
    search(params: any): Promise<any>;
  }
}