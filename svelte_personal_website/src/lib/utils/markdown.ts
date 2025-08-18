import { marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

// Initialize Shiki highlighter with languages and theme
async function initHighlighter() {
	if (!highlighter) {
		highlighter = await createHighlighter({
			themes: ['github-dark-dimmed'],
			langs: [
				'javascript',
				'typescript',
				'python',
				'bash',
				'shell',
				'json',
				'markdown',
				'yaml',
				'html',
				'css',
				'plaintext'
			]
		});
	}
	return highlighter;
}

export async function renderMarkdown(content: string): Promise<string> {
	// Initialize highlighter first
	const hl = await initHighlighter();
	
	// Handle language aliases
	const langMap: Record<string, string> = {
		'js': 'javascript',
		'ts': 'typescript',
		'py': 'python',
		'sh': 'bash',
		'yml': 'yaml',
		'text': 'plaintext',
		'md': 'markdown'
	};
	
	// Pre-process code blocks to add syntax highlighting
	const processedContent = content.replace(
		/```(\w+)?\n([\s\S]*?)```/g,
		(match, language, code) => {
			const lang = language ? (langMap[language.toLowerCase()] || language.toLowerCase()) : 'plaintext';
			
			try {
				// Use Shiki to highlight the code
				const html = hl.codeToHtml(code.trim(), {
					lang,
					theme: 'github-dark-dimmed'
				});
				
				// Return as HTML comment to preserve it through marked
				return `<!-- HIGHLIGHTED_CODE_START -->${html}<!-- HIGHLIGHTED_CODE_END -->`;
			} catch (error) {
				console.error(`Failed to highlight ${lang}:`, error);
				// Return original if highlighting fails
				return match;
			}
		}
	);
	
	// Configure marked
	marked.setOptions({
		breaks: true,
		gfm: true
	});
	
	// Process with marked
	let html = await marked(processedContent);
	
	// Restore highlighted code blocks
	html = html.replace(
		/<!-- HIGHLIGHTED_CODE_START -->([\s\S]*?)<!-- HIGHLIGHTED_CODE_END -->/g,
		(_match, highlightedCode: string) => {
			return highlightedCode.replace('<pre', '<pre class="shiki-code-block"');
		}
	);
	
	return html;
}